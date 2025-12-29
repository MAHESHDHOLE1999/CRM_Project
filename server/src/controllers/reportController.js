// import Customer from '../models/Customer.js';
// import AdvancedBooking from '../models/AdvancedBooking.js';
// import Item from '../models/Item.js';

// export const getCustomerReport = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { 
//       startDate, 
//       endDate, 
//       status,
//       fitterName,
//       reportType = 'summary' // summary, detailed, fitter-wise
//     } = req.query;

//     const query = { userId };

//     // Date range filter
//     if (startDate || endDate) {
//       query.registrationDate = {};
//       if (startDate) query.registrationDate.$gte = new Date(startDate);
//       if (endDate) query.registrationDate.$lte = new Date(endDate);
//     }

//     // Status filter
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     // Fitter filter
//     if (fitterName && fitterName !== 'all') {
//       query.fitterName = fitterName;
//     }

//     const customers = await Customer.find(query)
//       .populate('items.itemId')
//       .sort({ registrationDate: -1 })
//       .lean();

//     // Calculate summary statistics
//     const summary = {
//       totalBookings: customers.length,
//       totalRevenue: customers.reduce((sum, c) => sum + c.givenAmount, 0),
//       totalPending: customers.reduce((sum, c) => sum + c.remainingAmount, 0),
//       totalAmount: customers.reduce((sum, c) => sum + c.totalAmount, 0),
//       activeBookings: customers.filter(c => c.status === 'Active').length,
//       completedBookings: customers.filter(c => c.status === 'Completed').length,
//       cancelledBookings: customers.filter(c => c.status === 'Cancelled').length
//     };

//     // Fitter-wise breakdown if requested
//     let fitterReport = null;
//     if (reportType === 'fitter-wise') {
//       fitterReport = await Customer.aggregate([
//         { $match: query },
//         {
//           $group: {
//             _id: '$fitterName',
//             totalBookings: { $sum: 1 },
//             totalRevenue: { $sum: '$givenAmount' },
//             totalAmount: { $sum: '$totalAmount' },
//             pendingAmount: { $sum: '$remainingAmount' },
//             activeBookings: {
//               $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
//             },
//             completedBookings: {
//               $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
//             }
//           }
//         },
//         { $sort: { totalRevenue: -1 } }
//       ]);
//     }

//     res.json({
//       success: true,
//       data: {
//         customers,
//         summary,
//         fitterReport,
//         filters: {
//           startDate,
//           endDate,
//           status,
//           fitterName,
//           reportType
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Customer report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating customer report'
//     });
//   }
// };

// export const getItemReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const query = {};
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     const items = await Item.find(query).lean();

//     const summary = {
//       totalItems: items.length,
//       totalQuantity: items.reduce((sum, i) => sum + i.totalQuantity, 0),
//       availableQuantity: items.reduce((sum, i) => sum + i.availableQuantity, 0),
//       rentedQuantity: items.reduce((sum, i) => sum + i.rentedQuantity, 0),
//       totalValue: items.reduce((sum, i) => sum + (i.totalQuantity * i.price), 0),
//       availableItems: items.filter(i => i.status === 'Available').length,
//       inUseItems: items.filter(i => i.status === 'InUse').length,
//       notAvailableItems: items.filter(i => i.status === 'NotAvailable').length
//     };

//     res.json({
//       success: true,
//       data: {
//         items,
//         summary
//       }
//     });
//   } catch (error) {
//     console.error('Item report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating item report'
//     });
//   }
// };

// export const getFinancialReport = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { startDate, endDate } = req.query;

//     const query = { userId };
//     if (startDate || endDate) {
//       query.registrationDate = {};
//       if (startDate) query.registrationDate.$gte = new Date(startDate);
//       if (endDate) query.registrationDate.$lte = new Date(endDate);
//     }

//     const [customers, bookings] = await Promise.all([
//       Customer.find(query).lean(),
//       AdvancedBooking.find({ userId, ...query }).lean()
//     ]);

