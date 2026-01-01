// // =====================================================
// // FILE: backend/controllers/customerController.js (UPDATED)
// // =====================================================

// import Customer from '../models/Customer.js';
// import Item from '../models/Item.js';

// // export const createCustomer = async (req, res) => {
// //   try {
// //     const customerData = req.body;
// //     const items = customerData.items || [];

// //     // ✅ Check availability before creating customer
// //     const availabilityCheck = await checkItemsAvailability(items);
// //     if (!availabilityCheck.allAvailable) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Some items are not available in requested quantity',
// //         unavailableItems: availabilityCheck.unavailable
// //       });
// //     }

// //     const remainingAmount = 
// //       customerData.totalAmount - (customerData.givenAmount || 0);

// //     const customer = await Customer.create({
// //       ...customerData,
// //       userId: req.userId,
// //       remainingAmount
// //     });

// //     // ✅ Rent the items
// //     await rentItems(items);

// //     res.status(201).json({
// //       success: true,
// //       message: 'Customer created successfully',
// //       data: customer
// //     });
// //   } catch (error) {
// //     console.error('Create customer error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error creating customer',
// //       error: error.message
// //     });
// //   }
// // };

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

//     const customer = await Customer.create({
//       ...customerData,
//       userId: req.userId,
//       remainingAmount
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

// // export const getCustomers = async (req, res) => {
// //   try {
// //     const { 
// //       status, 
// //       search, 
// //       startDate, 
// //       endDate,
// //       fitterName,
// //       page = 1,
// //       limit = 50
// //     } = req.query;
    
// //     const query = { userId: req.userId };
    
// //     if (status && status !== 'all') {
// //       query.status = status;
// //     }
    
// //     if (search) {
// //       query.$or = [
// //         { name: { $regex: search, $options: 'i' } },
// //         { phone: { $regex: search, $options: 'i' } },
// //         { fitterName: { $regex: search, $options: 'i' } }
// //       ];
// //     }
    
// //     if (startDate || endDate) {
// //       query.registrationDate = {};
// //       if (startDate) {
// //         query.registrationDate.$gte = new Date(startDate);
// //       }
// //       if (endDate) {
// //         query.registrationDate.$lte = new Date(endDate);
// //       }
// //     }
    
// //     if (fitterName) {
// //       query.fitterName = fitterName;
// //     }

// //     const skip = (Number(page) - 1) * Number(limit);

// //     const [customers, total] = await Promise.all([
// //       Customer.find(query)
// //         .sort({ registrationDate: -1 })
// //         .skip(skip)
// //         .limit(Number(limit))
// //         .lean(),
// //       Customer.countDocuments(query)
// //     ]);

// //     res.json({
// //       success: true,
// //       data: {
// //         customers,
// //         pagination: {
// //           total,
// //           page: Number(page),
// //           limit: Number(limit),
// //           totalPages: Math.ceil(total / Number(limit))
// //         }
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Get customers error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching customers'
// //     });
// //   }
// // };


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



// // ✅ GET customer by ID (for edit form)
// // export const getCustomerById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     const customer = await Customer.findById(id)
// //       .populate('items.itemId')
// //       .lean();

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Customer not found'
// //       });
// //     }

// //     // ✅ Ensure dates are properly formatted
// //     if (customer.checkInDate) {
// //       customer.checkInDate = new Date(customer.checkInDate).toISOString().split('T')[0];
// //     }
// //     if (customer.checkOutDate) {
// //       customer.checkOutDate = new Date(customer.checkOutDate).toISOString().split('T')[0];
// //     }

// //     res.json({
// //       success: true,
// //       data: customer
// //     });
// //   } catch (error) {
// //     console.error('Get customer by ID error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching customer'
// //     });
// //   }
// // };

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

// // export const updateCustomer = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updateData = req.body;

// //     if (updateData.totalAmount !== undefined || 
// //         updateData.givenAmount !== undefined) {
// //       const customer = await Customer.findById(id);
      
// //       if (customer) {
// //         updateData.remainingAmount = 
// //           (updateData.totalAmount ?? customer.totalAmount) - 
// //           (updateData.givenAmount ?? customer.givenAmount);
// //       }
// //     }

// //     const customer = await Customer.findByIdAndUpdate(
// //       id,
// //       updateData,
// //       { new: true, runValidators: true }
// //     );

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Customer not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Customer updated successfully',
// //       data: customer
// //     });
// //   } catch (error) {
// //     console.error('Update customer error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error updating customer'
// //     });
// //   }
// // };

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
//     } 
//     else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
//       console.log('❌ CANCELLING booking - Returning items to inventory');
      
//       if (customer.items && customer.items.length > 0) {
//         await returnItemsWithHistory(customer.items, 'Cancelled');
//       }
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


// // export const deleteCustomer = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     const customer = await Customer.findById(id);

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Customer not found'
// //       });
// //     }

// //     // ✅ Return items if customer is active/pending
// //     if (customer.status !== 'Completed' && customer.items && customer.items.length > 0) {
// //       await returnItems(customer.items);
// //     }

// //     await Customer.findByIdAndDelete(id);

// //     res.json({
// //       success: true,
// //       message: 'Customer deleted successfully'
// //     });
// //   } catch (error) {
// //     console.error('Delete customer error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error deleting customer'
// //     });
// //   }
// // };

// export const deleteCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     console.log('🗑️ DELETE CUSTOMER - Starting');
//     console.log('Customer ID:', id);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     console.log('Deleting customer:', customer.name);
//     console.log('Current Status:', customer.status);

//     // ✅ Return items if customer hasn't completed
//     if (customer.status !== 'Completed' && customer.items && customer.items.length > 0) {
//       console.log('🔄 Returning rented items to inventory');
//       await returnItemsWithHistory(customer.items, 'Deleted');
//     }

//     await Customer.findByIdAndDelete(id);

//     console.log('✅ Customer deleted successfully');

