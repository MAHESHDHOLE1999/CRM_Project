// //Version 2
import Customer from '../models/Customer.js';
import Item from '../models/Item.js';
import logger from '../../utils/logger.js';

// =====================================================
// CREATE CUSTOMER - RENT ITEMS
// =====================================================
// export const createCustomer = async (req, res) => {
//   try {
//     const customerData = req.body;
//     const items = customerData.items || [];

//     console.log('🔵 CREATE CUSTOMER - Starting');
//     console.log('📦 Items to rent:', items);

//     // ✅ Check availability before creating customer
//     const availabilityCheck = await checkItemsAvailability(items);
//     if (!availabilityCheck.allAvailable) {
//       console.error('❌ Items not available:', availabilityCheck.unavailable);
//       return res.status(400).json({
//         success: false,
//         message: 'Some items are not available in requested quantity',
//         unavailableItems: availabilityCheck.unavailable
//       });
//     }

//     const remainingAmount = 
//       customerData.totalAmount - (customerData.givenAmount || 0);

//     // ✅ Initialize rental history
//     const initialHistory = {
//       action: 'created',
//       itemsUsed: items || [],
//       totalQuantityUsed: (items || []).reduce((sum, item) => sum + item.quantity, 0),
//       totalValueUsed: (items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//       status: 'Active',
//       notes: 'Customer created'
//     };

//     const customer = await Customer.create({
//       ...customerData,
//       userId: req.userId,
//       remainingAmount,
//       rentalHistory: [initialHistory]
//     });

//     console.log('✅ Customer created:', customer._id);

//     // ✅ RENT the items - Deduct from available
//     console.log('🔄 Renting items...');
//     await rentItems(items);

//     console.log('✅ Customer created and items rented successfully');

//     res.status(201).json({
//       success: true,
//       message: 'Customer created successfully and items rented',
//       data: customer
//     });
//   } catch (error) {
//     console.error('❌ Create customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating customer',
//       error: error.message
//     });
//   }
// };

//Version 2
// export const createCustomer = async (req, res) => {
//   try {
//     const customerData = req.body;
//     const items = customerData.items || [];
//     const itemsCheckoutData = customerData.itemsCheckoutData || {};

//     console.log('🔵 CREATE CUSTOMER - Starting');
//     console.log('📦 Items to rent:', items);
//     console.log('⏰ Per-item checkout data:', itemsCheckoutData);

//     if (!items || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'At least one item is required'
//       });
//     }

//     // ✅ Check availability
//     const availabilityCheck = await checkItemsAvailability(items);
//     if (!availabilityCheck.allAvailable) {
//       return res.status(400).json({
//         success: false,
//         message: 'Some items are not available',
//         unavailableItems: availabilityCheck.unavailable
//       });
//     }

//     // ✅ Calculate totals
//     const itemsCost = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//     const transportCost = parseFloat(customerData.transportCost) || 0;
//     const maintenanceCharges = parseFloat(customerData.maintenanceCharges) || 0;
    
//     // ✅ Calculate total extra charges from itemsCheckoutData
//     let totalExtraCharges = 0;
//     if (itemsCheckoutData && Object.keys(itemsCheckoutData).length > 0) {
//       Object.values(itemsCheckoutData).forEach(item => {
//         totalExtraCharges += parseFloat(item.extraCharges) || 0;
//       });
//     }

//     const totalAmount = itemsCost + transportCost + maintenanceCharges + totalExtraCharges;
//     const givenAmount = parseFloat(customerData.givenAmount) || 0;
//     const remainingAmount = totalAmount - givenAmount;

//     console.log('✅ Calculations:');
//     console.log('   Items: ₹' + itemsCost);
//     console.log('   Extra Charges: ₹' + totalExtraCharges);
//     console.log('   Total: ₹' + totalAmount);

//     const initialHistory = {
//       action: 'created',
//       itemsUsed: items,
//       totalQuantityUsed: items.reduce((sum, item) => sum + item.quantity, 0),
//       totalValueUsed: itemsCost,
//       status: 'Active',
//       itemsCheckoutData: itemsCheckoutData,
//       totalExtraCharges: totalExtraCharges,
//       notes: 'Customer created with per-item checkout'
//     };

//     const newCustomer = new Customer({
//       userId: req.userId,
//       name: customerData.name,
//       phone: customerData.phone,
//       address: customerData.address || '',
//       checkInDate: new Date(customerData.checkInDate),
//       checkInTime: customerData.checkInTime || '10:00',
//       hourlyRate: parseFloat(customerData.hourlyRate) || 0,
//       items: items,
//       totalAmount: totalAmount,
//       depositAmount: parseFloat(customerData.depositAmount) || 0,
//       givenAmount: givenAmount,
//       remainingAmount: remainingAmount,
//       transportRequired: customerData.transportRequired || false,
//       transportCost: transportCost,
//       transportLocation: customerData.transportLocation || '',
//       maintenanceCharges: maintenanceCharges,
//       status: customerData.status || 'Active',
//       fitterName: customerData.fitterName || '',
//       notes: customerData.notes || '',
//       itemsCheckoutData: itemsCheckoutData,
//       rentalHistory: [initialHistory]
//     });

//     const customer = await newCustomer.save();

//     console.log('✅ Customer created:', customer._id);
//     console.log('🔄 Renting items...');
//     await rentItems(items);

//     res.status(201).json({
//       success: true,
//       message: 'Customer created successfully',
//       data: customer
//     });
//   } catch (error) {
//     console.error('❌ Create customer error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating customer',
//       error: error.message
//     });
//   }
// };

