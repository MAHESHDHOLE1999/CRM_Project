// import mongoose from 'mongoose';

// const itemUsageSchema = new mongoose.Schema({
//   itemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Item'
//   },
//   _id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Item'
//   },
//   itemName: String,
//   name: String,
//   quantity: {
//     type: Number,
//     required: true
//   },
//   price: {
//     type: Number,
//     default: 0
//   }
// }, { _id: false });

// const rentalHistorySchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   action: {
//     type: String,
//     enum: ['created', 'updated', 'completed', 'cancelled', 'deleted'],
//     required: true
//   },
//   itemsUsed: [itemUsageSchema],
//   totalQuantityUsed: Number,
//   totalValueUsed: Number,
//   status: {
//     type: String,
//     enum: ['Active', 'Completed', 'Cancelled'],
//     required: true
//   },
//   rentalDays: Number,
//   extraHours: Number,
//   extraCharges: Number,
//   notes: String
// }, { _id: false });

// const customerSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     name: {
//       type: String,
//       required: [true, 'Customer name is required'],
//       trim: true
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required'],
//       trim: true
//     },
//     address: {
//       type: String,
//       trim: true
//     },
//     checkInDate: {
//       type: Date,
//       required: true
//     },
//     checkInTime: {
//       type: String,
//       default: '10:00'
//     },
//     checkOutDate: Date,
//     checkOutTime: String,
    
//     // ✅ Items used during rental
//     items: [itemUsageSchema],
    
//     // ✅ Financial Information
//     totalAmount: {
//       type: Number,
//       default: 0
//     },
//     depositAmount: {
//       type: Number,
//       default: 0
//     },
//     givenAmount: {
//       type: Number,
//       default: 0
//     },
//     remainingAmount: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Extra Charges (Hourly Rate)
//     hourlyRate: {
//       type: Number,
//       default: 0
//     },
//     extraCharges: {
//       type: Number,
//       default: 0
//     },
//     rentalDays: {
//       type: Number,
//       default: 0
//     },
//     extraHours: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Transport Information
//     transportRequired: {
//       type: Boolean,
//       default: false
//     },
//     transportCost: {
//       type: Number,
//       default: 0
//     },
//     transportLocation: String,
    
//     // ✅ Maintenance & Additional Charges
//     maintenanceCharges: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Status & Additional Info
//     status: {
//       type: String,
//       enum: ['Active', 'Completed', 'Cancelled'],
//       default: 'Active'
//     },
//     fitterName: String,
//     notes: String,
    
//     // ✅ RENTAL HISTORY - Track all status changes
//     rentalHistory: [rentalHistorySchema],
    
//     registrationDate: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // ✅ INDEX for faster queries
// customerSchema.index({ userId: 1, status: 1 });
// customerSchema.index({ userId: 1, registrationDate: -1 });
// customerSchema.index({ phone: 1 });
// customerSchema.index({ fitterName: 1 });

// // ✅ VIRTUAL for total items used
// customerSchema.virtual('totalItemsUsed').get(function() {
//   return (this.items || []).reduce((sum, item) => sum + item.quantity, 0);
// });

// // ✅ VIRTUAL for rental status display
// customerSchema.virtual('rentalStatus').get(function() {
//   const statuses = {
//     'Active': '🟢 Active (In Progress)',
//     'Completed': '🟢 Completed (Returned)',
//     'Cancelled': '🔴 Cancelled (Returned)'
//   };
//   return statuses[this.status] || this.status;
// });

// // ✅ METHOD to add rental history entry
// customerSchema.methods.addRentalHistory = function(historyEntry) {
//   try {
//     if (!this.rentalHistory) {
//       this.rentalHistory = [];
//     }

//     const entry = {
//       date: new Date(),
//       action: historyEntry.action,
//       itemsUsed: historyEntry.itemsUsed || this.items || [],
//       totalQuantityUsed: historyEntry.totalQuantityUsed || (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
//       totalValueUsed: historyEntry.totalValueUsed || (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//       status: historyEntry.status || this.status,
//       rentalDays: historyEntry.rentalDays || this.rentalDays || 0,
//       extraHours: historyEntry.extraHours || this.extraHours || 0,
//       extraCharges: historyEntry.extraCharges || this.extraCharges || 0,
//       notes: historyEntry.notes || ''
//     };