//     res.json({
//       success: true,
//       message: 'Customer deleted successfully'
//     });
//   } catch (error) {
//     console.error('❌ Delete customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting customer',
//       error: error.message
//     });
//   }
// };

// // ✅ UPDATED: Checkout customer with hourly rate calculation
// // export const checkoutCustomer = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { checkOutDate, checkOutTime, hourlyRate } = req.body;

// //     const customer = await Customer.findById(id);

// //     if (!customer) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Customer not found'
// //       });
// //     }

// //     // ✅ Parse check-in date-time
// //     const [inHours, inMinutes] = customer.checkInTime.split(':');
// //     const checkInDateTime = new Date(customer.checkInDate);
// //     checkInDateTime.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

// //     // ✅ Parse check-out date-time
// //     const [outHours, outMinutes] = checkOutTime.split(':');
// //     const checkOutDateTime = new Date(checkOutDate);
// //     checkOutDateTime.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

// //     // ✅ Calculate total hours
// //     const totalMilliseconds = checkOutDateTime - checkInDateTime;
// //     const totalHours = Math.ceil(totalMilliseconds / (1000 * 60 * 60));

// //     if (totalHours < 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Check-out time cannot be before check-in time'
// //       });
// //     }

// //     // ✅ 24-hour cycle calculation
// //     const rentalDays = Math.floor(totalHours / 24);
// //     const extraHours = totalHours % 24;

// //     // ✅ Calculate extra charges based on hourly rate
// //     let extraCharges = 0;
// //     if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
// //       extraCharges = Math.round(extraHours * hourlyRate);
// //     }

// //     // ✅ Update customer with rental info
// //     customer.checkOutDate = new Date(checkOutDate);
// //     customer.checkOutTime = checkOutTime;
// //     customer.rentalDays = rentalDays;
// //     customer.extraHours = extraHours;
// //     customer.extraCharges = extraCharges;
// //     customer.hourlyRate = hourlyRate || 0;
    
// //     // ✅ Update total amount - ADD extra charges
// //     const previousTotal = customer.totalAmount;
// //     customer.totalAmount = previousTotal + extraCharges;
// //     customer.remainingAmount = customer.totalAmount - customer.givenAmount;
    
// //     customer.status = 'Completed';

// //     await customer.save();

// //     // ✅ Return items to available
// //     if (customer.items && customer.items.length > 0) {
// //       await returnItems(customer.items);
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Customer checked out successfully',
// //       data: {
// //         customer,
// //         rentalInfo: {
// //           checkInDateTime: checkInDateTime.toISOString(),
// //           checkOutDateTime: checkOutDateTime.toISOString(),
// //           totalHours,
// //           rentalDays,
// //           extraHours,
// //           hourlyRate: hourlyRate || 0,
// //           extraCharges: Math.round(extraCharges),
// //           previousTotal: Math.round(previousTotal),
// //           extraChargesAdded: Math.round(extraCharges),
// //           newTotal: Math.round(customer.totalAmount),
// //           remainingAmountAfterCheckout: Math.round(customer.remainingAmount)
// //         }
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Checkout customer error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error checking out customer',
// //       error: error.message
// //     });
// //   }
// // };

// export const checkoutCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { checkOutDate, checkOutTime, hourlyRate } = req.body;

//     console.log('🔵 CHECKOUT CUSTOMER - Starting');
//     console.log('Customer ID:', id);

//     const customer = await Customer.findById(id);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     console.log('Checking out customer:', customer.name);

//     // ✅ Parse check-in date-time
//     const [inHours, inMinutes] = customer.checkInTime.split(':');
//     const checkInDateTime = new Date(customer.checkInDate);
//     checkInDateTime.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

//     // ✅ Parse check-out date-time
//     const [outHours, outMinutes] = checkOutTime.split(':');
//     const checkOutDateTime = new Date(checkOutDate);
//     checkOutDateTime.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

//     console.log('Check-in:', checkInDateTime.toISOString());
//     console.log('Check-out:', checkOutDateTime.toISOString());

//     // ✅ Calculate total hours
//     const totalMilliseconds = checkOutDateTime - checkInDateTime;
//     const totalHours = Math.ceil(totalMilliseconds / (1000 * 60 * 60));

//     if (totalHours < 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Check-out time cannot be before check-in time'
//       });
//     }

//     // ✅ 24-hour cycle calculation
//     const rentalDays = Math.floor(totalHours / 24);
//     const extraHours = totalHours % 24;

//     console.log(`Rental Duration: ${rentalDays} days, ${extraHours} hours`);

//     // ✅ Calculate extra charges based on hourly rate
//     let extraCharges = 0;
//     if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
//       extraCharges = Math.round(extraHours * hourlyRate);
//     }

//     console.log('Extra Charges:', extraCharges);

//     // ✅ Update customer with rental info
//     customer.checkOutDate = new Date(checkOutDate);
//     customer.checkOutTime = checkOutTime;
//     customer.rentalDays = rentalDays;
//     customer.extraHours = extraHours;
//     customer.extraCharges = extraCharges;
//     customer.hourlyRate = hourlyRate || 0;
    
//     // ✅ Update total amount - ADD extra charges
//     const previousTotal = customer.totalAmount;
//     customer.totalAmount = previousTotal + extraCharges;
//     customer.remainingAmount = customer.totalAmount - customer.givenAmount;
    
//     customer.status = 'Completed';

//     await customer.save();

//     // ✅ RETURN ITEMS to available
//     console.log('🔄 Returning items to inventory...');
//     if (customer.items && customer.items.length > 0) {
//       await returnItemsWithHistory(customer.items, 'Completed');
//     }

//     console.log('✅ Customer checked out and items returned');