export const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    const items = customerData.items || [];
    const itemsCheckoutData = customerData.itemsCheckoutData || {};

    logger.info('🔵 CREATE CUSTOMER - Starting');
    logger.info('📦 Items:', items);
    logger.info('⏰ Checkout Data:', itemsCheckoutData);

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Check availability
    const availabilityCheck = await checkItemsAvailability(items);
    if (!availabilityCheck.allAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Some items are not available',
        unavailableItems: availabilityCheck.unavailable
      });
    }

    // Calculate totals
    const itemsCost = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const transportCost = parseFloat(customerData.transportCost) || 0;
    const maintenanceCharges = parseFloat(customerData.maintenanceCharges) || 0;
    
    let totalExtraCharges = 0;
    if (itemsCheckoutData && Object.keys(itemsCheckoutData).length > 0) {
      Object.values(itemsCheckoutData).forEach(item => {
        totalExtraCharges += parseFloat(item.extraCharges) || 0;
      });
    }

    const totalAmount = itemsCost + transportCost + maintenanceCharges + totalExtraCharges;
    const givenAmount = parseFloat(customerData.givenAmount) || 0;
    const remainingAmount = totalAmount - givenAmount;

    logger.info('💰 Calculation:');
    logger.info('   Items Cost: ₹' + itemsCost);
    logger.info('   Extra Charges: ₹' + totalExtraCharges);
    logger.info('   Total: ₹' + totalAmount);

    const initialHistory = {
      action: 'created',
      itemsUsed: items,
      totalQuantityUsed: items.reduce((sum, item) => sum + item.quantity, 0),
      totalValueUsed: itemsCost,
      status: 'Active',
      itemsExtraCharges: itemsCheckoutData,
      totalExtraCharges: totalExtraCharges,
      notes: 'Customer created'
    };

    // Create customer
    const newCustomer = new Customer({
      userId: req.userId,
      name: customerData.name,
      receiverName: customerData.receiverName || '',
      phone: customerData.phone,
      address: customerData.address || '',
      checkInDate: new Date(customerData.checkInDate),
      checkInTime: customerData.checkInTime || '10:00',
      items: items,
      totalAmount: totalAmount,
      depositAmount: parseFloat(customerData.depositAmount) || 0,
      givenAmount: givenAmount,
      remainingAmount: remainingAmount,
      transportRequired: customerData.transportRequired || false,
      transportCost: transportCost,
      transportLocation: customerData.transportLocation || '',
      maintenanceCharges: maintenanceCharges,
      status: customerData.status || 'Active',
      fitterName: customerData.fitterName || '',
      notes: customerData.notes || '',
      itemsCheckoutData: itemsCheckoutData,
      rentalHistory: [initialHistory]
    });

    // ✅ GENERATE AND STORE BILL DATA
    logger.info('📄 Generating bill data...');
    newCustomer.generateBillData();

    const customer = await newCustomer.save();

    logger.info('✅ Customer created:', customer._id);
    logger.info('✅ Bill data saved');

    // Rent items
    logger.info('🔄 Renting items...');
    await rentItems(items);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    logger.error('❌ Create customer error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// =====================================================
// GET ALL CUSTOMERS
// =====================================================
//Version 2
// export const getCustomers = async (req, res) => {
//   try {
//     const { 
//       status, 
//       search, 
//       startDate, 
//       endDate,
//       fitterName,
//       page = 1,
//       limit = 50
//     } = req.query;
    
//     const query = { userId: req.userId };
    
//     if (status && status !== 'all') {
//       query.status = status;
//     }
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { fitterName: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (startDate || endDate) {
//       query.registrationDate = {};
//       if (startDate) {
//         query.registrationDate.$gte = new Date(startDate);
//       }
//       if (endDate) {
//         query.registrationDate.$lte = new Date(endDate);
//       }
//     }
    
//     if (fitterName) {
//       query.fitterName = fitterName;
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [customers, total] = await Promise.all([
//       Customer.find(query)
//         .sort({ registrationDate: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .lean(),
//       Customer.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: {
//         customers,
//         pagination: {
//           total,
//           page: Number(page),
//           limit: Number(limit),
//           totalPages: Math.ceil(total / Number(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('❌ Get customers error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching customers',
//       error: error.message
//     });
//   }
// };

export const getCustomers = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      page = 1,
      limit = 50
    } = req.query;
    
    const query = { userId: req.userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { fitterName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Customer.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    logger.error('❌ Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// =====================================================
// GET CUSTOMER BY ID
// =====================================================
// export const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log('🔵 GET CUSTOMER BY ID:', id);

//     const customer = await Customer.findById(id).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     // ✅ Format dates properly
//     if (customer.checkInDate) {
//       customer.checkInDate = new Date(customer.checkInDate)
//         .toISOString()
//         .split('T')[0];
//     }
//     if (customer.checkOutDate) {
//       customer.checkOutDate = new Date(customer.checkOutDate)
//         .toISOString()
//         .split('T')[0];
//     }

//     console.log('✅ Customer found:', customer.name);

//     res.json({
//       success: true,
//       data: customer
//     });
//   } catch (error) {
//     console.error('❌ Get customer by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching customer',
//       error: error.message
//     });
//   }
// };

//Version 2
// export const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     logger.debug('🔵 GET CUSTOMER BY ID:', id);

//     const customer = await Customer.findById(id).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     // ✅ Format dates properly
//     if (customer.checkInDate) {
//       customer.checkInDate = new Date(customer.checkInDate)
//         .toISOString()
//         .split('T')[0];
//     }

//     // ✅ Convert itemsExtraCharges Map to object if needed
//     if (customer.itemsExtraCharges && customer.itemsExtraCharges instanceof Map) {
//       const chargesObj = {};
//       for (const [key, value] of customer.itemsExtraCharges) {
//         chargesObj[key] = value;
//       }
//       customer.itemsExtraCharges = chargesObj;
//     }

//     logger.info('✅ Customer found:', customer.name);
//     logger.info('Items extra charges:', customer.itemsExtraCharges);

//     res.json({
//       success: true,
//       data: customer
//     });
//   } catch (error) {
//     logger.error('❌ Get customer by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching customer',
//       error: error.message
//     });
//   }
// };


// =====================================================
// UPDATE CUSTOMER - HANDLE ITEM RETURN
// =====================================================
// export const updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     console.log('🔵 UPDATE CUSTOMER - Starting');
//     console.log('Customer ID:', id);
//     console.log('Update Data:', updateData);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const oldStatus = customer.status;
//     const newStatus = updateData.status;

//     console.log(`📊 Status Change: ${oldStatus} → ${newStatus}`);

//     // ✅ HANDLE STATUS CHANGES - Return items
//     if (newStatus === 'Completed' && oldStatus !== 'Completed') {
//       console.log('🏁 COMPLETING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Completed');
//       }

//       // ✅ Add to rental history
//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'completed',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Completed',
//         rentalDays: updateData.rentalDays || customer.rentalDays || 0,
//         extraHours: updateData.extraHours || customer.extraHours || 0,
//         extraCharges: updateData.extraCharges || customer.extraCharges || 0,
//         notes: 'Customer status changed to Completed'
//       });
//     } 
//     else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
//       console.log('❌ CANCELLING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Cancelled');
//       }

//       // ✅ Add to rental history
//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'cancelled',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Cancelled',
//         notes: 'Customer status changed to Cancelled'
//       });
//     }

//     // ✅ Calculate remaining amount
//     if (updateData.totalAmount !== undefined || updateData.givenAmount !== undefined) {
//       updateData.remainingAmount = 
//         (updateData.totalAmount ?? customer.totalAmount) - 
//         (updateData.givenAmount ?? customer.givenAmount);
//     }

//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     console.log('✅ Customer updated successfully');
//     console.log('Updated Status:', updatedCustomer.status);

//     res.json({
//       success: true,
//       message: 'Customer updated successfully',
//       data: updatedCustomer
//     });
//   } catch (error) {
//     console.error('❌ Update customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating customer',
//       error: error.message
//     });
//   }
// };

//Version 2
// export const updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     console.log('🔵 UPDATE CUSTOMER - Starting');
//     console.log('Customer ID:', id);
//     console.log('Update Data fields:', Object.keys(updateData));

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const oldStatus = customer.status;
//     const newStatus = updateData.status;

//     console.log(`📊 Status Change: ${oldStatus} → ${newStatus}`);

//     // ✅ Calculate total extra charges from itemsExtraCharges
//     let totalExtraCharges = 0;
//     if (updateData.itemsExtraCharges) {
//       if (typeof updateData.itemsExtraCharges === 'object') {
//         totalExtraCharges = Object.values(updateData.itemsExtraCharges)
//           .reduce((sum, charge) => sum + (parseFloat(charge) || 0), 0);
//       }
      
//       console.log('💰 Per-item extra charges:', updateData.itemsExtraCharges);
//       console.log('💰 Total extra charges:', totalExtraCharges);

//       // ✅ Update extraCharges field to match total
//       updateData.extraCharges = totalExtraCharges;
//     }

//     // ✅ Recalculate total amount if itemsExtraCharges changed
//     if (updateData.itemsExtraCharges) {
//       const itemsCost = (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
//       const transportCost = updateData.transportCost !== undefined ? parseFloat(updateData.transportCost) : (customer.transportCost || 0);
//       const maintenanceCharges = updateData.maintenanceCharges !== undefined ? parseFloat(updateData.maintenanceCharges) : (customer.maintenanceCharges || 0);
      
//       updateData.totalAmount = itemsCost + transportCost + maintenanceCharges + totalExtraCharges;
//       console.log('✅ Total amount recalculated:', updateData.totalAmount);
//     }

//     // ✅ Calculate remaining amount
//     if (updateData.totalAmount !== undefined || updateData.givenAmount !== undefined) {
//       const totalAmount = updateData.totalAmount !== undefined ? updateData.totalAmount : customer.totalAmount;
//       const givenAmount = updateData.givenAmount !== undefined ? updateData.givenAmount : customer.givenAmount;
//       updateData.remainingAmount = totalAmount - givenAmount;
//       console.log('✅ Remaining amount calculated:', updateData.remainingAmount);
//     }

//     // ✅ HANDLE STATUS CHANGES - Return items
//     if (newStatus === 'Completed' && oldStatus !== 'Completed') {
//       console.log('🏁 COMPLETING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Completed');
//       }

//       // ✅ Add to rental history
//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'completed',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Completed',
//         itemsExtraCharges: updateData.itemsExtraCharges || customer.itemsExtraCharges || {},
//         totalExtraCharges: totalExtraCharges || customer.extraCharges || 0,
//         notes: 'Customer status changed to Completed'
//       });
//     } 
//     else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
//       console.log('❌ CANCELLING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Cancelled');
//       }

//       // ✅ Add to rental history
//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'cancelled',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Cancelled',
//         itemsExtraCharges: updateData.itemsExtraCharges || customer.itemsExtraCharges || {},
//         totalExtraCharges: totalExtraCharges || customer.extraCharges || 0,
//         notes: 'Customer status changed to Cancelled'
//       });
//     }

//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     console.log('✅ Customer updated successfully');
//     console.log('Updated Total Amount:', updatedCustomer.totalAmount);
//     console.log('Updated Extra Charges:', updatedCustomer.extraCharges);

//     res.json({
//       success: true,
//       message: 'Customer updated successfully',
//       data: updatedCustomer
//     });
//   } catch (error) {
//     console.error('❌ Update customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating customer',
//       error: error.message
//     });
//   }
// };

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info('🔵 GET CUSTOMER BY ID:', id);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Format dates
    if (customer.checkInDate) {
      const checkInDate = new Date(customer.checkInDate);
      customer.checkInDate = checkInDate.toISOString().split('T')[0];
    }

    logger.info('✅ Customer found:', customer.name);
    logger.info('✅ Bill data exists:', !!customer.billData);

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    logger.error('❌ Get customer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

//Version 2
// export const updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     logger.info('🔵 UPDATE CUSTOMER - Starting');
//     logger.info('Customer ID:', id);
//     logger.info('Items Checkout Data:', updateData.itemsCheckoutData);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const oldStatus = customer.status;
//     const newStatus = updateData.status;

//     logger.info(`📊 Status Change: ${oldStatus} → ${newStatus}`);

//     // ✅ Calculate total extra charges from itemsCheckoutData
//     let totalExtraCharges = 0;
//     if (updateData.itemsCheckoutData) {
//       if (typeof updateData.itemsCheckoutData === 'object') {
//         totalExtraCharges = Object.values(updateData.itemsCheckoutData)
//           .reduce((sum, charge) => sum + (parseFloat(charge?.extraCharges) || 0), 0);
//       }

//       logger.info('💰 Per-item extra charges:', updateData.itemsCheckoutData);
//       logger.info('💰 Total extra charges:', totalExtraCharges);

//       // ✅ Update extraCharges field
//       updateData.extraCharges = totalExtraCharges;
//     }

//     // ✅ Recalculate total amount if itemsCheckoutData changed
//     if (updateData.itemsCheckoutData) {
//       const itemsCost = (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
//       const transportCost = updateData.transportCost !== undefined ? parseFloat(updateData.transportCost) : (customer.transportCost || 0);
//       const maintenanceCharges = updateData.maintenanceCharges !== undefined ? parseFloat(updateData.maintenanceCharges) : (customer.maintenanceCharges || 0);
      
//       updateData.totalAmount = itemsCost + transportCost + maintenanceCharges + totalExtraCharges;
//       logger.info('✅ Total amount recalculated:', updateData.totalAmount);
//     }

//     // ✅ Calculate remaining amount
//     if (updateData.totalAmount !== undefined || updateData.givenAmount !== undefined) {
//       const totalAmount = updateData.totalAmount !== undefined ? updateData.totalAmount : customer.totalAmount;
//       const givenAmount = updateData.givenAmount !== undefined ? updateData.givenAmount : customer.givenAmount;
//       updateData.remainingAmount = totalAmount - givenAmount;
//       logger.info('✅ Remaining amount calculated:', updateData.remainingAmount);
//     }

//     // ✅ HANDLE STATUS CHANGES
//     if (newStatus === 'Completed' && oldStatus !== 'Completed') {
//       logger.info('🏁 COMPLETING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Completed');
//       }

//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'completed',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Completed',
//         itemsExtraCharges: updateData.itemsCheckoutData || customer.itemsCheckoutData || {},
//         totalExtraCharges: totalExtraCharges || customer.extraCharges || 0,
//         notes: 'Customer status changed to Completed'
//       });
//     } 
//     else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
//       logger.info('❌ CANCELLING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Cancelled');
//       }

//       if (!updateData.rentalHistory) {
//         updateData.rentalHistory = customer.rentalHistory || [];
//       }
//       updateData.rentalHistory.push({
//         date: new Date(),
//         action: 'cancelled',
//         itemsUsed: customer.items || [],
//         totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//         totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//         status: 'Cancelled',
//         itemsExtraCharges: updateData.itemsCheckoutData || customer.itemsCheckoutData || {},
//         totalExtraCharges: totalExtraCharges || customer.extraCharges || 0,
//         notes: 'Customer status changed to Cancelled'
//       });
//     }

//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     logger.info('✅ Customer updated successfully');
//     logger.info('Updated Total Amount:', updatedCustomer.totalAmount);
//     logger.info('Updated Extra Charges:', updatedCustomer.extraCharges);

//     res.json({
//       success: true,
//       message: 'Customer updated successfully',
//       data: updatedCustomer
//     });
//   } catch (error) {
//     logger.error('❌ Update customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating customer',
//       error: error.message
//     });
//   }
// };

//Version 3
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info('🔵 UPDATE CUSTOMER - Starting');
    logger.info('Customer ID:', id);
    logger.info('Update checkout data:', updateData.itemsCheckoutData);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const oldStatus = customer.status;
    const newStatus = updateData.status;

    logger.info(`📊 Status Change: ${oldStatus} → ${newStatus}`);

    // Calculate total extra charges
    let totalExtraCharges = 0;
    if (updateData.itemsCheckoutData) {
      if (typeof updateData.itemsCheckoutData === 'object') {
        totalExtraCharges = Object.values(updateData.itemsCheckoutData)
          .reduce((sum, charge) => sum + (parseFloat(charge?.extraCharges) || 0), 0);
      }

      logger.info('💰 Total extra charges:', totalExtraCharges);
      updateData.extraCharges = totalExtraCharges;
    }

    // Recalculate total amount
    if (updateData.itemsCheckoutData || updateData.transportCost !== undefined || updateData.maintenanceCharges !== undefined) {
      const itemsCost = (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const transportCost = updateData.transportCost !== undefined ? parseFloat(updateData.transportCost) : (customer.transportCost || 0);
      const maintenanceCharges = updateData.maintenanceCharges !== undefined ? parseFloat(updateData.maintenanceCharges) : (customer.maintenanceCharges || 0);
      
      updateData.totalAmount = itemsCost + transportCost + maintenanceCharges + totalExtraCharges;
      logger.info('✅ Total amount recalculated:', updateData.totalAmount);
    }

    // Calculate remaining amount
    if (updateData.totalAmount !== undefined || updateData.givenAmount !== undefined) {
      const totalAmount = updateData.totalAmount !== undefined ? updateData.totalAmount : customer.totalAmount;
      const givenAmount = updateData.givenAmount !== undefined ? updateData.givenAmount : customer.givenAmount;
      updateData.remainingAmount = totalAmount - givenAmount;
    }

    // Handle status changes
    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
      logger.info('🏁 Completing booking...');
      
      if (customer.items && customer.items.length > 0) {
        await returnItemsWithHistory(customer.items, 'Completed');
      }

      if (!updateData.rentalHistory) {
        updateData.rentalHistory = customer.rentalHistory || [];
      }
      updateData.rentalHistory.push({
        date: new Date(),
        action: 'completed',
        itemsUsed: customer.items || [],
        totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
        totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
        status: 'Completed',
        notes: 'Customer completed'
      });
    } 
    else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      logger.info('❌ Cancelling booking...');
      
      if (customer.items && customer.items.length > 0) {
        await returnItemsWithHistory(customer.items, 'Cancelled');
      }

      if (!updateData.rentalHistory) {
        updateData.rentalHistory = customer.rentalHistory || [];
      }
      updateData.rentalHistory.push({
        date: new Date(),
        action: 'cancelled',
        itemsUsed: customer.items || [],
        totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
        totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
        status: 'Cancelled',
        notes: 'Customer cancelled'
      });
    }

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // ✅ REGENERATE BILL DATA
    logger.info('📄 Regenerating bill data...');
    updatedCustomer.generateBillData();
    await updatedCustomer.save();

    logger.info('✅ Customer updated');
    logger.info('✅ Bill data regenerated');

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    logger.error('❌ Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer',
      error: error.message
    });
  }
};

// =====================================================
// DELETE CUSTOMER - RETURN ITEMS
// =====================================================
// export const deleteCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     logger.info('🗑️ DELETE CUSTOMER - Starting');
//     logger.info('Customer ID:', id);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     logger.info('Deleting customer:', customer.name);
//     logger.info('Current Status:', customer.status);

//     // ✅ Return items if customer hasn't completed
//     if (customer.status !== 'Completed' && customer.items && customer.items.length > 0) {
//       logger.info('🔄 Returning rented items to inventory');
//       await returnItemsWithHistory(customer.items, 'Deleted');
//     }

//     await Customer.findByIdAndDelete(id);

//     logger.info('✅ Customer deleted successfully');

//     res.json({
//       success: true,
//       message: 'Customer deleted successfully'
//     });
//   } catch (error) {
//     logger.error('❌ Delete customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting customer',
//       error: error.message
//     });
//   }
// };

// Version 2
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info('🗑️ DELETE CUSTOMER:', id);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    logger.info('Deleting customer:', customer.name);

    if (customer.status !== 'Completed' && customer.items && customer.items.length > 0) {
      logger.info('🔄 Returning items...');
      await returnItemsWithHistory(customer.items, 'Deleted');
    }

    await Customer.findByIdAndDelete(id);

    logger.info('✅ Customer deleted');

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    logger.error('❌ Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

// =====================================================
// CHECKOUT CUSTOMER - MARK AS COMPLETED
// =====================================================

// Version 2
// export const checkoutCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { checkOutDate, checkOutTime, itemsExtraCharges } = req.body;

//     logger.info('🔵 CHECKOUT CUSTOMER - Starting');
//     logger.info('Customer ID:', id);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     logger.info('Checking out customer:', customer.name);

//     // ✅ Parse check-in date-time
//     const [inHours, inMinutes] = customer.checkInTime.split(':');
//     const checkInDateTime = new Date(customer.checkInDate);
//     checkInDateTime.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

//     // ✅ Parse check-out date-time
//     const [outHours, outMinutes] = checkOutTime.split(':');
//     const checkOutDateTime = new Date(checkOutDate);
//     checkOutDateTime.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

//     logger.info('Check-in:', checkInDateTime.toISOString());
//     logger.info('Check-out:', checkOutDateTime.toISOString());

//     // ✅ FREE RETURN WINDOW: Same day + next day until 10:00 AM
//     const freeReturnDeadline = new Date(checkInDateTime);
//     freeReturnDeadline.setDate(freeReturnDeadline.getDate() + 1); // Next day
//     freeReturnDeadline.setHours(10, 0, 0, 0); // 10:00 AM

//     const isFreeReturn = checkOutDateTime <= freeReturnDeadline;

//     logger.info('📅 Free Return Deadline:', freeReturnDeadline.toISOString());
//     logger.info('📅 Actual Return:', checkOutDateTime.toISOString());
//     logger.info('✅ Is Free Return?', isFreeReturn);

//     let totalExtraCharges = 0;
//     let itemExtraChargesMap = {};

//     if (!isFreeReturn) {
//       // ✅ LATE RETURN: Calculate charges for each item
//       logger.info('⏰ LATE RETURN - Calculating charges...');

//       // Calculate hours after free return deadline
//       const lateHours = Math.ceil((checkOutDateTime - freeReturnDeadline) / (1000 * 60 * 60));
//       logger.info('Late hours:', lateHours);

//       // Admin can provide per-item extra charges
//       if (itemsExtraCharges && typeof itemsExtraCharges === 'object') {
//         itemExtraChargesMap = itemsExtraCharges;
//         totalExtraCharges = Object.values(itemsExtraCharges)
//           .reduce((sum, charge) => sum + (parseFloat(charge) || 0), 0);
//       }
//     } else {
//       logger.info('✅ FREE RETURN - No extra charges');
//     }

//     logger.info('Total Extra Charges:', totalExtraCharges);

//     // ✅ Update customer with checkout info
//     customer.checkOutDate = new Date(checkOutDate);
//     customer.checkOutTime = checkOutTime;
//     customer.extraCharges = totalExtraCharges; // ✅ Accept zero also
//     customer.status = 'Completed';

//     // Update itemsCheckoutData with extra charges
//     if (Object.keys(itemExtraChargesMap).length > 0) {
//       Object.entries(itemExtraChargesMap).forEach(([itemId, charge]) => {
//         if (customer.itemsCheckoutData && customer.itemsCheckoutData[itemId]) {
//           customer.itemsCheckoutData[itemId].extraCharges = parseFloat(charge) || 0;
//         }
//       });
//     }

//     // ✅ Recalculate totals
//     const previousTotal = customer.totalAmount;
//     customer.totalAmount = previousTotal + totalExtraCharges;
//     customer.remainingAmount = customer.totalAmount - customer.givenAmount;

//     // ✅ Add to rental history
//     if (!customer.rentalHistory) {
//       customer.rentalHistory = [];
//     }
//     customer.rentalHistory.push({
//       date: new Date(),
//       action: 'completed',
//       itemsUsed: customer.items || [],
//       totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
//       totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//       status: 'Completed',
//       notes: isFreeReturn ? 'Free return (within 24hrs until 10:00 AM)' : 'Late return - extra charges applied'
//     });

//     await customer.save();

//     // ✅ RETURN ITEMS to available
//     logger.info('🔄 Returning items to inventory...');
//     if (customer.items && customer.items.length > 0) {
//       await returnItemsWithHistory(customer.items, 'Completed');
//     }

//     logger.info('✅ Customer checked out');

//     res.json({
//       success: true,
//       message: 'Customer checked out successfully',
//       data: {
//         customer,
//         checkoutInfo: {
//           checkInDateTime: checkInDateTime.toISOString(),
//           checkOutDateTime: checkOutDateTime.toISOString(),
//           freeReturnDeadline: freeReturnDeadline.toISOString(),
//           isFreeReturn: isFreeReturn,
//           totalExtraCharges: Math.round(totalExtraCharges),
//           itemExtraCharges: itemExtraChargesMap,
//           previousTotal: Math.round(previousTotal),
//           newTotal: Math.round(customer.totalAmount),
//           remainingAmount: Math.round(customer.remainingAmount)
//         }
//       }
//     });
//   } catch (error) {
//     logger.error('❌ Checkout customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error checking out customer',
//       error: error.message
//     });
//   }
// };

export const checkoutCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      checkOutDate, 
      checkOutTime, 
      itemsExtraCharges,
      itemsExtraHours = {}  // ✅ NEW: Per-item extra hours
    } = req.body;

    logger.info('🔵 CHECKOUT CUSTOMER - Starting');
    logger.info('Customer ID:', id);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    logger.info('Checking out customer:', customer.name);

    // ✅ Parse check-in date-time
    const [inHours, inMinutes] = customer.checkInTime.split(':');
    const checkInDateTime = new Date(customer.checkInDate);
    checkInDateTime.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

    // ✅ Parse check-out date-time
    const [outHours, outMinutes] = checkOutTime.split(':');
    const checkOutDateTime = new Date(checkOutDate);
    checkOutDateTime.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

    logger.info('Check-in:', checkInDateTime.toISOString());
    logger.info('Check-out:', checkOutDateTime.toISOString());

    // ✅ FREE RETURN WINDOW: Same day + next day until 10:00 AM (24 hours from check-in time)
    const freeReturnDeadline = new Date(checkInDateTime);
    freeReturnDeadline.setDate(freeReturnDeadline.getDate() + 1); // Next day
    // Keep same time as check-in (e.g., 10:00 AM)

    const isFreeReturn = checkOutDateTime <= freeReturnDeadline;

    logger.info('📅 Free Return Deadline:', freeReturnDeadline.toISOString());
    logger.info('📅 Actual Return:', checkOutDateTime.toISOString());
    logger.info('✅ Is Free Return?', isFreeReturn);

    let totalExtraCharges = 0;
    let itemExtraChargesMap = {};
    let itemExtraHoursMap = {};

    // ✅ Process per-item extra charges and extra hours
    if (itemsExtraCharges && typeof itemsExtraCharges === 'object') {
      itemExtraChargesMap = itemsExtraCharges;
      totalExtraCharges = Object.values(itemsExtraCharges)
        .reduce((sum, charge) => sum + (parseFloat(charge) || 0), 0);
      
      logger.info('Per-item extra charges:', itemExtraChargesMap);
    }

    // ✅ Store per-item extra hours
    if (itemsExtraHours && typeof itemsExtraHours === 'object') {
      itemExtraHoursMap = itemsExtraHours;
      logger.info('Per-item extra hours:', itemExtraHoursMap);
    }

    if (isFreeReturn) {
      logger.info('✅ FREE RETURN - Setting extra charges to 0');
      totalExtraCharges = 0;
      itemExtraChargesMap = {};
    }

    logger.info('Total Extra Charges:', totalExtraCharges);

    // ✅ Update customer
    customer.checkOutDate = new Date(checkOutDate);
    customer.checkOutTime = checkOutTime;
    customer.extraCharges = totalExtraCharges; // ✅ Can be 0
    customer.status = 'Completed';

    // Update itemsCheckoutData with extra charges and extra hours
    if (Object.keys(itemExtraChargesMap).length > 0) {
      Object.entries(itemExtraChargesMap).forEach(([itemId, charge]) => {
        if (customer.itemsCheckoutData && customer.itemsCheckoutData[itemId]) {
          customer.itemsCheckoutData[itemId].extraCharges = parseFloat(charge) || 0;
        }
      });
    }

    // ✅ Store extra hours for reference
    if (Object.keys(itemExtraHoursMap).length > 0) {
      Object.entries(itemExtraHoursMap).forEach(([itemId, hours]) => {
        if (customer.itemsCheckoutData && customer.itemsCheckoutData[itemId]) {
          customer.itemsCheckoutData[itemId].manualExtraHours = parseFloat(hours) || 0;
        }
      });
    }

    // ✅ Recalculate totals
    const previousTotal = customer.totalAmount;
    customer.totalAmount = previousTotal + totalExtraCharges;
    customer.remainingAmount = customer.totalAmount - customer.givenAmount;

    // ✅ Add to rental history
    if (!customer.rentalHistory) {
      customer.rentalHistory = [];
    }
    customer.rentalHistory.push({
      date: new Date(),
      action: 'completed',
      itemsUsed: customer.items || [],
      totalQuantityUsed: (customer.items || []).reduce((sum, item) => sum + item.quantity, 0),
      totalValueUsed: (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: 'Completed',
      itemsExtraCharges: itemExtraChargesMap,
      itemsExtraHours: itemExtraHoursMap,
      totalExtraCharges: totalExtraCharges,
      notes: isFreeReturn 
        ? '✅ Free return (within 24hrs from check-in time)' 
        : '⏰ Late return - extra charges applied'
    });

    await customer.save();

    // ✅ RETURN ITEMS
    logger.info('🔄 Returning items to inventory...');
    if (customer.items && customer.items.length > 0) {
      await returnItemsWithHistory(customer.items, 'Completed');
    }

    logger.info('✅ Customer checked out successfully');

    res.json({
      success: true,
      message: 'Customer checked out successfully',
      data: {
        customer,
        checkoutInfo: {
          checkInDateTime: checkInDateTime.toISOString(),
          checkOutDateTime: checkOutDateTime.toISOString(),
          freeReturnDeadline: freeReturnDeadline.toISOString(),
          isFreeReturn: isFreeReturn,
          totalExtraCharges: Math.round(totalExtraCharges),
          itemExtraCharges: itemExtraChargesMap,
          itemExtraHours: itemExtraHoursMap,
          previousTotal: Math.round(previousTotal),
          newTotal: Math.round(customer.totalAmount),
          remainingAmount: Math.round(customer.remainingAmount)
        }
      }
    });
  } catch (error) {
    logger.error('❌ Checkout customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out customer',
      error: error.message
    });
  }
};

// =====================================================
// CALCULATE RENTAL DURATION
// =====================================================

// Version 2
// export const calculateRentalDuration = async (req, res) => {
//   try {
//     const { checkInDate, checkInTime, checkOutDate, checkOutTime, hourlyRate, quantity } = req.body;

//     logger.info('🔵 CALCULATE RENTAL DURATION');

//     if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
//       return res.status(400).json({
//         success: false,
//         message: 'All date and time fields are required'
//       });
//     }

//     const dailyRate = parseFloat(hourlyRate) || 0;
//     const qty = parseInt(quantity) || 1;

//     const [inHours, inMinutes] = checkInTime.split(':');
//     const checkIn = new Date(checkInDate);
//     checkIn.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

//     const [outHours, outMinutes] = checkOutTime.split(':');
//     const checkOut = new Date(checkOutDate);
//     checkOut.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

//     const totalHours = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60));
    
//     if (totalHours < 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Check-out time cannot be before check-in time'
//       });
//     }

//     const fullDays = Math.floor(totalHours / 24);
//     const extraHours = totalHours % 24;

//     let extraCharges = 0;
//     if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
//       extraCharges = extraHours * hourlyRate;
//     }

//     logger.info(`✅ Duration: ${fullDays} days, ${extraHours} hours`);
//     logger.info('Extra Charges:', extraCharges);

//     res.json({
//       success: true,
//       data: {
//         totalHours,
//         fullDays,
//         extraHours,
//         hourlyRate: hourlyRate || 0,
//         extraCharges: parseFloat(extraCharges.toFixed(2)),
//         message: `${fullDays} day(s) and ${extraHours} hour(s)`
//       }
//     });
//   } catch (error) {
//     logger.error('❌ Calculate duration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error calculating rental duration',
//       error: error.message
//     });
//   }
// };

// =====================================================
// CALCULATE RENTAL DURATION - FIXED
// =====================================================
// Formula: totalDays × quantity × dailyRate = extraCharges
// If dailyRate is 0, extraCharges is 0

export const calculateRentalDuration = async (req, res) => {
  try {
    const { checkInDate, checkInTime, checkOutDate, checkOutTime, hourlyRate, quantity } = req.body;

    if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "All date and time fields are required"
      });
    }

    const dailyRate = parseFloat(hourlyRate) || 0;
    const qty = parseInt(quantity) || 1;

    // Parse check-in date and time
    const [inHours, inMinutes] = checkInTime.split(":");
    const checkIn = new Date(checkInDate);
    checkIn.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

    // Parse check-out date and time
    const [outHours, outMinutes] = checkOutTime.split(":");
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

    logger.info('📊 RENTAL DURATION CALCULATION:');
    logger.info(`   Check-in: ${checkIn.toISOString()}`);
    logger.info(`   Check-out: ${checkOut.toISOString()}`);

    if (checkOut < checkIn) {
      return res.status(400).json({
        success: false,
        message: "Check-out time cannot be before check-in time"
      });
    }

    // ✅ FREE RETURN WINDOW: Next day at 10:00 AM
    const freeReturnDeadline = new Date(checkIn);
    freeReturnDeadline.setDate(freeReturnDeadline.getDate() + 1); // Next day
    freeReturnDeadline.setHours(10, 0, 0, 0); // 10:00 AM

    logger.info(`   Free Return Deadline: ${freeReturnDeadline.toISOString()}`);

    let totalDays = 0;

    if (checkOut <= freeReturnDeadline) {
      // ✅ Within free return window
      logger.info('   ✅ FREE RETURN - No extra charges');
      totalDays = 0;
    } else {
      // ✅ After free return window - Calculate charged days
      // Days are calculated from the deadline onwards
      const diffMs = checkOut - freeReturnDeadline;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // If any fraction of an hour past deadline, count as 1 full day
      totalDays = Math.ceil(diffHours / 24);
      
      logger.info(`   ⏰ LATE RETURN`);
      logger.info(`   Hours past deadline: ${diffHours.toFixed(2)}`);
      logger.info(`   Charged Days: ${totalDays}`);
    }

    // ✅ Calculate extra charges
    // Formula: Daily Rate × Quantity × Charged Days
    let extraCharges = 0;
    if (totalDays > 0 && dailyRate > 0) {
      extraCharges = dailyRate * qty * totalDays;
    }

    logger.info(`   Daily Rate: ₹${dailyRate}/day`);
    logger.info(`   Quantity: ${qty}`);
    logger.info(`   ✅ Calculation: ${dailyRate} × ${qty} × ${totalDays} = ₹${extraCharges}`);

    return res.json({
      success: true,
      data: {
        checkInDate: checkIn.toISOString().split('T')[0],
        checkInTime: checkInTime,
        checkOutDate: checkOut.toISOString().split('T')[0],
        checkOutTime: checkOutTime,
        freeReturnDeadline: freeReturnDeadline.toISOString(),
        isWithinFreeWindow: checkOut <= freeReturnDeadline,
        totalDays: totalDays,
        dailyRate: dailyRate,
        quantity: qty,
        extraCharges: Math.round(extraCharges),
        message: totalDays === 0 
          ? `✅ Free return (within 24hrs until 10:00 AM)`
          : `${totalDays} day(s) × ₹${dailyRate}/day × Qty(${qty}) = ₹${Math.round(extraCharges)}`
      }
    });

  } catch (error) {
    logger.error("❌ Calculate duration error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating rental duration",
      error: error.message
    });
  }
};


