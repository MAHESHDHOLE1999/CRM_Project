import Customer from '../models/Customer.js';
import AdvancedBooking from '../models/AdvancedBooking.js';
import Item from '../models/Item.js';

export const getCustomerReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      startDate, 
      endDate, 
      status,
      fitterName,
      reportType = 'summary' // summary, detailed, fitter-wise
    } = req.query;

    const query = { userId };

    // Date range filter
    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) query.registrationDate.$gte = new Date(startDate);
      if (endDate) query.registrationDate.$lte = new Date(endDate);
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fitter filter
    if (fitterName && fitterName !== 'all') {
      query.fitterName = fitterName;
    }

    const customers = await Customer.find(query)
      .populate('items.itemId')
      .sort({ registrationDate: -1 })
      .lean();

    // Calculate summary statistics
    const summary = {
      totalBookings: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.givenAmount, 0),
      totalPending: customers.reduce((sum, c) => sum + c.remainingAmount, 0),
      totalAmount: customers.reduce((sum, c) => sum + c.totalAmount, 0),
      activeBookings: customers.filter(c => c.status === 'Active').length,
      completedBookings: customers.filter(c => c.status === 'Completed').length,
      cancelledBookings: customers.filter(c => c.status === 'Cancelled').length
    };

    // Fitter-wise breakdown if requested
    let fitterReport = null;
    if (reportType === 'fitter-wise') {
      fitterReport = await Customer.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$fitterName',
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$givenAmount' },
            totalAmount: { $sum: '$totalAmount' },
            pendingAmount: { $sum: '$remainingAmount' },
            activeBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
            },
            completedBookings: {
              $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
            }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);
    }

    res.json({
      success: true,
      data: {
        customers,
        summary,
        fitterReport,
        filters: {
          startDate,
          endDate,
          status,
          fitterName,
          reportType
        }
      }
    });
  } catch (error) {
    console.error('Customer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating customer report'
    });
  }
};

export const getItemReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const items = await Item.find(query).lean();

    const summary = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + i.totalQuantity, 0),
      availableQuantity: items.reduce((sum, i) => sum + i.availableQuantity, 0),
      rentedQuantity: items.reduce((sum, i) => sum + i.rentedQuantity, 0),
      totalValue: items.reduce((sum, i) => sum + (i.totalQuantity * i.price), 0),
      availableItems: items.filter(i => i.status === 'Available').length,
      inUseItems: items.filter(i => i.status === 'InUse').length,
      notAvailableItems: items.filter(i => i.status === 'NotAvailable').length
    };

    res.json({
      success: true,
      data: {
        items,
        summary
      }
    });
  } catch (error) {
    console.error('Item report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating item report'
    });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const query = { userId };
    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) query.registrationDate.$gte = new Date(startDate);
      if (endDate) query.registrationDate.$lte = new Date(endDate);
    }

    const [customers, bookings] = await Promise.all([
      Customer.find(query).lean(),
      AdvancedBooking.find({ userId, ...query }).lean()
    ]);

    const financial = {
      totalRevenue: customers.reduce((sum, c) => sum + c.givenAmount, 0),
      totalBookingAmount: customers.reduce((sum, c) => sum + c.totalAmount, 0),
      pendingPayments: customers.reduce((sum, c) => sum + c.remainingAmount, 0),
      depositCollected: customers.reduce((sum, c) => sum + c.depositAmount, 0),
      transportRevenue: customers.reduce((sum, c) => sum + (c.transportCost || 0), 0),
      maintenanceCharges: customers.reduce((sum, c) => sum + (c.maintenanceCharges || 0), 0),
      advancedBookingDeposits: bookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0),
      collectionRate: 0
    };

    if (financial.totalBookingAmount > 0) {
      financial.collectionRate = ((financial.totalRevenue / financial.totalBookingAmount) * 100).toFixed(2);
    }

    // Daily revenue breakdown
    const dailyRevenue = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' } },
          revenue: { $sum: '$givenAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        financial,
        dailyRevenue
      }
    });
  } catch (error) {
    console.error('Financial report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating financial report'
    });
  }
};

export const getAllFitters = async (req, res) => {
  try {
    const userId = req.userId;
    const fitters = await Customer.distinct('fitterName', { 
      userId, 
      fitterName: { $exists: true, $ne: null, $ne: '' } 
    });

    res.json({
      success: true,
      data: fitters
    });
  } catch (error) {
    console.error('Get fitters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fitters'
    });
  }
};