//     const financial = {
//       totalRevenue: customers.reduce((sum, c) => sum + c.givenAmount, 0),
//       totalBookingAmount: customers.reduce((sum, c) => sum + c.totalAmount, 0),
//       pendingPayments: customers.reduce((sum, c) => sum + c.remainingAmount, 0),
//       depositCollected: customers.reduce((sum, c) => sum + c.depositAmount, 0),
//       transportRevenue: customers.reduce((sum, c) => sum + (c.transportCost || 0), 0),
//       maintenanceCharges: customers.reduce((sum, c) => sum + (c.maintenanceCharges || 0), 0),
//       advancedBookingDeposits: bookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0),
//       collectionRate: 0
//     };

//     if (financial.totalBookingAmount > 0) {
//       financial.collectionRate = ((financial.totalRevenue / financial.totalBookingAmount) * 100).toFixed(2);
//     }

//     // Daily revenue breakdown
//     const dailyRevenue = await Customer.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' } },
//           revenue: { $sum: '$givenAmount' },
//           bookings: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         financial,
//         dailyRevenue
//       }
//     });
//   } catch (error) {
//     console.error('Financial report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating financial report'
//     });
//   }
// };

// export const getAllFitters = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const fitters = await Customer.distinct('fitterName', { 
//       userId, 
//       fitterName: { $exists: true, $ne: null, $ne: '' } 
//     });

//     res.json({
//       success: true,
//       data: fitters
//     });
//   } catch (error) {
//     console.error('Get fitters error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching fitters'
//     });
//   }
// };

// =====================================================
// FILE: backend/controllers/reportController.js
// WITH COMPREHENSIVE DEBUGGING
// =====================================================

import Customer from '../models/Customer.js';
import AdvancedBooking from '../models/AdvancedBooking.js';
import Item from '../models/Item.js';

