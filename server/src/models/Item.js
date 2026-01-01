import mongoose from 'mongoose';

const quantityHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    enum: ['created', 'added', 'rented', 'returned'],
    required: true
  },
  quantityAdded: {
    type: Number,
    default: 0
  },
  quantityChanged: {
    type: Number,
    default: 0
  },
  previousTotal: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    default: 0
  },
  availableQuantity: {
    type: Number,
    default: 0
  },
  rentedQuantity: {
    type: Number,
    default: 0
  },
  notes: String
});

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    nameMarathi: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      default: 0,
      min: [0, 'Total quantity cannot be negative']
    },
    availableQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Available quantity cannot be negative']
    },
    rentedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Rented quantity cannot be negative']
    },
    status: {
      type: String,
      enum: ['Available', 'InUse', 'NotAvailable'],
      default: 'Available'
    },
    quantityHistory: [quantityHistorySchema],
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
itemSchema.index({ name: 'text', nameMarathi: 'text', description: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });

// Method to rent item
itemSchema.methods.rentItem = async function(quantity) {
  if (this.availableQuantity < quantity) {
    throw new Error(`Insufficient quantity. Available: ${this.availableQuantity}`);
  }

  this.availableQuantity -= quantity;
  this.rentedQuantity += quantity;

  if (this.availableQuantity === 0) {
    this.status = 'NotAvailable';
  } else if (this.rentedQuantity > 0) {
    this.status = 'InUse';
  }

  if (!this.quantityHistory) {
    this.quantityHistory = [];
  }

  this.quantityHistory.push({
    date: new Date(),
    action: 'rented',
    quantityChanged: quantity,
    availableQuantity: this.availableQuantity,
    rentedQuantity: this.rentedQuantity,
    notes: `Rented ${quantity} unit(s)`
  });

  return this.save();
};

// Method to return item
itemSchema.methods.returnItem = async function(quantity) {
  if (this.rentedQuantity < quantity) {
    throw new Error(`Cannot return more than rented. Rented: ${this.rentedQuantity}`);
  }

  this.availableQuantity += quantity;
  this.rentedQuantity -= quantity;

  if (this.availableQuantity === 0) {
    this.status = 'NotAvailable';
  } else if (this.rentedQuantity === 0) {
    this.status = 'Available';
  } else {
    this.status = 'InUse';
  }

  if (!this.quantityHistory) {
    this.quantityHistory = [];
  }

  this.quantityHistory.push({
    date: new Date(),
    action: 'returned',
    quantityChanged: quantity,
    availableQuantity: this.availableQuantity,
    rentedQuantity: this.rentedQuantity,
    notes: `Returned ${quantity} unit(s)`
  });

  return this.save();
};

// Method to add quantity
itemSchema.methods.addQuantity = async function(quantity, notes = '') {
  const previousTotal = this.totalQuantity;
  this.totalQuantity += quantity;
  this.availableQuantity += quantity;

  if (!this.quantityHistory) {
    this.quantityHistory = [];
  }

  this.quantityHistory.push({
    date: new Date(),
    action: 'added',
    quantityAdded: quantity,
    previousTotal: previousTotal,
    totalQuantity: this.totalQuantity,
    availableQuantity: this.availableQuantity,
    notes: notes || `Added ${quantity} unit(s) to existing stock`
  });

  // Auto-update status
  if (this.availableQuantity > 0 && this.rentedQuantity === 0) {
    this.status = 'Available';
  } else if (this.rentedQuantity > 0) {
    this.status = 'InUse';
  }

  return this.save();
};

// Virtual for total rented vs available
itemSchema.virtual('utilizationRate').get(function() {
  if (this.totalQuantity === 0) return 0;
  return Math.round((this.rentedQuantity / this.totalQuantity) * 100);
});

// Ensure virtuals are included in JSON
itemSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Item', itemSchema);