//     res.json({
//       success: true,
//       message: 'Customer checked out successfully',
//       data: {
//         customer,
//         rentalInfo: {
//           checkInDateTime: checkInDateTime.toISOString(),
//           checkOutDateTime: checkOutDateTime.toISOString(),
//           totalHours,
//           rentalDays,
//           extraHours,
//           hourlyRate: hourlyRate || 0,
//           extraCharges: Math.round(extraCharges),
//           previousTotal: Math.round(previousTotal),
//           extraChargesAdded: Math.round(extraCharges),
//           newTotal: Math.round(customer.totalAmount),
//           remainingAmountAfterCheckout: Math.round(customer.remainingAmount)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('❌ Checkout customer error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error checking out customer',
//       error: error.message
//     });
//   }
// };

// // export const calculateRentalDuration = async (req, res) => {
// //   try {
// //     const { checkInDate, checkInTime, checkOutDate, checkOutTime, hourlyRate } = req.body;

// //     if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'All date and time fields are required'
// //       });
// //     }

// //     // Parse check-in date-time
// //     const [inHours, inMinutes] = checkInTime.split(':');
// //     const checkIn = new Date(checkInDate);
// //     checkIn.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

// //     // Parse check-out date-time
// //     const [outHours, outMinutes] = checkOutTime.split(':');
// //     const checkOut = new Date(checkOutDate);
// //     checkOut.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

// //     // Calculate total hours
// //     const totalHours = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60));
    
// //     if (totalHours < 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Check-out time cannot be before check-in time'
// //       });
// //     }

// //     // 24-hour cycle calculation
// //     const fullDays = Math.floor(totalHours / 24);
// //     const extraHours = totalHours % 24;

// //     // ✅ Calculate extra charges
// //     let extraCharges = 0;
// //     if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
// //       extraCharges = extraHours * hourlyRate;
// //     }

// //     res.json({
// //       success: true,
// //       data: {
// //         totalHours,
// //         fullDays,
// //         extraHours,
// //         hourlyRate: hourlyRate || 0,
// //         extraCharges: extraCharges.toFixed(2),
// //         message: `${fullDays} day(s) and ${extraHours} hour(s)${extraCharges > 0 ? ` + Extra Charge: ₹${extraCharges.toFixed(2)}` : ''}`
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Calculate rental duration error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error calculating rental duration'
// //     });
// //   }
// // };

// export const calculateRentalDuration = async (req, res) => {
//   try {
//     const { checkInDate, checkInTime, checkOutDate, checkOutTime, hourlyRate } = req.body;

//     console.log('🔵 CALCULATE RENTAL DURATION');

//     if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
//       return res.status(400).json({
//         success: false,
//         message: 'All date and time fields are required'
//       });
//     }

//     // Parse check-in date-time
//     const [inHours, inMinutes] = checkInTime.split(':');
//     const checkIn = new Date(checkInDate);
//     checkIn.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

//     // Parse check-out date-time
//     const [outHours, outMinutes] = checkOutTime.split(':');
//     const checkOut = new Date(checkOutDate);
//     checkOut.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

//     console.log('Check-in:', checkIn.toISOString());
//     console.log('Check-out:', checkOut.toISOString());

//     // Calculate total hours
//     const totalHours = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60));
    
//     if (totalHours < 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Check-out time cannot be before check-in time'
//       });
//     }

//     // 24-hour cycle calculation
//     const fullDays = Math.floor(totalHours / 24);
//     const extraHours = totalHours % 24;

//     console.log(`Duration: ${fullDays} days, ${extraHours} hours`);

//     // Calculate extra charges
//     let extraCharges = 0;
//     if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
//       extraCharges = extraHours * hourlyRate;
//     }

//     console.log('Extra Charges:', extraCharges);

//     res.json({
//       success: true,
//       data: {
//         totalHours,
//         fullDays,
//         extraHours,
//         hourlyRate: hourlyRate || 0,
//         extraCharges: parseFloat(extraCharges.toFixed(2)),
//         message: `${fullDays} day(s) and ${extraHours} hour(s)${extraCharges > 0 ? ` + Extra Charge: ₹${extraCharges.toFixed(2)}` : ''}`
//       }
//     });
//   } catch (error) {
//     console.error('❌ Calculate rental duration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error calculating rental duration',
//       error: error.message
//     });
//   }
// };

// export const getDashboardStats = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const [
//       totalBookings,
//       activeBookings,
//       completedBookings,
//       todaysBookings,
//       incomeData,
//       pendingData
//     ] = await Promise.all([
//       Customer.countDocuments({ userId }),
//       Customer.countDocuments({ userId, status: 'Active' }),
//       Customer.countDocuments({ userId, status: 'Completed' }),
//       Customer.countDocuments({
//         userId,
//         registrationDate: { $gte: today }
//       }),
//       Customer.aggregate([
//         { $match: { userId: userId, status: 'Completed' } },
//         { $group: { _id: null, total: { $sum: '$givenAmount' } } }
//       ]),
//       Customer.aggregate([
//         { $match: { userId: userId, status: { $in: ['Active', 'Pending'] } } },
//         { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
//       ])
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalBookings,
//         activeBookings,
//         completedBookings,
//         todaysBookings,
//         totalIncome: incomeData[0]?.total || 0,
//         pendingPayments: pendingData[0]?.total || 0
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics'
//     });
//   }
// };