//     this.rentalHistory.push(entry);
//     console.log(`✅ Added rental history entry: ${entry.action}`);
//     return this;
//   } catch (error) {
//     console.error('❌ Error adding rental history:', error.message);
//     throw error;
//   }
// };

// // ✅ METHOD to get rental summary
// customerSchema.methods.getRentalSummary = function() {
//   return {
//     name: this.name,
//     phone: this.phone,
//     status: this.status,
//     checkInDate: this.checkInDate,
//     checkOutDate: this.checkOutDate,
//     rentalDays: this.rentalDays,
//     extraHours: this.extraHours,
//     itemsRented: this.items || [],
//     totalItemsUsed: (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
//     totalValueUsed: (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//     extraCharges: this.extraCharges,
//     totalAmount: this.totalAmount,
//     givenAmount: this.givenAmount,
//     remainingAmount: this.remainingAmount,
//     rentalHistory: this.rentalHistory || []
//   };
// };

// // ✅ METHOD to format dates
// customerSchema.methods.formatDates = function() {
//   if (this.checkInDate) {
//     this.checkInDate = new Date(this.checkInDate).toISOString().split('T')[0];
//   }
//   if (this.checkOutDate) {
//     this.checkOutDate = new Date(this.checkOutDate).toISOString().split('T')[0];
//   }
//   return this;
// };

// // ✅ Ensure virtuals are included in JSON
// customerSchema.set('toJSON', { virtuals: true });

// export default mongoose.model('Customer', customerSchema);


//Version 2
// import mongoose from 'mongoose';

// const itemUsageSchema = new mongoose.Schema({
//   itemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Item'
//   },
//   _id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Item'
//   },
//   itemName: String,
//   name: String,
//   quantity: {
//     type: Number,
//     required: true
//   },
//   price: {
//     type: Number,
//     default: 0
//   }
// }, { _id: false });

// const rentalHistorySchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   action: {
//     type: String,
//     enum: ['created', 'updated', 'completed', 'cancelled', 'deleted'],
//     required: true
//   },
//   itemsUsed: [itemUsageSchema],
//   totalQuantityUsed: Number,
//   totalValueUsed: Number,
//   status: {
//     type: String,
//     enum: ['Active', 'Completed', 'Cancelled'],
//     required: true
//   },
//   // ✅ Per-item extra charges in history
//   itemsExtraCharges: {
//     type: Map,
//     of: Number,
//     default: {}
//   },
//   totalExtraCharges: Number,
//   notes: String
// }, { _id: false });

// const customerSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     name: {
//       type: String,
//       required: [true, 'Customer name is required'],
//       trim: true
//     },
//     phone: {
//       type: String,
//       required: [true, 'Phone number is required'],
//       trim: true
//     },
//     address: {
//       type: String,
//       trim: true
//     },
//     checkInDate: {
//       type: Date,
//       required: true
//     },
//     checkInTime: {
//       type: String,
//       default: '10:00'
//     },
//     checkOutDate: Date,
//     checkOutTime: String,
    
//     // ✅ Items used during rental
//     items: [itemUsageSchema],
    
//     // ✅ Financial Information
//     totalAmount: {
//       type: Number,
//       default: 0
//     },
//     depositAmount: {
//       type: Number,
//       default: 0
//     },
//     givenAmount: {
//       type: Number,
//       default: 0
//     },
//     remainingAmount: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Extra Charges (Total from all per-item charges)
//     extraCharges: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Per-item extra charges (Map: itemId -> chargeAmount)
//     // Admin manually enters charges for each item
//     itemsExtraCharges: {
//       type: Map,
//       of: Number,
//       default: {}
//     },
    
//     // ✅ Transport Information
//     transportRequired: {
//       type: Boolean,
//       default: false
//     },
//     transportCost: {
//       type: Number,
//       default: 0
//     },
//     transportLocation: String,
    
//     // ✅ Maintenance & Additional Charges
//     maintenanceCharges: {
//       type: Number,
//       default: 0
//     },
    
//     // ✅ Status & Additional Info
//     status: {
//       type: String,
//       enum: ['Active', 'Completed', 'Cancelled'],
//       default: 'Active'
//     },
//     fitterName: String,
//     notes: String,
    
//     // ✅ RENTAL HISTORY - Track all status changes
//     rentalHistory: [rentalHistorySchema],
    
