import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameMarathi: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Available', 'NotAvailable', 'InUse'],
    default: 'Available'
  },
  category: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  rentedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual field to check if item is in stock
itemSchema.virtual('inStock').get(function() {
  return this.availableQuantity > 0;
});

// Auto-update status based on availability
itemSchema.pre('save', function(next) {
  if (this.availableQuantity === 0) {
    this.status = 'NotAvailable';
  } else if (this.rentedQuantity > 0) {
    this.status = 'InUse';
  } else {
    this.status = 'Available';
  }
//   next();
});

// Method to update quantities when item is rented
itemSchema.methods.rentItem = function(quantity) {
  if (this.availableQuantity < quantity) {
    throw new Error('Insufficient quantity available');
  }
  this.availableQuantity -= quantity;
  this.rentedQuantity += quantity;
  return this.save();
};

// Method to update quantities when item is returned
itemSchema.methods.returnItem = function(quantity) {
  if (this.rentedQuantity < quantity) {
    throw new Error('Cannot return more than rented quantity');
  }
  this.availableQuantity += quantity;
  this.rentedQuantity -= quantity;
  return this.save();
};

export default mongoose.model('Item', itemSchema);