// export const getEnhancedDashboardStats = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const [
//       totalBookings,
//       activeBookings,
//       completedBookings,
//       cancelledBookings,
//       todaysBookings,
//       totalIncome,
//       pendingPayments,
//       recentCustomers,
//     ] = await Promise.all([
//       Customer.countDocuments({ userId }),
//       Customer.countDocuments({ userId, status: 'Active' }),
//       Customer.countDocuments({ userId, status: 'Completed' }),
//       Customer.countDocuments({ userId, status: 'Cancelled' }),
//       Customer.countDocuments({
//         userId,
//         registrationDate: { $gte: today }
//       }),
//       Customer.aggregate([
//         { $match: { userId, status: 'Completed' } },
//         { $group: { _id: null, total: { $sum: '$givenAmount' } } }
//       ]),
//       Customer.aggregate([
//         { $match: { userId, status: { $in: ['Active', 'Pending'] } } },
//         { $group: { _id: null, total: { $sum: '$remainingAmount' } } }
//       ]),
//       Customer.find({ userId })
//         .sort({ registrationDate: -1 })
//         .limit(10)
//         .select('name phone registrationDate totalAmount givenAmount remainingAmount status fitterName')
//         .lean(),
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalBookings,
//         activeBookings,
//         completedBookings,
//         cancelledBookings,
//         todaysBookings,
//         totalIncome: totalIncome[0]?.total || 0,
//         pendingPayments: pendingPayments[0]?.total || 0,
//         recentCustomers,
//       }
//     });
//   } catch (error) {
//     console.error('Enhanced stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics'
//     });
//   }
// };

// export const getAnalytics = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { period = 'month' } = req.query;

//     const statusDistribution = await Customer.aggregate([
//       { $match: { userId } },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 },
//           totalAmount: { $sum: '$totalAmount' }
//         }
//       }
//     ]);

//     const currentDate = new Date();
//     const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
//     const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

//     const [lastMonthStats, thisMonthStats] = await Promise.all([
//       Customer.aggregate([
//         {
//           $match: {
//             userId,
//             registrationDate: {
//               $gte: lastMonthStart,
//               $lt: thisMonthStart
//             }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             bookings: { $sum: 1 },
//             revenue: { $sum: '$givenAmount' }
//           }
//         }
//       ]),
//       Customer.aggregate([
//         {
//           $match: {
//             userId,
//             registrationDate: { $gte: thisMonthStart }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             bookings: { $sum: 1 },
//             revenue: { $sum: '$givenAmount' }
//           }
//         }
//       ])
//     ]);

//     const prevMonth = lastMonthStats[0] || { bookings: 0, revenue: 0 };
//     const currMonth = thisMonthStats[0] || { bookings: 0, revenue: 0 };

//     const bookingsGrowth = prevMonth.bookings > 0
//       ? ((currMonth.bookings - prevMonth.bookings) / prevMonth.bookings * 100)
//       : 0;

//     const revenueGrowth = prevMonth.revenue > 0
//       ? ((currMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100)
//       : 0;

//     res.json({
//       success: true,
//       data: {
//         statusDistribution: statusDistribution,
//         growth: {
//           bookings: parseFloat(bookingsGrowth.toFixed(2)),
//           revenue: parseFloat(revenueGrowth.toFixed(2))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Analytics error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching analytics',
//       error: error.message
//     });
//   }
// };

// // export const getFinancialStats = async (req, res) => {
// //   try {
// //     const userId = req.userId;
// //     let { startDate, endDate } = req.query;

// //     const query = { userId };
    
// //     if (startDate || endDate) {
// //       query.registrationDate = {};
      
// //       if (startDate) {
// //         const start = new Date(startDate);
// //         start.setUTCHours(0, 0, 0, 0);
// //         query.registrationDate.$gte = start;
// //       }
      
// //       if (endDate) {
// //         const end = new Date(endDate);
// //         end.setUTCHours(23, 59, 59, 999);
// //         query.registrationDate.$lte = end;
// //       }
// //     }

// //     const customers = await Customer.find(query).lean();

// //     const financial = {
// //       totalRevenue: customers.reduce((sum, c) => sum + (c.givenAmount || 0), 0),
// //       pendingPayments: customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0),
// //       totalAmount: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
// //       extraChargesCollected: customers.reduce((sum, c) => sum + (c.extraCharges || 0), 0),
// //       completedBookings: customers.filter(c => c.status === 'Completed').length,
// //       activeBookings: customers.filter(c => c.status === 'Active').length,
// //       cancelledBookings: customers.filter(c => c.status === 'Cancelled').length,
// //       collectionRate: 0
// //     };

// //     if (financial.totalAmount > 0) {
// //       financial.collectionRate = parseFloat(
// //         ((financial.totalRevenue / financial.totalAmount) * 100).toFixed(2)
// //       );
// //     }

// //     const dailyBreakdown = await Customer.aggregate([
// //       { $match: query },
// //       {
// //         $group: {
// //           _id: {
// //             $dateToString: {
// //               format: '%Y-%m-%d',
// //               date: '$registrationDate',
// //               timezone: '+05:30'
// //             }
// //           },
// //           revenue: { $sum: '$givenAmount' },
// //           pending: { $sum: '$remainingAmount' },
// //           extraCharges: { $sum: '$extraCharges' },
// //           bookings: { $sum: 1 }
// //         }
// //       },
// //       { $sort: { _id: 1 } }
// //     ]);

// //     res.json({
// //       success: true,
// //       data: {
// //         financial,
// //         dailyBreakdown,
// //         summary: {
// //           totalCustomers: customers.length,
// //           avgTransactionValue: customers.length > 0 
// //             ? parseFloat((financial.totalRevenue / customers.length).toFixed(0))
// //             : 0
// //         }
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Financial stats error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error fetching financial statistics',
// //       error: error.message
// //     });
// //   }
// // };

// // =====================================================
// // FILE: backend/controllers/customerController.js
// // FUNCTION: getFinancialStats (FIXED)
// // =====================================================

// export const getFinancialStats = async (req, res) => {
//   try {
//     const userId = req.userId;
//     let { startDate, endDate } = req.query;

//     console.log("🔍 Financial Stats Request:");
//     console.log("  startDate:", startDate);
//     console.log("  endDate:", endDate);

//     const query = { userId };

//     if (startDate || endDate) {
//       query.registrationDate = {};

//       if (startDate) {
//         const start = new Date(startDate + "T00:00:00Z");
//         query.registrationDate.$gte = start;
//         console.log("  ✅ Start filter:", start.toISOString());
//       }