// =====================================================
// DASHBOARD STATS
// =====================================================
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      todaysBookings,
      incomeData,
      pendingData
    ] = await Promise.all([
      Customer.countDocuments({ userId }),
      Customer.countDocuments({ userId, status: 'Active' }),
      Customer.countDocuments({ userId, status: 'Completed' }),
      Customer.countDocuments({ userId, status: 'Cancelled' }),
      Customer.countDocuments({
        userId,
        registrationDate: { $gte: today }
      }),
      Customer.aggregate([
        { $match: { userId: userId, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$givenAmount' } } }
      ]),
      Customer.aggregate([
        { $match: { userId: userId, status: { $in: ['Active'] } } },
        { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        todaysBookings,
        totalIncome: incomeData[0]?.total || 0,
        pendingPayments: pendingData[0]?.total || 0
      }
    });
  } catch (error) {
    logger.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// =====================================================
// ENHANCED DASHBOARD STATS
// =====================================================
export const getEnhancedDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      todaysBookings,
      totalIncome,
      pendingPayments,
      recentCustomers,
    ] = await Promise.all([
      Customer.countDocuments({ userId }),
      Customer.countDocuments({ userId, status: 'Active' }),
      Customer.countDocuments({ userId, status: 'Completed' }),
      Customer.countDocuments({ userId, status: 'Cancelled' }),
      Customer.countDocuments({
        userId,
        registrationDate: { $gte: today }
      }),
      Customer.aggregate([
        { $match: { userId, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$givenAmount' } } }
      ]),
      Customer.aggregate([
        { $match: { userId, status: 'Active' } },
        { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
      ]),
      Customer.find({ userId })
        .sort({ registrationDate: -1 })
        .limit(10)
        .select('name phone registrationDate totalAmount givenAmount remainingAmount status fitterName')
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        todaysBookings,
        totalIncome: totalIncome[0]?.total || 0,
        pendingPayments: pendingPayments[0]?.total || 0,
        recentCustomers,
      }
    });
  } catch (error) {
    logger.error('❌ Enhanced stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// =====================================================
// ANALYTICS
// =====================================================
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    const statusDistribution = await Customer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const currentDate = new Date();
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const [lastMonthStats, thisMonthStats] = await Promise.all([
      Customer.aggregate([
        {
          $match: {
            userId,
            registrationDate: {
              $gte: lastMonthStart,
              $lt: thisMonthStart
            }
          }
        },
        {
          $group: {
            _id: null,
            bookings: { $sum: 1 },
            revenue: { $sum: '$givenAmount' }
          }
        }
      ]),
      Customer.aggregate([
        {
          $match: {
            userId,
            registrationDate: { $gte: thisMonthStart }
          }
        },
        {
          $group: {
            _id: null,
            bookings: { $sum: 1 },
            revenue: { $sum: '$givenAmount' }
          }
        }
      ])
    ]);

    const prevMonth = lastMonthStats[0] || { bookings: 0, revenue: 0 };
    const currMonth = thisMonthStats[0] || { bookings: 0, revenue: 0 };

    const bookingsGrowth = prevMonth.bookings > 0
      ? ((currMonth.bookings - prevMonth.bookings) / prevMonth.bookings * 100)
      : 0;

    const revenueGrowth = prevMonth.revenue > 0
      ? ((currMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100)
      : 0;

    res.json({
      success: true,
      data: {
        statusDistribution: statusDistribution,
        growth: {
          bookings: parseFloat(bookingsGrowth.toFixed(2)),
          revenue: parseFloat(revenueGrowth.toFixed(2))
        }
      }
    });
  } catch (error) {
    logger.error('❌ Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// =====================================================
// FINANCIAL STATS
// =====================================================
export const getFinancialStats = async (req, res) => {
  try {
    const userId = req.userId;
    let { startDate, endDate } = req.query;

    const query = { userId };

    if (startDate || endDate) {
      query.registrationDate = {};

      if (startDate) {
        const start = new Date(startDate + "T00:00:00Z");
        query.registrationDate.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate + "T23:59:59Z");
        query.registrationDate.$lte = end;
      }
    }

    const customers = await Customer.find(query).lean();

    const financial = {
      totalRevenue: customers.reduce((sum, c) => sum + (c.givenAmount || 0), 0),
      pendingPayments: customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0),
      totalAmount: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
      extraChargesCollected: customers.reduce((sum, c) => sum + (c.extraCharges || 0), 0),
      completedBookings: customers.filter(c => c.status === "Completed").length,
      activeBookings: customers.filter(c => c.status === "Active").length,
      cancelledBookings: customers.filter(c => c.status === "Cancelled").length,
      collectionRate: 0
    };

    if (financial.totalAmount > 0) {
      financial.collectionRate = parseFloat(
        ((financial.totalRevenue / financial.totalAmount) * 100).toFixed(2)
      );
    }

    const dailyBreakdown = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$registrationDate"
            }
          },
          revenue: { $sum: "$givenAmount" },
          pending: { $sum: "$remainingAmount" },
          extraCharges: { $sum: "$extraCharges" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    let finalDailyBreakdown = dailyBreakdown;

    if (dailyBreakdown.length === 0 && customers.length > 0) {
      const groupedByDate = {};

      customers.forEach(customer => {
        const date = new Date(customer.registrationDate);
        const dateStr = date.toISOString().split("T")[0];

        if (!groupedByDate[dateStr]) {
          groupedByDate[dateStr] = {
            _id: dateStr,
            revenue: 0,
            pending: 0,
            extraCharges: 0,
            bookings: 0
          };
        }

        groupedByDate[dateStr].revenue += customer.givenAmount || 0;
        groupedByDate[dateStr].pending += customer.remainingAmount || 0;
        groupedByDate[dateStr].extraCharges += customer.extraCharges || 0;
        groupedByDate[dateStr].bookings += 1;
      });

      finalDailyBreakdown = Object.values(groupedByDate)
        .sort((a, b) => a._id.localeCompare(b._id));
    }

    res.json({
      success: true,
      data: {
        financial,
        dailyBreakdown: finalDailyBreakdown,
        summary: {
          totalCustomers: customers.length,
          avgTransactionValue: customers.length > 0
            ? parseFloat((financial.totalRevenue / customers.length).toFixed(0))
            : 0
        }
      }
    });

  } catch (error) {
    logger.error('❌ Financial stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial statistics',
      error: error.message
    });
  }
};

// =====================================================
// FITTER REPORT
// =====================================================
export const getFitterReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    const query = { userId };
    
    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) query.registrationDate.$gte = new Date(startDate);
      if (endDate) query.registrationDate.$lte = new Date(endDate);
    }

    const fitterReport = await Customer.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$fitterName',
          totalBookings: { $sum: 1 },
          completedBookings: { 
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          activeBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$givenAmount' },
          totalAmount: { $sum: '$totalAmount' },
          pendingAmount: { $sum: '$remainingAmount' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: { fitterReport }
    });
  } catch (error) {
    logger.error('❌ Fitter report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fitter report',
      error: error.message
    });
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// ✅ Check items availability

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

//Version 3
async function rentItems(items) {
  logger.info('🔄 RENT ITEMS');
  
  for (const item of items) {
    try {
      const itemDoc = await Item.findById(item.itemId);
      if (itemDoc) {
        itemDoc.availableQuantity -= item.quantity;
        itemDoc.rentedQuantity += item.quantity;

        if (itemDoc.availableQuantity === 0) {
          itemDoc.status = 'NotAvailable';
        } else if (itemDoc.rentedQuantity > 0) {
          itemDoc.status = 'InUse';
        }
        
        if (!itemDoc.quantityHistory) {
          itemDoc.quantityHistory = [];
        }
        itemDoc.quantityHistory.push({
          date: new Date(),
          action: 'rented',
          quantityChanged: item.quantity,
          availableQuantity: itemDoc.availableQuantity,
          rentedQuantity: itemDoc.rentedQuantity
        });
        
        await itemDoc.save();
      }
    } catch (error) {
      logger.error(`❌ Error renting item:`, error);
    }
  }

  logger.info('✅ Items rented');
}

async function returnItemsWithHistory(items, reason = 'Completed') {
  logger.info(`🔄 RETURN ITEMS (${reason}) - Adding back to available`);
  
  for (const item of items) {
    try {
      const itemDoc = await Item.findById(item.itemId || item._id);
      if (itemDoc) {
        const oldAvailable = itemDoc.availableQuantity;
        const oldRented = itemDoc.rentedQuantity;

        itemDoc.availableQuantity += item.quantity;
        itemDoc.rentedQuantity -= item.quantity;
        
        logger.info(`  📦 ${itemDoc.name}:`);
        logger.info(`     Available: ${oldAvailable} → ${itemDoc.availableQuantity}`);
        logger.info(`     Rented: ${oldRented} → ${itemDoc.rentedQuantity}`);

        if (itemDoc.availableQuantity === 0) {
          itemDoc.status = 'NotAvailable';
        } else if (itemDoc.rentedQuantity === 0) {
          itemDoc.status = 'Available';
        } else {
          itemDoc.status = 'InUse';
        }

        if (!itemDoc.quantityHistory) {
          itemDoc.quantityHistory = [];
        }
        itemDoc.quantityHistory.push({
          date: new Date(),
          action: 'returned',
          quantityChanged: item.quantity,
          availableQuantity: itemDoc.availableQuantity,
          rentedQuantity: itemDoc.rentedQuantity,
          notes: `Returned ${item.quantity} unit(s) (Customer: ${reason})`
        });
        
        await itemDoc.save();
      }
    } catch (error) {
      logger.error(`❌ Error returning item ${item.itemId || item._id}:`, error);
    }
  }

  logger.info(`✅ Items returned successfully (${reason})`);
}

// ====================================================
// HELPER FUNCTION: Log per-item extra charges breakdown
// =====================================================
function logExtraChargesBreakdown(itemsCheckoutData, hourlyRate) {
  logger.info('📊 EXTRA CHARGES BREAKDOWN:');
  let totalExtra = 0;
  
  Object.entries(itemsCheckoutData).forEach(([itemId, data]) => {
    logger.info(`  Item ${itemId}:`);
    logger.info(`    - Rental Days: ${data.rentalDays}`);
    logger.info(`    - Extra Hours: ${data.extraHours}`);
    logger.info(`    - Extra Charges: ₹${data.extraCharges}`);
    totalExtra += data.extraCharges;
  });

  logger.info(`  TOTAL EXTRA CHARGES: ₹${totalExtra}`);
}

// File: backend/controllers/customerBillController.js
// UPDATED: Display per-item extra charges on rental invoice

