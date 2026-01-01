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
  rentalDays: Number,
  extraHours: Number,
  extraCharges: Number,
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
    
    // ✅ Extra Charges (Hourly Rate)
    hourlyRate: {
      type: Number,
      default: 0
    },
    extraCharges: {
      type: Number,
      default: 0
    },
    rentalDays: {
      type: Number,
      default: 0
    },
    extraHours: {
      type: Number,
      default: 0
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

// ✅ METHOD to add rental history entry
customerSchema.methods.addRentalHistory = function(historyEntry) {
  try {
    if (!this.rentalHistory) {
      this.rentalHistory = [];
    }

    const entry = {
      date: new Date(),
      action: historyEntry.action,
      itemsUsed: historyEntry.itemsUsed || this.items || [],
      totalQuantityUsed: historyEntry.totalQuantityUsed || (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
      totalValueUsed: historyEntry.totalValueUsed || (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: historyEntry.status || this.status,
      rentalDays: historyEntry.rentalDays || this.rentalDays || 0,
      extraHours: historyEntry.extraHours || this.extraHours || 0,
      extraCharges: historyEntry.extraCharges || this.extraCharges || 0,
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
  return {
    name: this.name,
    phone: this.phone,
    status: this.status,
    checkInDate: this.checkInDate,
    checkOutDate: this.checkOutDate,
    rentalDays: this.rentalDays,
    extraHours: this.extraHours,
    itemsRented: this.items || [],
    totalItemsUsed: (this.items || []).reduce((sum, item) => sum + item.quantity, 0),
    totalValueUsed: (this.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0),
    extraCharges: this.extraCharges,
    totalAmount: this.totalAmount,
    givenAmount: this.givenAmount,
    remainingAmount: this.remainingAmount,
    rentalHistory: this.rentalHistory || []
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

// ✅ Ensure virtuals are included in JSON
customerSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Customer', customerSchema);