//       if (endDate) {
//         const end = new Date(endDate + "T23:59:59Z");
//         query.registrationDate.$lte = end;
//         console.log("  ✅ End filter:", end.toISOString());
//       }
//     }

//     console.log("  MongoDB Query:", JSON.stringify(query, null, 2));

//     // Get customers
//     const customers = await Customer.find(query).lean();
//     console.log("  📊 Customers found:", customers.length);

//     if (customers.length > 0) {
//       console.log("  Sample dates:");
//       customers.slice(0, 3).forEach((c, i) => {
//         console.log(`    [${i}] ${c.name}: ${new Date(c.registrationDate).toISOString().split("T")[0]}`);
//       });
//     }

//     // Calculate financial metrics
//     const financial = {
//       totalRevenue: customers.reduce((sum, c) => sum + (c.givenAmount || 0), 0),
//       pendingPayments: customers.reduce((sum, c) => sum + (c.remainingAmount || 0), 0),
//       totalAmount: customers.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
//       extraChargesCollected: customers.reduce((sum, c) => sum + (c.extraCharges || 0), 0),
//       completedBookings: customers.filter(c => c.status === "Completed").length,
//       activeBookings: customers.filter(c => c.status === "Active").length,
//       cancelledBookings: customers.filter(c => c.status === "Cancelled").length,
//       collectionRate: 0
//     };

//     if (financial.totalAmount > 0) {
//       financial.collectionRate = parseFloat(
//         ((financial.totalRevenue / financial.totalAmount) * 100).toFixed(2)
//       );
//     }

//     // ✅ FIXED: Get daily breakdown WITHOUT timezone issues
//     const dailyBreakdown = await Customer.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: {
//             $dateToString: {
//               format: "%Y-%m-%d",
//               date: "$registrationDate"
//               // NO TIMEZONE! MongoDB will use the server timezone
//             }
//           },
//           revenue: { $sum: "$givenAmount" },
//           pending: { $sum: "$remainingAmount" },
//           extraCharges: { $sum: "$extraCharges" },
//           bookings: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     console.log("📈 Daily breakdown result:", dailyBreakdown);

//     // ✅ FALLBACK: If aggregation returns empty, create from customer data
//     let finalDailyBreakdown = dailyBreakdown;

//     if (dailyBreakdown.length === 0 && customers.length > 0) {
//       console.warn("⚠️ Aggregation returned empty, using fallback...");

//       const groupedByDate = {};

//       customers.forEach(customer => {
//         // Parse date in UTC and convert to local date string
//         const date = new Date(customer.registrationDate);
//         const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

//         if (!groupedByDate[dateStr]) {
//           groupedByDate[dateStr] = {
//             _id: dateStr,
//             revenue: 0,
//             pending: 0,
//             extraCharges: 0,
//             bookings: 0
//           };
//         }

//         groupedByDate[dateStr].revenue += customer.givenAmount || 0;
//         groupedByDate[dateStr].pending += customer.remainingAmount || 0;
//         groupedByDate[dateStr].extraCharges += customer.extraCharges || 0;
//         groupedByDate[dateStr].bookings += 1;
//       });

//       finalDailyBreakdown = Object.values(groupedByDate)
//         .sort((a, b) => a._id.localeCompare(b._id));

//       console.log("✅ Fallback dailyBreakdown:", finalDailyBreakdown);
//     }

//     res.json({
//       success: true,
//       data: {
//         financial,
//         dailyBreakdown: finalDailyBreakdown,
//         summary: {
//           totalCustomers: customers.length,
//           avgTransactionValue: customers.length > 0
//             ? parseFloat((financial.totalRevenue / customers.length).toFixed(0))
//             : 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error("❌ Financial stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching financial statistics",
//       error: error.message
//     });
//   }
// };

// export const getFitterReport = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { startDate, endDate } = req.query;

//     const query = { userId };
    
//     if (startDate || endDate) {
//       query.registrationDate = {};
//       if (startDate) query.registrationDate.$gte = new Date(startDate);
//       if (endDate) query.registrationDate.$lte = new Date(endDate);
//     }

//     const fitterReport = await Customer.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: '$fitterName',
//           totalBookings: { $sum: 1 },
//           completedBookings: { 
//             $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
//           },
//           activeBookings: {
//             $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
//           },
//           totalRevenue: { $sum: '$givenAmount' },
//           totalAmount: { $sum: '$totalAmount' },
//           pendingAmount: { $sum: '$remainingAmount' }
//         }
//       },
//       { $sort: { totalRevenue: -1 } }
//     ]);

//     res.json({
//       success: true,
//       data: { fitterReport }
//     });
//   } catch (error) {
//     console.error('Fitter report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching fitter report'
//     });
//   }
// };

// // =====================================================
// // HELPER FUNCTIONS
// // =====================================================

// // async function checkItemsAvailability(items) {
// //   const unavailable = [];
// //   let allAvailable = true;

// //   for (const item of items) {
// //     const itemDoc = await Item.findById(item.itemId);
// //     if (!itemDoc || itemDoc.availableQuantity < item.quantity) {
// //       allAvailable = false;
// //       unavailable.push({
// //         itemId: item.itemId,
// //         itemName: item.itemName,
// //         requestedQuantity: item.quantity,
// //         availableQuantity: itemDoc?.availableQuantity || 0
// //       });
// //     }
// //   }

// //   return { allAvailable, unavailable };
// // }

// async function checkItemsAvailability(items) {
//   const unavailable = [];
//   let allAvailable = true;

//   for (const item of items) {
//     const itemDoc = await Item.findById(item.itemId);
//     if (!itemDoc || itemDoc.availableQuantity < item.quantity) {
//       allAvailable = false;
//       unavailable.push({
//         itemId: item.itemId,
//         itemName: item.itemName,
//         requestedQuantity: item.quantity,
//         availableQuantity: itemDoc?.availableQuantity || 0
//       });
//     }
//   }

