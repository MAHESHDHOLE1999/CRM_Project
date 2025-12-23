import AdvancedBooking from '../models/AdvancedBooking.js';
import Item from '../models/Item.js';
import Customer from '../models/Customer.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Calculate remaining amount
    const remainingAmount = 
      bookingData.totalAmount - (bookingData.givenAmount || 0);

    const booking = await AdvancedBooking.create({
      ...bookingData,
      userId: req.userId,
      remainingAmount
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      startDate, 
      endDate,
      page = 1,
      limit = 50
    } = req.query;
    
    const query = { userId: req.userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) {
        query.bookingDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.bookingDate.$lte = new Date(endDate);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      AdvancedBooking.find(query)
        .sort({ bookingDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      AdvancedBooking.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await AdvancedBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.totalAmount !== undefined || 
        updateData.givenAmount !== undefined) {
      const booking = await AdvancedBooking.findById(id);
      
      if (booking) {
        updateData.remainingAmount = 
          (updateData.totalAmount ?? booking.totalAmount) - 
          (updateData.givenAmount ?? booking.givenAmount);
      }
    }

    const booking = await AdvancedBooking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await AdvancedBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
};

// export const confirmBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await AdvancedBooking.findByIdAndUpdate(
//       id,
//       { status: 'Confirmed' },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Booking confirmed successfully',
//       data: booking
//     });
//   } catch (error) {
//     console.error('Confirm booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error confirming booking'
//     });
//   }
// };
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { convertToCustomer } = req.body;

    const booking = await AdvancedBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking status
    booking.status = 'Confirmed';
    await booking.save();

    // If convertToCustomer is true, create a customer record
    if (convertToCustomer) {
      const items = JSON.parse(booking.items || '[]');
      
      // Create customer from booking
      const customer = await Customer.create({
        name: booking.customerName,
        phone: booking.phone,
        address: '',
        registrationDate: new Date(),
        checkInDate: booking.bookingDate,
        checkInTime: booking.startTime,
        checkOutDate: null,
        checkOutTime: null,
        totalAmount: booking.totalAmount,
        depositAmount: booking.depositAmount,
        givenAmount: booking.givenAmount,
        remainingAmount: booking.remainingAmount,
        transportRequired: false,
        transportCost: 0,
        maintenanceCharges: 0,
        status: 'Active',
        notes: `Converted from Advanced Booking. Original booking date: ${booking.bookingDate}. ${booking.notes || ''}`,
        items: items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price
        })),
        userId: booking.userId
      });

      // Update item quantities - rent the items
      for (const item of items) {
        const itemDoc = await Item.findById(item.itemId);
        if (itemDoc) {
          await itemDoc.rentItem(item.quantity);
        }
      }

      return res.json({
        success: true,
        message: 'Booking confirmed and converted to customer',
        data: {
          booking,
          customer
        }
      });
    }

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming booking'
    });
  }
};

// export const cancelBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await AdvancedBooking.findByIdAndUpdate(
//       id,
//       { status: 'Cancelled' },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Booking cancelled successfully',
//       data: booking
//     });
//   } catch (error) {
//     console.error('Cancel booking error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error cancelling booking'
//     });
//   }
// };
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await AdvancedBooking.findByIdAndUpdate(
      id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings] = await Promise.all([
      AdvancedBooking.countDocuments({ userId }),
      AdvancedBooking.countDocuments({ userId, status: 'Pending' }),
      AdvancedBooking.countDocuments({ userId, status: 'Confirmed' }),
      AdvancedBooking.countDocuments({ userId, status: 'Cancelled' })
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings
      }
    });
  } catch (error) {
    console.error('Booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics'
    });
  }
};