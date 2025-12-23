import mongoose from 'mongoose';

const customerItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  itemName: String,
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    default: 0
  }
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date
  },
  checkInTime: {
    type: String,
    required: true,
    default: '10:00'
  },
  checkOutTime: {
    type: String
  },
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
  transportRequired: {
    type: Boolean,
    default: false
  },
  transportCost: {
    type: Number,
    default: 0
  },
  transportLocation: {
    type: String
  },
  maintenanceCharges: {
    type: Number,
    default: 0
  },
  // NEW FIELDS for 24-hour cycle
  rentalDays: {
    type: Number,
    default: 1
  },
  extraHours: {
    type: Number,
    default: 0
  },
  extraCharges: {
    type: Number,
    default: 0
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Pending'],
    default: 'Active'
  },
  fitterName: {
    type: String
  },
  notes: {
    type: String
  },
  items: [customerItemSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Method to calculate rental duration and charges
customerSchema.methods.calculateRentalCharges = function() {
  if (!this.checkInDate || !this.checkInTime) {
    return { days: 0, hours: 0, extraCharges: 0 };
  }

  const checkInDateTime = this.getCheckInDateTime();
  let checkOutDateTime;

  if (this.checkOutDate && this.checkOutTime) {
    checkOutDateTime = this.getCheckOutDateTime();
  } else {
    // If not checked out yet, calculate till now
    checkOutDateTime = new Date();
  }

  // Calculate total hours difference
  const totalHours = Math.ceil((checkOutDateTime - checkInDateTime) / (1000 * 60 * 60));
  
  // 24-hour cycle calculation
  const fullDays = Math.floor(totalHours / 24);
  const extraHours = totalHours % 24;

  // Calculate extra charges if there's an hourly rate
  let extraCharges = 0;
  if (extraHours > 0 && this.hourlyRate > 0) {
    extraCharges = extraHours * this.hourlyRate;
  }

  return {
    days: fullDays,
    hours: extraHours,
    extraCharges: extraCharges
  };
};

// Method to get check-in date-time
customerSchema.methods.getCheckInDateTime = function() {
  const [hours, minutes] = this.checkInTime.split(':');
  const checkInDateTime = new Date(this.checkInDate);
  checkInDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return checkInDateTime;
};

// Method to get check-out date-time
customerSchema.methods.getCheckOutDateTime = function() {
  if (!this.checkOutDate || !this.checkOutTime) {
    return null;
  }
  const [hours, minutes] = this.checkOutTime.split(':');
  const checkOutDateTime = new Date(this.checkOutDate);
  checkOutDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return checkOutDateTime;
};

// Pre-save hook to calculate rental charges
customerSchema.pre('save', function() {
  if (this.checkOutDate && this.checkOutTime) {
    const charges = this.calculateRentalCharges();
    this.rentalDays = charges.days;
    this.extraHours = charges.hours;
    this.extraCharges = charges.extraCharges;
  }
});

// Index for faster queries
customerSchema.index({ userId: 1, status: 1 });
customerSchema.index({ registrationDate: -1 });
customerSchema.index({ name: 'text', phone: 'text' });

export default mongoose.model('Customer', customerSchema);