//   return { allAvailable, unavailable };
// }

// // async function rentItems(items) {
// //   for (const item of items) {
// //     const itemDoc = await Item.findById(item.itemId);
// //     if (itemDoc) {
// //       itemDoc.availableQuantity -= item.quantity;
// //       itemDoc.rentedQuantity += item.quantity;
      
// //       if (itemDoc.availableQuantity === 0) {
// //         itemDoc.status = 'NotAvailable';
// //       } else if (itemDoc.rentedQuantity > 0) {
// //         itemDoc.status = 'InUse';
// //       }
      
// //       await itemDoc.save();
// //     }
// //   }
// // }

// // ✅ RENT ITEMS - Deduct from available
// async function rentItems(items) {
//   console.log('🔄 RENT ITEMS - Deducting from available');
  
//   for (const item of items) {
//     try {
//       const itemDoc = await Item.findById(item.itemId);
//       if (itemDoc) {
//         const oldAvailable = itemDoc.availableQuantity;
//         const oldRented = itemDoc.rentedQuantity;

//         itemDoc.availableQuantity -= item.quantity;
//         itemDoc.rentedQuantity += item.quantity;
        
//         console.log(`  📦 ${itemDoc.name}:`);
//         console.log(`     Available: ${oldAvailable} → ${itemDoc.availableQuantity}`);
//         console.log(`     Rented: ${oldRented} → ${itemDoc.rentedQuantity}`);

//         // Auto-sync status
//         if (itemDoc.availableQuantity === 0) {
//           itemDoc.status = 'NotAvailable';
//         } else if (itemDoc.rentedQuantity > 0) {
//           itemDoc.status = 'InUse';
//         }
        
//         // Add to history
//         if (!itemDoc.quantityHistory) {
//           itemDoc.quantityHistory = [];
//         }
//         itemDoc.quantityHistory.push({
//           date: new Date(),
//           action: 'rented',
//           quantityChanged: item.quantity,
//           availableQuantity: itemDoc.availableQuantity,
//           rentedQuantity: itemDoc.rentedQuantity,
//           notes: `Rented ${item.quantity} unit(s)`
//         });
        
//         await itemDoc.save();
//       }
//     } catch (error) {
//       console.error(`❌ Error renting item ${item.itemId}:`, error);
//     }
//   }
  
//   console.log('✅ Items rented successfully');
// }

// async function returnItems(items) {
//   for (const item of items) {
//     const itemDoc = await Item.findById(item.itemId);
//     if (itemDoc) {
//       itemDoc.availableQuantity += item.quantity;
//       itemDoc.rentedQuantity -= item.quantity;
      
//       if (itemDoc.rentedQuantity === 0) {
//         itemDoc.status = 'Available';
//       } else {
//         itemDoc.status = 'InUse';
//       }
      
//       await itemDoc.save();
//     }
//   }
// }

// // ✅ RETURN ITEMS - Add back to available with history
// async function returnItemsWithHistory(items, reason = 'Completed') {
//   console.log(`🔄 RETURN ITEMS (${reason}) - Adding back to available`);
  
//   for (const item of items) {
//     try {
//       const itemDoc = await Item.findById(item.itemId || item._id);
//       if (itemDoc) {
//         const oldAvailable = itemDoc.availableQuantity;
//         const oldRented = itemDoc.rentedQuantity;

//         itemDoc.availableQuantity += item.quantity;
//         itemDoc.rentedQuantity -= item.quantity;
        
//         console.log(`  📦 ${itemDoc.name}:`);
//         console.log(`     Available: ${oldAvailable} → ${itemDoc.availableQuantity}`);
//         console.log(`     Rented: ${oldRented} → ${itemDoc.rentedQuantity}`);

//         // Auto-sync status
//         if (itemDoc.availableQuantity === 0) {
//           itemDoc.status = 'NotAvailable';
//         } else if (itemDoc.rentedQuantity === 0) {
//           itemDoc.status = 'Available';
//         } else {
//           itemDoc.status = 'InUse';
//         }

//         // Add to history
//         if (!itemDoc.quantityHistory) {
//           itemDoc.quantityHistory = [];
//         }
//         itemDoc.quantityHistory.push({
//           date: new Date(),
//           action: 'returned',
//           quantityChanged: item.quantity,
//           availableQuantity: itemDoc.availableQuantity,
//           rentedQuantity: itemDoc.rentedQuantity,
//           notes: `Returned ${item.quantity} unit(s) (Customer: ${reason})`
//         });
        
//         await itemDoc.save();
//       }
//     } catch (error) {
//       console.error(`❌ Error returning item ${item.itemId || item._id}:`, error);
//     }
//   }
  
//   console.log(`✅ Items returned successfully (${reason})`);
// }

import Customer from '../models/Customer.js';
import Item from '../models/Item.js';