//     registrationDate: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // ✅ INDEX for faster queries
// customerSchema.index({ userId: 1, status: 1 });
// customerSchema.index({ userId: 1, registrationDate: -1 });
// customerSchema.index({ phone: 1 });
// customerSchema.index({ fitterName: 1 });

// // ✅ VIRTUAL for total items used
// customerSchema.virtual('totalItemsUsed').get(function() {
//   return (this.items || []).reduce((sum, item) => sum + item.quantity, 0);
// });

// // ✅ VIRTUAL for rental status display
// customerSchema.virtual('rentalStatus').get(function() {
//   const statuses = {
//     'Active': '🟢 Active (In Progress)',
//     'Completed': '🟢 Completed (Returned)',
//     'Cancelled': '🔴 Cancelled (Returned)'
//   };
//   return statuses[this.status] || this.status;
// });

// // ✅ VIRTUAL for total per-item extra charges
// customerSchema.virtual('totalPerItemExtraCharges').get(function() {
//   if (!this.itemsExtraCharges || this.itemsExtraCharges.size === 0) {
//     return 0;
//   }

//   let total = 0;
//   for (const [, charge] of this.itemsExtraCharges) {
//     total += parseFloat(charge) || 0;
//   }
//   return total;
// });

// // ✅ VIRTUAL for breakdown summary
// customerSchema.virtual('chargesBreakdown').get(function() {
//   const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
//   const perItemExtraCharges = this.totalPerItemExtraCharges || 0;
//   const transportCost = this.transportCost || 0;
//   const maintenanceCharges = this.maintenanceCharges || 0;

//   return {
//     itemsCost,
//     perItemExtraCharges,
//     transportCost,
//     maintenanceCharges,
//     totalAmount: itemsCost + perItemExtraCharges + transportCost + maintenanceCharges
//   };
// });

// // ✅ METHOD to add rental history entry
// customerSchema.methods.addRentalHistory = function(historyEntry) {
//   try {
//     if (!this.rentalHistory) {
//       this.rentalHistory = [];
//     }

//     const itemsExtraChargesObj = {};
//     if (this.itemsExtraCharges && this.itemsExtraCharges.size > 0) {
//       for (const [key, value] of this.itemsExtraCharges) {
//         itemsExtraChargesObj[key] = value;
//       }
//     }

//     const entry = {
//       date: new Date(),
//       action: historyEntry.action,
//       itemsUsed: historyEntry.itemsUsed || this.items || [],
//       totalQuantityUsed: historyEntry.totalQuantityUsed || (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
//       totalValueUsed: historyEntry.totalValueUsed || (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
//       status: historyEntry.status || this.status,
//       itemsExtraCharges: historyEntry.itemsExtraCharges || itemsExtraChargesObj || {},
//       totalExtraCharges: historyEntry.totalExtraCharges || this.totalPerItemExtraCharges || 0,
//       notes: historyEntry.notes || ''
//     };

//     this.rentalHistory.push(entry);
//     console.log(`✅ Added rental history entry: ${entry.action}`);
//     return this;
//   } catch (error) {
//     console.error('❌ Error adding rental history:', error.message);
//     throw error;
//   }
// };

// // ✅ METHOD to get rental summary
// customerSchema.methods.getRentalSummary = function() {
//   const itemsExtraChargesObj = {};
//   if (this.itemsExtraCharges && this.itemsExtraCharges.size > 0) {
//     for (const [key, value] of this.itemsExtraCharges) {
//       itemsExtraChargesObj[key] = value;
//     }
//   }

//   const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);

//   return {
//     name: this.name,
//     phone: this.phone,
//     status: this.status,
//     checkInDate: this.checkInDate,
//     checkOutDate: this.checkOutDate,
//     itemsRented: this.items || [],
//     totalItemsUsed: (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
//     itemsCost: itemsCost,
//     itemsExtraCharges: itemsExtraChargesObj,
//     totalPerItemExtraCharges: this.totalPerItemExtraCharges || 0,
//     chargesBreakdown: this.chargesBreakdown,
//     totalAmount: this.totalAmount,
//     givenAmount: this.givenAmount,
//     remainingAmount: this.remainingAmount,
//     rentalHistory: this.rentalHistory || []
//   };
// };

