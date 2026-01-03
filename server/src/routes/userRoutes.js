// File: routes/userRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  changePassword
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (Forgot Password)
// ==========================================

// Send OTP to email
router.post('/forgot-password', forgotPassword);

// Verify OTP and get reset token
router.post('/verify-otp', verifyOTP);

// Reset password with token
router.post('/reset-password', resetPassword);

// ==========================================
// PROTECTED ROUTES (Require Authentication)
// ==========================================

// Change password (logged-in users)
router.post('/change-password', authenticate, changePassword);

// ==========================================
// ADMIN ONLY ROUTES (User Management)
// ==========================================

// Get all users
router.get('/', authenticate, authorize('admin'), getAllUsers);

// Get single user
router.get('/:id', authenticate, authorize('admin'), getUserById);

// Create new user
router.post('/', authenticate, authorize('admin'), createUser);

// Update user
router.put('/:id', authenticate, authorize('admin'), updateUser);

// Delete user
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;