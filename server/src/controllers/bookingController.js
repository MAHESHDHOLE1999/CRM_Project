// =====================================================
// FILE: backend/controllers/bookingController.js (UPDATED)
// =====================================================

import AdvancedBooking from '../models/AdvancedBooking.js';
import Customer from '../models/Customer.js';
import Item from '../models/Item.js';
import logger from '../../utils/logger.js';
import { getAccessibleUserIds } from '../utils/accessControl.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const items = JSON.parse(bookingData.items || '[]');

    logger.info('🔵 CREATE BOOKING - Starting');
    logger.info('Customer:', bookingData.customerName);
    logger.info('Registration Date:', bookingData.registrationDate);
    logger.info('Booking Date:', bookingData.bookingDate);

    // ✅ Check availability before creating booking
    const availabilityCheck = await checkItemsAvailability(items);
    if (!availabilityCheck.allAvailable) {
      logger.warn('❌ Items not available:', availabilityCheck.unavailable);
      return res.status(400).json({
        success: false,
        message: 'Some items are not available in requested quantity',
        unavailableItems: availabilityCheck.unavailable
      });
    }

    // Calculate remaining amount
    const remainingAmount = 
      bookingData.totalAmount - (bookingData.givenAmount || 0);

    // Create booking
    const booking = await AdvancedBooking.create({
      ...bookingData,
      userId: req.userId,
      registrationDate: new Date(bookingData.registrationDate),
      bookingDate: new Date(bookingData.bookingDate),
      remainingAmount
    });

    logger.info('✅ Booking created:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    // console.error('Create booking error:', error);
    logger.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
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
    
    // const query = { userId: req.userId };
    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);
    
    const query = { userId: { $in: accessibleUserIds } };
    
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

    logger.info(`✅ Fetched ${bookings.length} bookings`);

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
    // console.error('Get bookings error:', error);
    logger.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('🔵 GET BOOKING:', id);
    
    // const booking = await AdvancedBooking.findById(id);
    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);
    
    const booking = await AdvancedBooking.findOne({
      _id: id,
      userId: { $in: accessibleUserIds }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // ✅ Format dates for response
    const response = booking.toObject();
    if (response.registrationDate) {
      response.registrationDate = response.registrationDate.toISOString().split('T')[0];
    }
    if (response.bookingDate) {
      response.bookingDate = response.bookingDate.toISOString().split('T')[0];
    }

    logger.info('✅ Booking found:', booking.customerName);

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    // console.error('Get booking error:', error);
    logger.error('Get booking error:', error);
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

    logger.info('🔵 UPDATE BOOKING:', id);

    // ✅ Convert dates if present
    if (updateData.registrationDate) {
      updateData.registrationDate = new Date(updateData.registrationDate);
    }
    if (updateData.bookingDate) {
      updateData.bookingDate = new Date(updateData.bookingDate);
    }

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
    
    logger.info('✅ Booking updated:', booking._id);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    // console.error('Update booking error:', error);
    logger.error('Update booking error:', error);
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
    // console.error('Delete booking error:', error);
    logger.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
};

// ✅ UPDATED: Confirm booking with item renting
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

    logger.info('✅ Booking status updated to Confirmed');

    // If convertToCustomer is true, create a customer record
    if (convertToCustomer) {
      const items = JSON.parse(booking.items || '[]');

      // ✅ Check availability before renting
      const availabilityCheck = await checkItemsAvailability(items);
      if (!availabilityCheck.allAvailable) {
        logger.warn('❌ Items not available for conversion:', availabilityCheck.unavailable);
        return res.status(400).json({
          success: false,
          message: 'Some items are no longer available',
          unavailableItems: availabilityCheck.unavailable
        });
      }

      // ✅ Rent the items
      await rentItems(items);

      // Create customer from booking
      const customer = await Customer.create({
        name: booking.customerName,
        phone: booking.phone,
        address: '',
        registrationDate: new Date(booking.registrationDate),
        checkInDate: new Date(booking.bookingDate),
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
        // hourlyRate: 0,
        status: 'Active',
        notes: `Converted from Advanced Booking (ID: ${booking._id}). Original booking date: ${booking.bookingDate}. ${booking.notes || ''}`,
        items: items.map(item => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price
        })),
        userId: booking.userId
      });

      logger.info('✅ Customer created from booking:', customer._id);

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
    // console.error('Confirm booking error:', error);
    logger.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming booking'
    });
  }
};

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
    // console.error('Cancel booking error:', error);
    logger.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    // const userId = req.userId;

    // const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings] = await Promise.all([
    //   AdvancedBooking.countDocuments({ userId }),
    //   AdvancedBooking.countDocuments({ userId, status: 'Pending' }),
    //   AdvancedBooking.countDocuments({ userId, status: 'Confirmed' }),
    //   AdvancedBooking.countDocuments({ userId, status: 'Cancelled' })
    // ]);
    // ✅ Get accessible user IDs
    const accessibleUserIds = await getAccessibleUserIds(req.userId, User);

    const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings] = await Promise.all([
      AdvancedBooking.countDocuments({ userId: { $in: accessibleUserIds } }),
      AdvancedBooking.countDocuments({ userId: { $in: accessibleUserIds }, status: 'Pending' }),
      AdvancedBooking.countDocuments({ userId: { $in: accessibleUserIds }, status: 'Confirmed' }),
      AdvancedBooking.countDocuments({ userId: { $in: accessibleUserIds }, status: 'Cancelled' })
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
    // console.error('Booking stats error:', error);
    logger.error('Booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking statistics'
    });
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Check if all items are available in requested quantity
async function checkItemsAvailability(items) {
  const unavailable = [];
  let allAvailable = true;

  for (const item of items) {
    const itemDoc = await Item.findById(item.itemId);
    if (!itemDoc || itemDoc.availableQuantity < item.quantity) {
      allAvailable = false;
      unavailable.push({
        itemId: item.itemId,
        itemName: item.itemName,
        requestedQuantity: item.quantity,
        availableQuantity: itemDoc?.availableQuantity || 0
      });
    }
  }

  return { allAvailable, unavailable };
}

// Rent items and update quantities
async function rentItems(items) {
  for (const item of items) {
    const itemDoc = await Item.findById(item.itemId);
    if (itemDoc) {
      itemDoc.availableQuantity -= item.quantity;
      itemDoc.rentedQuantity += item.quantity;
      
      // Auto-update status
      if (itemDoc.availableQuantity === 0) {
        itemDoc.status = 'NotAvailable';
      } else if (itemDoc.rentedQuantity > 0) {
        itemDoc.status = 'InUse';
      }
      
      await itemDoc.save();
    }
  }
}

// Return items and update quantities
async function returnItems(items) {
  for (const item of items) {
    const itemDoc = await Item.findById(item.itemId);
    if (itemDoc) {
      itemDoc.availableQuantity += item.quantity;
      itemDoc.rentedQuantity -= item.quantity;
      
      // Auto-update status
      if (itemDoc.rentedQuantity === 0) {
        itemDoc.status = 'Available';
      } else {
        itemDoc.status = 'InUse';
      }
      
      await itemDoc.save();
    }
  }
}