// =====================================================
// CREATE CUSTOMER - RENT ITEMS
// =====================================================
export const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    const items = customerData.items || [];

    console.log('🔵 CREATE CUSTOMER - Starting');
    console.log('📦 Items to rent:', items);

    // ✅ Check availability before creating customer
    const availabilityCheck = await checkItemsAvailability(items);
    if (!availabilityCheck.allAvailable) {
      console.error('❌ Items not available:', availabilityCheck.unavailable);
      return res.status(400).json({
        success: false,
        message: 'Some items are not available in requested quantity',
        unavailableItems: availabilityCheck.unavailable
      });
    }

    const remainingAmount = 
      customerData.totalAmount - (customerData.givenAmount || 0);

    // ✅ Initialize rental history
    const initialHistory = {
      action: 'created',
      itemsUsed: items || [],
      totalQuantityUsed: (items || []).reduce((sum, item) => sum + item.quantity, 0),
      totalValueUsed: (items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: 'Active',
      notes: 'Customer created'
    };

    const customer = await Customer.create({
      ...customerData,
      userId: req.userId,
      remainingAmount,
      rentalHistory: [initialHistory]
    });

    console.log('✅ Customer created:', customer._id);

    // ✅ RENT the items - Deduct from available
    console.log('🔄 Renting items...');
    await rentItems(items);

    console.log('✅ Customer created and items rented successfully');

    res.status(201).json({
      success: true,
      message: 'Customer created successfully and items rented',
      data: customer
    });
  } catch (error) {
    console.error('❌ Create customer error:', error);
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
export const getCustomers = async (req, res) => {
  try {
    const { 
      status, 
      search, 
      startDate, 
      endDate,
      fitterName,
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
    
    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) {
        query.registrationDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.registrationDate.$lte = new Date(endDate);
      }
    }
    
    if (fitterName) {
      query.fitterName = fitterName;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
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
    console.error('❌ Get customers error:', error);
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
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔵 GET CUSTOMER BY ID:', id);

    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // ✅ Format dates properly
    if (customer.checkInDate) {
      customer.checkInDate = new Date(customer.checkInDate)
        .toISOString()
        .split('T')[0];
    }
    if (customer.checkOutDate) {
      customer.checkOutDate = new Date(customer.checkOutDate)
        .toISOString()
        .split('T')[0];
    }

    console.log('✅ Customer found:', customer.name);

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('❌ Get customer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

// =====================================================
// UPDATE CUSTOMER - HANDLE ITEM RETURN
// =====================================================
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('🔵 UPDATE CUSTOMER - Starting');
    console.log('Customer ID:', id);
    console.log('Update Data:', updateData);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const oldStatus = customer.status;
    const newStatus = updateData.status;

    console.log(`📊 Status Change: ${oldStatus} → ${newStatus}`);

    // ✅ HANDLE STATUS CHANGES - Return items
    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
      console.log('🏁 COMPLETING booking - Returning items to inventory');
      
      if (customer.items && customer.items.length > 0) {
        await returnItemsWithHistory(customer.items, 'Completed');
      }

      // ✅ Add to rental history
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
        rentalDays: updateData.rentalDays || customer.rentalDays || 0,
        extraHours: updateData.extraHours || customer.extraHours || 0,
        extraCharges: updateData.extraCharges || customer.extraCharges || 0,
        notes: 'Customer status changed to Completed'
      });
    } 
    else if (newStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      console.log('❌ CANCELLING booking - Returning items to inventory');
      
      if (customer.items && customer.items.length > 0) {
        await returnItemsWithHistory(customer.items, 'Cancelled');
      }

      // ✅ Add to rental history
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
        notes: 'Customer status changed to Cancelled'
      });
    }

    // ✅ Calculate remaining amount
    if (updateData.totalAmount !== undefined || updateData.givenAmount !== undefined) {
      updateData.remainingAmount = 
        (updateData.totalAmount ?? customer.totalAmount) - 
        (updateData.givenAmount ?? customer.givenAmount);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('✅ Customer updated successfully');
    console.log('Updated Status:', updatedCustomer.status);

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('❌ Update customer error:', error);
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
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ DELETE CUSTOMER - Starting');
    console.log('Customer ID:', id);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    console.log('Deleting customer:', customer.name);
    console.log('Current Status:', customer.status);

    // ✅ Return items if customer hasn't completed
    if (customer.status !== 'Completed' && customer.items && customer.items.length > 0) {
      console.log('🔄 Returning rented items to inventory');
      await returnItemsWithHistory(customer.items, 'Deleted');
    }

    await Customer.findByIdAndDelete(id);

    console.log('✅ Customer deleted successfully');

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete customer error:', error);
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
export const checkoutCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkOutDate, checkOutTime, hourlyRate } = req.body;

    console.log('🔵 CHECKOUT CUSTOMER - Starting');
    console.log('Customer ID:', id);

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    console.log('Checking out customer:', customer.name);

    // ✅ Parse check-in date-time
    const [inHours, inMinutes] = customer.checkInTime.split(':');
    const checkInDateTime = new Date(customer.checkInDate);
    checkInDateTime.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

    // ✅ Parse check-out date-time
    const [outHours, outMinutes] = checkOutTime.split(':');
    const checkOutDateTime = new Date(checkOutDate);
    checkOutDateTime.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

    console.log('Check-in:', checkInDateTime.toISOString());
    console.log('Check-out:', checkOutDateTime.toISOString());

    // ✅ Calculate total hours
    const totalMilliseconds = checkOutDateTime - checkInDateTime;
    const totalHours = Math.ceil(totalMilliseconds / (1000 * 60 * 60));

    if (totalHours < 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out time cannot be before check-in time'
      });
    }

    // ✅ 24-hour cycle calculation
    const rentalDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;

    console.log(`Rental Duration: ${rentalDays} days, ${extraHours} hours`);

    // ✅ Calculate extra charges based on hourly rate
    let extraCharges = 0;
    if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
      extraCharges = Math.round(extraHours * hourlyRate);
    }

    console.log('Extra Charges:', extraCharges);

    // ✅ Update customer with rental info
    customer.checkOutDate = new Date(checkOutDate);
    customer.checkOutTime = checkOutTime;
    customer.rentalDays = rentalDays;
    customer.extraHours = extraHours;
    customer.extraCharges = extraCharges;
    customer.hourlyRate = hourlyRate || 0;
    
    // ✅ Update total amount - ADD extra charges
    const previousTotal = customer.totalAmount;
    customer.totalAmount = previousTotal + extraCharges;
    customer.remainingAmount = customer.totalAmount - customer.givenAmount;
    
    customer.status = 'Completed';

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
      rentalDays: rentalDays,
      extraHours: extraHours,
      extraCharges: extraCharges,
      notes: 'Customer checked out'
    });

    await customer.save();

    // ✅ RETURN ITEMS to available
    console.log('🔄 Returning items to inventory...');
    if (customer.items && customer.items.length > 0) {
      await returnItemsWithHistory(customer.items, 'Completed');
    }

    console.log('✅ Customer checked out and items returned');

    res.json({
      success: true,
      message: 'Customer checked out successfully',
      data: {
        customer,
        rentalInfo: {
          checkInDateTime: checkInDateTime.toISOString(),
          checkOutDateTime: checkOutDateTime.toISOString(),
          totalHours,
          rentalDays,
          extraHours,
          hourlyRate: hourlyRate || 0,
          extraCharges: Math.round(extraCharges),
          previousTotal: Math.round(previousTotal),
          extraChargesAdded: Math.round(extraCharges),
          newTotal: Math.round(customer.totalAmount),
          remainingAmountAfterCheckout: Math.round(customer.remainingAmount)
        }
      }
    });
  } catch (error) {
    console.error('❌ Checkout customer error:', error);
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
export const calculateRentalDuration = async (req, res) => {
  try {
    const { checkInDate, checkInTime, checkOutDate, checkOutTime, hourlyRate } = req.body;

    console.log('🔵 CALCULATE RENTAL DURATION');

    if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'All date and time fields are required'
      });
    }

    // Parse check-in date-time
    const [inHours, inMinutes] = checkInTime.split(':');
    const checkIn = new Date(checkInDate);
    checkIn.setHours(parseInt(inHours), parseInt(inMinutes), 0, 0);

    // Parse check-out date-time
    const [outHours, outMinutes] = checkOutTime.split(':');
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(parseInt(outHours), parseInt(outMinutes), 0, 0);

    console.log('Check-in:', checkIn.toISOString());
    console.log('Check-out:', checkOut.toISOString());

    // Calculate total hours
    const totalHours = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60));
    
    if (totalHours < 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out time cannot be before check-in time'
      });
    }

    // 24-hour cycle calculation
    const fullDays = Math.floor(totalHours / 24);
    const extraHours = totalHours % 24;

    console.log(`Duration: ${fullDays} days, ${extraHours} hours`);

    // Calculate extra charges
    let extraCharges = 0;
    if (extraHours > 0 && hourlyRate && hourlyRate > 0) {
      extraCharges = extraHours * hourlyRate;
    }

    console.log('Extra Charges:', extraCharges);

    res.json({
      success: true,
      data: {
        totalHours,
        fullDays,
        extraHours,
        hourlyRate: hourlyRate || 0,
        extraCharges: parseFloat(extraCharges.toFixed(2)),
        message: `${fullDays} day(s) and ${extraHours} hour(s)${extraCharges > 0 ? ` + Extra Charge: ₹${extraCharges.toFixed(2)}` : ''}`
      }
    });
  } catch (error) {
    console.error('❌ Calculate rental duration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating rental duration',
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
    console.error('❌ Dashboard stats error:', error);
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
    console.error('❌ Enhanced stats error:', error);
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
    console.error('❌ Analytics error:', error);
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
    console.error('❌ Financial stats error:', error);
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
    console.error('❌ Fitter report error:', error);
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

// ✅ RENT ITEMS - Deduct from available
async function rentItems(items) {
  console.log('🔄 RENT ITEMS - Deducting from available');
  
  for (const item of items) {
    try {
      const itemDoc = await Item.findById(item.itemId);
      if (itemDoc) {
        const oldAvailable = itemDoc.availableQuantity;
        const oldRented = itemDoc.rentedQuantity;

        itemDoc.availableQuantity -= item.quantity;
        itemDoc.rentedQuantity += item.quantity;
        
        console.log(`  📦 ${itemDoc.name}:`);
        console.log(`     Available: ${oldAvailable} → ${itemDoc.availableQuantity}`);
        console.log(`     Rented: ${oldRented} → ${itemDoc.rentedQuantity}`);

        // Auto-sync status
        if (itemDoc.availableQuantity === 0) {
          itemDoc.status = 'NotAvailable';
        } else if (itemDoc.rentedQuantity > 0) {
          itemDoc.status = 'InUse';
        }
        
        // Add to history
        if (!itemDoc.quantityHistory) {
          itemDoc.quantityHistory = [];
        }
        itemDoc.quantityHistory.push({
          date: new Date(),
          action: 'rented',
          quantityChanged: item.quantity,
          availableQuantity: itemDoc.availableQuantity,
          rentedQuantity: itemDoc.rentedQuantity,
          notes: `Rented ${item.quantity} unit(s)`
        });
        
        await itemDoc.save();
      }
    } catch (error) {
      console.error(`❌ Error renting item ${item.itemId}:`, error);
    }
  }
  
  console.log('✅ Items rented successfully');
}

// ✅ RETURN ITEMS - Add back to available with history
async function returnItemsWithHistory(items, reason = 'Completed') {
  console.log(`🔄 RETURN ITEMS (${reason}) - Adding back to available`);
  
  for (const item of items) {
    try {
      const itemDoc = await Item.findById(item.itemId || item._id);
      if (itemDoc) {
        const oldAvailable = itemDoc.availableQuantity;
        const oldRented = itemDoc.rentedQuantity;

        itemDoc.availableQuantity += item.quantity;
        itemDoc.rentedQuantity -= item.quantity;
        
        console.log(`  📦 ${itemDoc.name}:`);
        console.log(`     Available: ${oldAvailable} → ${itemDoc.availableQuantity}`);
        console.log(`     Rented: ${oldRented} → ${itemDoc.rentedQuantity}`);

        // Auto-sync status
        if (itemDoc.availableQuantity === 0) {
          itemDoc.status = 'NotAvailable';
        } else if (itemDoc.rentedQuantity === 0) {
          itemDoc.status = 'Available';
        } else {
          itemDoc.status = 'InUse';
        }

        // Add to history
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
      console.error(`❌ Error returning item ${item.itemId || item._id}:`, error);
    }
  }
  
  console.log(`✅ Items returned successfully (${reason})`);
}