// // ✅ METHOD to get items with their individual extra charges
// customerSchema.methods.getItemsWithExtraCharges = function() {
//   if (!this.items || this.items.length === 0) {
//     return [];
//   }

//   return this.items.map((item) => {
//     const itemKey = item.itemId || item._id;
//     const itemExtraCharge = this.itemsExtraCharges?.get(itemKey) || 0;

//     return {
//       itemId: itemKey,
//       itemName: item.itemName || item.name,
//       quantity: item.quantity,
//       unitPrice: item.price,
//       itemCost: item.quantity * item.price,
      
//       // ✅ Per-item extra charge (manually entered)
//       extraCharge: parseFloat(itemExtraCharge) || 0,
      
//       // ✅ Total with extra charge
//       totalWithExtra: (item.quantity * item.price) + (parseFloat(itemExtraCharge) || 0)
//     };
//   });
// };

// // ✅ METHOD to calculate complete charges breakdown
// customerSchema.methods.calculateChargesBreakdown = function() {
//   const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
//   const perItemExtraCharges = this.totalPerItemExtraCharges || 0;
//   const transportCost = this.transportCost || 0;
//   const maintenanceCharges = this.maintenanceCharges || 0;

//   const totalCost = itemsCost + perItemExtraCharges + transportCost + maintenanceCharges;

//   return {
//     itemsCost,
//     itemsExtraChargesDetail: this.getItemsWithExtraCharges(),
//     perItemExtraCharges,
//     transportCost,
//     maintenanceCharges,
//     totalCost,
//     depositAmount: this.depositAmount || 0,
//     givenAmount: this.givenAmount || 0,
//     remainingAmount: totalCost - (this.givenAmount || 0)
//   };
// };

// // ✅ METHOD to format dates
// customerSchema.methods.formatDates = function() {
//   if (this.checkInDate) {
//     this.checkInDate = new Date(this.checkInDate).toISOString().split('T')[0];
//   }
//   if (this.checkOutDate) {
//     this.checkOutDate = new Date(this.checkOutDate).toISOString().split('T')[0];
//   }
  
//   return this;
// };

// // ✅ REMOVED: Pre-save middleware (moved validation to controller)

// // ✅ POST-FIND MIDDLEWARE: Convert Map to object if needed
// customerSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
//   if (!docs) return;

//   const processDoc = (doc) => {
//     if (!doc) return;

//     // Convert itemsExtraCharges Map to object for API response
//     if (doc.itemsExtraCharges) {
//       if (doc.itemsExtraCharges instanceof Map) {
//         const obj = {};
//         for (const [key, value] of doc.itemsExtraCharges) {
//           obj[key] = value;
//         }
//         doc.itemsExtraCharges = obj;
//       }
//     }

//     // Process rental history
//     if (doc.rentalHistory && Array.isArray(doc.rentalHistory)) {
//       doc.rentalHistory.forEach((history) => {
//         if (history && history.itemsExtraCharges) {
//           if (history.itemsExtraCharges instanceof Map) {
//             const obj = {};
//             for (const [key, value] of history.itemsExtraCharges) {
//               obj[key] = value;
//             }
//             history.itemsExtraCharges = obj;
//           }
//         }
//       });
//     }
//   };

//   if (Array.isArray(docs)) {
//     docs.forEach(processDoc);
//   } else {
//     processDoc(docs);
//   }
// });

// // ✅ Ensure virtuals are included in JSON
// customerSchema.set('toJSON', { virtuals: true });
// customerSchema.set('toObject', { virtuals: true });

// export default mongoose.model('Customer', customerSchema);

// File: backend/models/Customer.js
// COMPLETE: Customer model with per-item checkout data

import mongoose from 'mongoose';

const itemUsageSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  itemName: String,
  name: String,
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    default: 0
  }
}, { _id: false });

const rentalHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'completed', 'cancelled', 'deleted'],
    required: true
  },
  itemsUsed: [itemUsageSchema],
  totalQuantityUsed: Number,
  totalValueUsed: Number,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    required: true
  },
  itemsExtraCharges: {
    type: Map,
    of: Number,
    default: {}
  },
  totalExtraCharges: Number,
  notes: String
}, { _id: false });

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkInTime: {
      type: String,
      default: '10:00'
    },
    checkOutDate: Date,
    checkOutTime: String,
    
    // ✅ Items used during rental
    items: [itemUsageSchema],
    
    // ✅ Financial Information
    totalAmount: {
      type: Number,
      default: 0
    },
    depositAmount: {
      type: Number,
      default: 0
    },
    givenAmount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    },
    
    // ✅ Extra Charges (Total from all per-item charges)
    extraCharges: {
      type: Number,
      default: 0
    },
    
    // ✅ Per-item extra charges (Map: itemId -> chargeAmount)
    // Admin manually enters charges for each item or auto-calculated from hourly rate
    itemsCheckoutData: {
      type: Map,
      of: new mongoose.Schema({
        checkOutDate: String,
        checkOutTime: String,
        rentalDays: Number,
        extraHours: Number,
        hourlyRate: Number,
        extraCharges: Number
      }, { _id: false }),
      default: {}
    },
    
    // ✅ Transport Information
    transportRequired: {
      type: Boolean,
      default: false
    },
    transportCost: {
      type: Number,
      default: 0
    },
    transportLocation: String,
    
    // ✅ Maintenance & Additional Charges
    maintenanceCharges: {
      type: Number,
      default: 0
    },
    
    // ✅ Status & Additional Info
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active'
    },
    fitterName: String,
    notes: String,
    
    // ✅ RENTAL HISTORY - Track all status changes
    rentalHistory: [rentalHistorySchema],
    
    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// ✅ INDEX for faster queries
customerSchema.index({ userId: 1, status: 1 });
customerSchema.index({ userId: 1, registrationDate: -1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ fitterName: 1 });

// ✅ VIRTUAL for total items used
customerSchema.virtual('totalItemsUsed').get(function() {
  return (this.items || []).reduce((sum, item) => sum + item.quantity, 0);
});

// ✅ VIRTUAL for rental status display
customerSchema.virtual('rentalStatus').get(function() {
  const statuses = {
    'Active': '🟢 Active (In Progress)',
    'Completed': '🟢 Completed (Returned)',
    'Cancelled': '🔴 Cancelled (Returned)'
  };
  return statuses[this.status] || this.status;
});

// ✅ VIRTUAL for total per-item extra charges
customerSchema.virtual('totalPerItemExtraCharges').get(function() {
  if (!this.itemsCheckoutData || this.itemsCheckoutData.size === 0) {
    return 0;
  }

  let total = 0;
  for (const [, charge] of this.itemsCheckoutData) {
    total += parseFloat(charge?.extraCharges) || 0;
  }
  return total;
});

// ✅ VIRTUAL for breakdown summary
customerSchema.virtual('chargesBreakdown').get(function() {
  const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const perItemExtraCharges = this.totalPerItemExtraCharges || 0;
  const transportCost = this.transportCost || 0;
  const maintenanceCharges = this.maintenanceCharges || 0;

  return {
    itemsCost,
    perItemExtraCharges,
    transportCost,
    maintenanceCharges,
    totalAmount: itemsCost + perItemExtraCharges + transportCost + maintenanceCharges
  };
});

