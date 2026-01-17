import mongoose from 'mongoose';

const advancedBookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  
  // ✅ NEW: Registration Date & Time (when booking was registered)
  registrationDate: {
    type: Date,
    required: true,
    default: () => new Date()
  },
  registrationTime: {
    type: String,
    required: true,
    default: () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  },
  
  // ✅ EXISTING: Booking Date & Time (when customer needs items)
  bookingDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  
  // Items and amounts
  items: {
    type: String  // JSON string of selected items
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
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('AdvancedBooking', advancedBookingSchema);