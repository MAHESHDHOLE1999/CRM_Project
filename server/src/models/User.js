import mongoose from 'mongoose';
import { type } from 'os';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
    default: 'admin'
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  managedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  isInactive: {
    type: Boolean,
    default: false
  },
  // ✅ Fields for forgot password flow
  resetOTP: {
    type: String,
    // select: false // Don't return OTP by default
  },
  resetOTPExpiry: {
    type: Date,
    // select: false
  },
  resetToken: {
    type: String,
    // select: false
  },
  resetTokenExpiry: {
    type: Date,
    // select: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// ✅ Index for faster queries
userSchema.index({ email: 1, username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdBy: 1 }); // For filtering users by admin
userSchema.index({ managedBy: 1 });
userSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model('User', userSchema);