// ✅ Helper function for consistent logging
const logDebug = (section, message, data = null) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${new Date().toISOString()}] ${section}`);
  console.log(`Message: ${message}`);
  if (data) console.log('Data:', JSON.stringify(data, null, 2));
  console.log(`${'='.repeat(60)}`);
};

export const getCustomerReport = async (req, res) => {
  try {
    logDebug('CUSTOMER REPORT', 'Request received');

    const userId = req.userId;
    const { 
      startDate, 
      endDate, 
      status,
      fitterName,
      reportType = 'summary'
    } = req.query;

    logDebug('CUSTOMER REPORT', 'Query Parameters', {
      userId,
      startDate,
      endDate,
      status,
      fitterName,
      reportType
    });

    const query = { userId };

    // ✅ Build query with debugging
    if (startDate || endDate) {
      query.registrationDate = {};
      
      if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z');
        query.registrationDate.$gte = start;
        logDebug('CUSTOMER REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.registrationDate.$lte = end;
        logDebug('CUSTOMER REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    if (status && status !== 'all') {
      query.status = status;
      logDebug('CUSTOMER REPORT', 'Status Filter Applied', { status });
    }

    if (fitterName && fitterName !== 'all') {
      query.fitterName = fitterName;
      logDebug('CUSTOMER REPORT', 'Fitter Filter Applied', { fitterName });
    }

    logDebug('CUSTOMER REPORT', 'MongoDB Query', { query });

    // ✅ Get customers with debugging
    const customers = await Customer.find(query)
      .populate('items.itemId')
      .sort({ registrationDate: -1 })
      .lean();

    logDebug('CUSTOMER REPORT', `Database Query Result: ${customers.length} customers found`);

    if (customers.length > 0) {
      logDebug('CUSTOMER REPORT', 'Sample Customer Data', {
        sample: customers[0],
        totalCount: customers.length
      });
    } else {
      logDebug('CUSTOMER REPORT', '⚠️ WARNING: No customers found!', { query });
    }

    // ✅ Calculate summary with debugging
    let summary = {
      totalBookings: 0,
      totalRevenue: 0,
      totalPending: 0,
      totalAmount: 0,
      activeBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0
    };

    summary = {
      totalBookings: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + (c.givenAmount || 0), 0),
      totalPending: customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0),
      totalAmount: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
      activeBookings: customers.filter(c => c.status === 'Active').length,
      completedBookings: customers.filter(c => c.status === 'Completed').length,
      cancelledBookings: customers.filter(c => c.status === 'Cancelled').length
    };

    logDebug('CUSTOMER REPORT', 'Summary Calculated', { summary });

    // ✅ Get fitter-wise breakdown with debugging
    logDebug('CUSTOMER REPORT', 'Aggregating fitter report...');
    
    const fitterReport = await Customer.aggregate([
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

    logDebug('CUSTOMER REPORT', `Fitter Report Generated: ${fitterReport.length} fitters`, {
      fitterReport
    });

    // ✅ Build final response
    const responseData = {
      customers,
      summary,
      fitterReport
    };

    logDebug('CUSTOMER REPORT', 'Final Response Data Ready', {
      customersCount: customers.length,
      summary,
      fittersCount: fitterReport.length
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logDebug('CUSTOMER REPORT', '✅ Response sent successfully');

  } catch (error) {
    logDebug('CUSTOMER REPORT', '❌ ERROR OCCURRED', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error generating customer report',
      error: error.message
    });
  }
};

export const getItemReport = async (req, res) => {
  try {
    logDebug('ITEM REPORT', 'Request received');

    const userId = req.userId;
    const { startDate, endDate } = req.query;

    logDebug('ITEM REPORT', 'Query Parameters', {
      userId,
      startDate,
      endDate
    });

    const query = { userId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      
      if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z');
        query.createdAt.$gte = start;
        logDebug('ITEM REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.createdAt.$lte = end;
        logDebug('ITEM REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    logDebug('ITEM REPORT', 'MongoDB Query', { query });

    // ✅ Get items
    const items = await Item.find(query).lean();

    logDebug('ITEM REPORT', `Database Query Result: ${items.length} items found`);

    if (items.length > 0) {
      logDebug('ITEM REPORT', 'Sample Item Data', {
        sample: items[0],
        totalCount: items.length
      });
    } else {
      logDebug('ITEM REPORT', '⚠️ WARNING: No items found!', { query });
    }

    // ✅ Calculate summary
    const summary = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, i) => sum + (i.totalQuantity || 0), 0),
      availableQuantity: items.reduce((sum, i) => sum + (i.availableQuantity || 0), 0),
      rentedQuantity: items.reduce((sum, i) => sum + (i.rentedQuantity || 0), 0),
      totalValue: items.reduce((sum, i) => sum + ((i.totalQuantity || 0) * (i.price || 0)), 0),
      availableItems: items.filter(i => i.status === 'Available').length,
      inUseItems: items.filter(i => i.status === 'InUse').length,
      notAvailableItems: items.filter(i => i.status === 'NotAvailable').length
    };

    logDebug('ITEM REPORT', 'Summary Calculated', { summary });

    // ✅ Build final response
    const responseData = {
      items,
      summary
    };

    logDebug('ITEM REPORT', 'Final Response Data Ready', {
      itemsCount: items.length,
      summary
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logDebug('ITEM REPORT', '✅ Response sent successfully');

  } catch (error) {
    logDebug('ITEM REPORT', '❌ ERROR OCCURRED', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error generating item report',
      error: error.message
    });
  }
};

export const getFinancialReport = async (req, res) => {
  try {
    logDebug('FINANCIAL REPORT', 'Request received');

    const userId = req.userId;
    const { startDate, endDate } = req.query;

    logDebug('FINANCIAL REPORT', 'Query Parameters', {
      userId,
      startDate,
      endDate
    });

    const query = { userId };
    
    if (startDate || endDate) {
      query.registrationDate = {};
      
      if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z');
        query.registrationDate.$gte = start;
        logDebug('FINANCIAL REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.registrationDate.$lte = end;
        logDebug('FINANCIAL REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    logDebug('FINANCIAL REPORT', 'MongoDB Query', { query });

    // ✅ Get customers and bookings
    logDebug('FINANCIAL REPORT', 'Fetching customers and bookings...');

    const [customers, bookings] = await Promise.all([
      Customer.find(query).lean(),
      AdvancedBooking.find({ userId, ...query }).lean()
    ]);

    logDebug('FINANCIAL REPORT', 'Database Query Results', {
      customersCount: customers.length,
      bookingsCount: bookings.length
    });

    if (customers.length > 0) {
      logDebug('FINANCIAL REPORT', 'Sample Customer Financial Data', {
        sample: {
          name: customers[0].name,
          givenAmount: customers[0].givenAmount,
          remainingAmount: customers[0].remainingAmount,
          totalAmount: customers[0].totalAmount,
          extraCharges: customers[0].extraCharges
        },
        totalCustomers: customers.length
      });
    } else {
      logDebug('FINANCIAL REPORT', '⚠️ WARNING: No customers found!');
    }

    // ✅ Calculate financial metrics
    const financial = {
      totalRevenue: customers.reduce((sum, c) => sum + (c.givenAmount || 0), 0),
      totalBookingAmount: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
      pendingPayments: customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0),
      depositCollected: customers.reduce((sum, c) => sum + (c.depositAmount || 0), 0),
      transportRevenue: customers.reduce((sum, c) => sum + (c.transportCost || 0), 0),
      maintenanceCharges: customers.reduce((sum, c) => sum + (c.maintenanceCharges || 0), 0),
      advancedBookingDeposits: bookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0),
      extraChargesCollected: customers.reduce((sum, c) => sum + (c.extraCharges || 0), 0),
      collectionRate: 0
    };

    // ✅ Calculate collection rate
    if (financial.totalBookingAmount > 0) {
      financial.collectionRate = parseFloat(
        ((financial.totalRevenue / financial.totalBookingAmount) * 100).toFixed(2)
      );
    }

    logDebug('FINANCIAL REPORT', 'Financial Metrics Calculated', { financial });

    // ✅ Get daily revenue breakdown
    logDebug('FINANCIAL REPORT', 'Aggregating daily revenue...');

    const dailyRevenue = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$registrationDate'
            }
          },
          revenue: { $sum: '$givenAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    logDebug('FINANCIAL REPORT', `Daily Revenue Generated: ${dailyRevenue.length} days`, {
      dailyRevenue: dailyRevenue.slice(0, 3) // Show first 3 days
    });

    // ✅ Build final response
    const responseData = {
      financial,
      dailyRevenue
    };

    logDebug('FINANCIAL REPORT', 'Final Response Data Ready', {
      financial,
      dailyRevenueCount: dailyRevenue.length
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logDebug('FINANCIAL REPORT', '✅ Response sent successfully');

  } catch (error) {
    logDebug('FINANCIAL REPORT', '❌ ERROR OCCURRED', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error generating financial report',
      error: error.message
    });
  }
};

export const getAllFitters = async (req, res) => {
  try {
    logDebug('FITTERS LIST', 'Request received');

    const userId = req.userId;

    logDebug('FITTERS LIST', 'Query Parameters', { userId });

    // ✅ Get unique fitter names
    logDebug('FITTERS LIST', 'Querying distinct fitter names...');

    const fitters = await Customer.distinct('fitterName', {
      userId,
      fitterName: { $exists: true, $ne: null, $ne: '' }
    });

    logDebug('FITTERS LIST', `Query Result: ${fitters.length} unique fitters found`, {
      fitters
    });

    if (fitters.length === 0) {
      logDebug('FITTERS LIST', '⚠️ WARNING: No fitters found!');
    }

    // ✅ Verify response structure
    logDebug('FITTERS LIST', 'Response Structure', {
      success: true,
      dataType: Array.isArray(fitters) ? 'Array' : typeof fitters,
      dataLength: fitters.length,
      sample: fitters.slice(0, 3)
    });

    // ✅ Send response
    res.json({
      success: true,
      data: fitters
    });

    logDebug('FITTERS LIST', '✅ Response sent successfully', {
      fitters: fitters.length
    });

  } catch (error) {
    logDebug('FITTERS LIST', '❌ ERROR OCCURRED', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: 'Error fetching fitters',
      error: error.message
    });
  }
};