// ✅ METHOD to add rental history entry
customerSchema.methods.addRentalHistory = function(historyEntry) {
  try {
    if (!this.rentalHistory) {
      this.rentalHistory = [];
    }

    const itemsExtraChargesObj = {};
    if (this.itemsCheckoutData && this.itemsCheckoutData.size > 0) {
      for (const [key, value] of this.itemsCheckoutData) {
        itemsExtraChargesObj[key] = value;
      }
    }

    const entry = {
      date: new Date(),
      action: historyEntry.action,
      itemsUsed: historyEntry.itemsUsed || this.items || [],
      totalQuantityUsed: historyEntry.totalQuantityUsed || (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
      totalValueUsed: historyEntry.totalValueUsed || (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: historyEntry.status || this.status,
      itemsExtraCharges: historyEntry.itemsExtraCharges || itemsExtraChargesObj || {},
      totalExtraCharges: historyEntry.totalExtraCharges || this.totalPerItemExtraCharges || 0,
      notes: historyEntry.notes || ''
    };

    this.rentalHistory.push(entry);
    console.log(`✅ Added rental history entry: ${entry.action}`);
    return this;
  } catch (error) {
    console.error('❌ Error adding rental history:', error.message);
    throw error;
  }
};

// ✅ METHOD to get rental summary
customerSchema.methods.getRentalSummary = function() {
  const itemsExtraChargesObj = {};
  if (this.itemsCheckoutData && this.itemsCheckoutData.size > 0) {
    for (const [key, value] of this.itemsCheckoutData) {
      itemsExtraChargesObj[key] = value;
    }
  }

  const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return {
    name: this.name,
    phone: this.phone,
    status: this.status,
    checkInDate: this.checkInDate,
    checkOutDate: this.checkOutDate,
    itemsRented: this.items || [],
    totalItemsUsed: (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
    itemsCost: itemsCost,
    itemsCheckoutData: itemsExtraChargesObj,
    totalPerItemExtraCharges: this.totalPerItemExtraCharges || 0,
    chargesBreakdown: this.chargesBreakdown,
    totalAmount: this.totalAmount,
    givenAmount: this.givenAmount,
    remainingAmount: this.remainingAmount,
    rentalHistory: this.rentalHistory || []
  };
};

// ✅ METHOD to get items with their individual extra charges
customerSchema.methods.getItemsWithExtraCharges = function() {
  if (!this.items || this.items.length === 0) {
    return [];
  }

  return this.items.map((item) => {
    const itemKey = item.itemId || item._id;
    const checkoutData = this.itemsCheckoutData?.get(itemKey) || {};

    return {
      itemId: itemKey,
      itemName: item.itemName || item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      itemCost: item.quantity * item.price,
      
      // ✅ Per-item checkout details
      checkOutDate: checkoutData.checkOutDate || '',
      checkOutTime: checkoutData.checkOutTime || '',
      rentalDays: checkoutData.rentalDays || 0,
      extraHours: checkoutData.extraHours || 0,
      hourlyRate: checkoutData.hourlyRate || 0,
      extraCharge: parseFloat(checkoutData.extraCharges) || 0,
      
      // ✅ Total with extra charge
      totalWithExtra: (item.quantity * item.price) + (parseFloat(checkoutData.extraCharges) || 0)
    };
  });
};

// ✅ METHOD to calculate complete charges breakdown
customerSchema.methods.calculateChargesBreakdown = function() {
  const itemsCost = (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const perItemExtraCharges = this.totalPerItemExtraCharges || 0;
  const transportCost = this.transportCost || 0;
  const maintenanceCharges = this.maintenanceCharges || 0;

  const totalCost = itemsCost + perItemExtraCharges + transportCost + maintenanceCharges;

  return {
    itemsCost,
    itemsExtraChargesDetail: this.getItemsWithExtraCharges(),
    perItemExtraCharges,
    transportCost,
    maintenanceCharges,
    totalCost,
    depositAmount: this.depositAmount || 0,
    givenAmount: this.givenAmount || 0,
    remainingAmount: totalCost - (this.givenAmount || 0)
  };
};

// ✅ METHOD to format dates
customerSchema.methods.formatDates = function() {
  if (this.checkInDate) {
    this.checkInDate = new Date(this.checkInDate).toISOString().split('T')[0];
  }
  if (this.checkOutDate) {
    this.checkOutDate = new Date(this.checkOutDate).toISOString().split('T')[0];
  }
  
  return this;
};

// ✅ POST-FIND MIDDLEWARE: Convert Map to object if needed
customerSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
  if (!docs) return;

  const processDoc = (doc) => {
    if (!doc) return;

    // Convert itemsCheckoutData Map to object for API response
    if (doc.itemsCheckoutData) {
      if (doc.itemsCheckoutData instanceof Map) {
        const obj = {};
        for (const [key, value] of doc.itemsCheckoutData) {
          obj[key] = value;
        }
        doc.itemsCheckoutData = obj;
      }
    }

    // Process rental history
    if (doc.rentalHistory && Array.isArray(doc.rentalHistory)) {
      doc.rentalHistory.forEach((history) => {
        if (history && history.itemsExtraCharges) {
          if (history.itemsExtraCharges instanceof Map) {
            const obj = {};
            for (const [key, value] of history.itemsExtraCharges) {
              obj[key] = value;
            }
            history.itemsExtraCharges = obj;
          }
        }
      });
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(processDoc);
  } else {
    processDoc(docs);
  }
});

// ✅ Ensure virtuals are included in JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Customer', customerSchema);