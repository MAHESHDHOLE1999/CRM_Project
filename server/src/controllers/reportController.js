// =====================================================
// FILE: backend/controllers/reportController.js
// WITH COMPREHENSIVE DEBUGGING
// =====================================================

import Customer from '../models/Customer.js';
import AdvancedBooking from '../models/AdvancedBooking.js';
import Item from '../models/Item.js';
import logger from '../../utils/logger.js';

// ✅ Helper function for consistent logging
const logDebug = (section, message, data = null) => {
  logger.info(`\n${'='.repeat(60)}`);
  logger.info(`[${new Date().toISOString()}] ${section}`);
  logger.info(`Message: ${message}`);
  if (data) logger.info('Data:', JSON.stringify(data, null, 2));
  logger.info(`${'='.repeat(60)}`);
};

export const getCustomerReport = async (req, res) => {
  try {
    logger.info('CUSTOMER REPORT', 'Request received');

    const userId = req.userId;
    const { 
      startDate, 
      endDate, 
      status,
      fitterName,
      reportType = 'summary'
    } = req.query;

    logger.info('CUSTOMER REPORT', 'Query Parameters', {
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
        logger.info('CUSTOMER REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.registrationDate.$lte = end;
        logger.info('CUSTOMER REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    if (status && status !== 'all') {
      query.status = status;
      logger.info('CUSTOMER REPORT', 'Status Filter Applied', { status });
    }

    if (fitterName && fitterName !== 'all') {
      query.fitterName = fitterName;
      logger.info('CUSTOMER REPORT', 'Fitter Filter Applied', { fitterName });
    }

    logger.info('CUSTOMER REPORT', 'MongoDB Query', { query });

    // ✅ Get customers with debugging
    const customers = await Customer.find(query)
      .populate('items.itemId')
      .sort({ registrationDate: -1 })
      .lean();

    logger.info('CUSTOMER REPORT', `Database Query Result: ${customers.length} customers found`);

    if (customers.length > 0) {
      logger.info('CUSTOMER REPORT', 'Sample Customer Data', {
        sample: customers[0],
        totalCount: customers.length
      });
    } else {
      logger.info('CUSTOMER REPORT', '⚠️ WARNING: No customers found!', { query });
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

    logger.info('CUSTOMER REPORT', 'Summary Calculated', { summary });

    // ✅ Get fitter-wise breakdown with debugging
    logger.info('CUSTOMER REPORT', 'Aggregating fitter report...');
    
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

    logger.info('CUSTOMER REPORT', `Fitter Report Generated: ${fitterReport.length} fitters`, {
      fitterReport
    });

    // ✅ Build final response
    const responseData = {
      customers,
      summary,
      fitterReport
    };

    logger.info('CUSTOMER REPORT', 'Final Response Data Ready', {
      customersCount: customers.length,
      summary,
      fittersCount: fitterReport.length
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logger.info('CUSTOMER REPORT', '✅ Response sent successfully');

  } catch (error) {
    logger.info('CUSTOMER REPORT', '❌ ERROR OCCURRED', {
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
    logger.info('ITEM REPORT', 'Request received');

    const userId = req.userId;
    const { startDate, endDate } = req.query;

    logger.info('ITEM REPORT', 'Query Parameters', {
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
        logger.info('ITEM REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.createdAt.$lte = end;
        logger.info('ITEM REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    logDebug('ITEM REPORT', 'MongoDB Query', { query });

    // ✅ FIX #3: Query with proper debugging
    logger.info('🔍 Querying Item model with:', JSON.stringify(query, null, 2));
    // ✅ Get items
    const items = await Item.find(query).lean();

    logger.info('ITEM REPORT', `Database Query Result: ${items.length} items found`);
    if (items.length > 0) {
      logger.info('ITEM REPORT', 'Sample Item Data', {
        sample: items[0],
        totalCount: items.length,
        allItemIds: items.map(i => i._id)
      });
    } else {
      logger.info('ITEM REPORT', '⚠️ WARNING: No items found!', { query });
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

    logger.info('ITEM REPORT', 'Summary Calculated', { summary });

    // ✅ Build final response
    const responseData = {
      items,
      summary
    };

    logger.info('ITEM REPORT', 'Final Response Data Ready', {
      itemsCount: items.length,
      summary,
      responseStructure: Object.keys(responseData)
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logger.info('ITEM REPORT', '✅ Response sent successfully');

  } catch (error) {
    logger.info('ITEM REPORT', '❌ ERROR OCCURRED', {
      message: error.message,
      stack: error.stack,
      errorType: error.name
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
    logger.info('FINANCIAL REPORT', 'Request received');

    const userId = req.userId;
    const { startDate, endDate } = req.query;

    logger.info('FINANCIAL REPORT', 'Query Parameters', {
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
        logger.info('FINANCIAL REPORT', 'Start Date Filter Applied', {
          input: startDate,
          parsed: start.toISOString()
        });
      }
      
      if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        query.registrationDate.$lte = end;
        logger.info('FINANCIAL REPORT', 'End Date Filter Applied', {
          input: endDate,
          parsed: end.toISOString()
        });
      }
    }

    logger.info('FINANCIAL REPORT', 'MongoDB Query', { query });

    // ✅ Get customers and bookings
    logger.info('FINANCIAL REPORT', 'Fetching customers and bookings...');

    const [customers, bookings] = await Promise.all([
      Customer.find(query).lean(),
      AdvancedBooking.find({ userId, ...query }).lean()
    ]);

    logger.info('FINANCIAL REPORT', 'Database Query Results', {
      customersCount: customers.length,
      bookingsCount: bookings.length
    });

    if (customers.length > 0) {
      logger.info('FINANCIAL REPORT', 'Sample Customer Financial Data', {
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
      logger.info('FINANCIAL REPORT', '⚠️ WARNING: No customers found!');
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

    logger.info('FINANCIAL REPORT', 'Financial Metrics Calculated', { financial });

    // ✅ Get daily revenue breakdown
    logger.info('FINANCIAL REPORT', 'Aggregating daily revenue...');

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

    logger.info('FINANCIAL REPORT', `Daily Revenue Generated: ${dailyRevenue.length} days`, {
      dailyRevenue: dailyRevenue.slice(0, 3) // Show first 3 days
    });

    // ✅ Build final response
    const responseData = {
      financial,
      dailyRevenue
    };

    logger.info('FINANCIAL REPORT', 'Final Response Data Ready', {
      financial,
      dailyRevenueCount: dailyRevenue.length
    });

    // ✅ Send response
    res.json({
      success: true,
      data: responseData
    });

    logger.info('FINANCIAL REPORT', '✅ Response sent successfully');

  } catch (error) {
    logger.error('FINANCIAL REPORT', '❌ ERROR OCCURRED', {
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
    logger.info('FITTERS LIST', 'Request received');

    const userId = req.userId;

    logger.info('FITTERS LIST', 'Query Parameters', { userId });

    // ✅ Get unique fitter names
    logger.info('FITTERS LIST', 'Querying distinct fitter names...');

    const fitters = await Customer.distinct('fitterName', {
      userId,
      fitterName: { $exists: true, $ne: null, $ne: '' }
    });

    logger.info('FITTERS LIST', `Query Result: ${fitters.length} unique fitters found`, {
      fitters
    });

    if (fitters.length === 0) {
      logger.warn('FITTERS LIST', '⚠️ WARNING: No fitters found!');
    }

    // ✅ Verify response structure
    logger.info('FITTERS LIST', 'Response Structure', {
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

    logger.info('FITTERS LIST', '✅ Response sent successfully', {
      fitters: fitters.length
    });

  } catch (error) {
    logger.error('FITTERS LIST', '❌ ERROR OCCURRED', {
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