// File: controllers/userController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../../utils/logger.js';

dotenv.config();
// ✅ Email configuration - Update with your SMTP details
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});



// ==========================================
// USER MANAGEMENT (CRUD Operations)
// ==========================================

// Get all users (only show users in same organization - if you add org support later)
export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    
    // Build filter
    let filter = {};
    
    if (search) {
      filter = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (role && role !== 'all') {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('-password -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 });

    // Map users to ensure all fields are included
    const formattedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isInactive: user.isInactive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({
      success: true,
      data: {
        users : formattedUsers,
        summary: {
          total: formattedUsers.length,
          admins: formattedUsers.filter(u => u.role === 'admin').length,
          active: formattedUsers.filter(u => !u.isInactive).length
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Get single user

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Select all fields EXCEPT password and sensitive reset fields
    const user = await User.findById(id).select('-password -resetOTP -resetOTPExpiry -resetToken -resetTokenExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return the full user object including phone
    res.json({
      success: true,
      data: { 
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          isInactive: user.isInactive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      email,
      phone: phone || undefined,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, password, role } = req.body;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is unique (if being changed)
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone || ''; // Handle empty string
    if (password) {
      // Hash password if provided
      user.password = await bcrypt.hash(password, 12);
    }
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          isInactive: user.isInactive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// ==========================================
// FORGOT PASSWORD FUNCTIONALITY
// ==========================================

// Step 1: Send OTP to email
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     console.log("Email", email);
//     console.log(process.env.SMTP_HOST);

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required'
//       });
//     }

//     // Check if user exists
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Generate OTP (6 digits)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//     console.log('OTP Storage Debug:', {
//       otp,
//       otpExpiry,
//       expiryTimestamp: otpExpiry.getTime()
//     });

//     // Save OTP to user
//     user.resetOTP = otp;
//     user.resetOTPExpiry = otpExpiry;
//     await user.save();

//     // Send OTP via email
//     try {
//       await transporter.sendMail({
//         from: process.env.SMTP_FROM,
//         to: email,
//         subject: 'Password Reset OTP - Ajay Gadhi Bandar CRM',
//         html: `
//           <h2>Password Reset Request</h2>
//           <p>Your OTP is: <strong>${otp}</strong></p>
//           <p>This OTP will expire in 5 minutes.</p>
//           <p>If you didn't request this, please ignore this email.</p>
//         `
//       });
//     } catch (emailError) {
//       console.error('Email sending error:', emailError);
//       return res.status(500).json({
//         success: false,
//         message: 'Error sending OTP email'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'OTP sent to your email'
//     });
//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error processing forgot password request'
//     });
//   }
// };

// Step 2: Verify OTP
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     console.log("Email and otp", email," ", otp);

//     // if (!email || !otp) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: 'Email and OTP are required'
//     //   });
//     // }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // FIX: Convert resetOTPExpiry to number to ensure consistent comparison
//     const otpExpiry = user.resetOTPExpiry instanceof Date 
//       ? user.resetOTPExpiry.getTime() 
//       : new Date(user.resetOTPExpiry).getTime();
//     const currentTime = Date.now();

//     console.log('OTP Verification Debug:', {
//       storedOTP: user.resetOTP,
//       providedOTP: otp,
//       otpExpiry,
//       currentTime,
//       isExpired: otpExpiry < currentTime,
//       timeRemaining: Math.round((otpExpiry - currentTime) / 1000) + ' seconds'
//     });

//     // Check if OTP is expired
//     if (otpExpiry < currentTime) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP has expired. Please request a new one.'
//       });
//     }

//     // Verify OTP (convert both to string for comparison)
//     if (user.resetOTP.toString().trim() !== otp.toString().trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP'
//       });
//     }

//     // Generate reset token (valid for 10 minutes)
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;
    
//     // Clear OTP after successful verification
//     user.resetOTP = undefined;
//     user.resetOTPExpiry = undefined;
    
//     await user.save();

//     res.json({
//       success: true,
//       message: 'OTP verified successfully',
//       data: {
//         resetToken
//       }
//     });
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error verifying OTP'
//     });
//   }
// };

// Step 1: Send OTP to email (FIXED)
// Step 1: Send OTP to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info("=== FORGOT PASSWORD REQUEST ===");
    logger.info("Email received:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    logger.warn("User found:", user ? user.email : 'NOT FOUND');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    logger.info('Generated OTP:', otp);
    logger.info('OTP Expiry:', otpExpiry);
    logger.info('Current Time:', new Date());

    // Save OTP to user
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    
    // Save and check if successful
    const savedUser = await user.save();
    logger.info('User saved successfully');
    logger.info('Saved OTP in DB:', savedUser.resetOTP);
    logger.info('Saved OTP Expiry in DB:', savedUser.resetOTPExpiry);

    // Verify OTP was actually saved
    const verifyUser = await User.findOne({ email });
    logger.info('Verified - OTP in DB:', verifyUser.resetOTP);
    logger.info('Verified - OTP Expiry in DB:', verifyUser.resetOTPExpiry);

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Password Reset OTP - Ajay Gadhi Bandar CRM',
        html: `
          <h2>Password Reset Request</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
      logger.info('Email sent successfully');
    } catch (emailError) {
      logger.error('Email sending error:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error sending OTP email'
      });
    }

    logger.info("=== FORGOT PASSWORD SUCCESS ===\n");
    res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request'
    });
  }
};

// Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    logger.info("\n=== VERIFY OTP REQUEST ===");
    logger.info("Received email:", email);
    logger.info("Received OTP:", otp);

    // Validate input
    if (!email || !otp) {
      logger.warn('Validation failed - missing email or otp');
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const user = await User.findOne({ email });
    logger.warn("User found:", user ? user.email : 'NOT FOUND');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP exists in DB
    logger.info('OTP in DB:', user.resetOTP);
    logger.info('OTP Expiry in DB:', user.resetOTPExpiry);

    if (!user.resetOTP) {
      logger.warn('ERROR: No OTP found in database');
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new one.'
      });
    }

    // Properly handle Date objects
    let otpExpiry;
    if (user.resetOTPExpiry) {
      otpExpiry = user.resetOTPExpiry instanceof Date 
        ? user.resetOTPExpiry.getTime() 
        : new Date(user.resetOTPExpiry).getTime();
    }
    
    const currentTime = Date.now();

    logger.info('=== TIME DEBUG ===');
    logger.info('OTP Expiry Timestamp:', otpExpiry);
    logger.info('Current Time Timestamp:', currentTime);
    logger.info('Time Remaining (seconds):', otpExpiry ? Math.round((otpExpiry - currentTime) / 1000) : 'N/A');
    logger.info('Is Expired?:', otpExpiry && otpExpiry < currentTime);

    // Check if OTP is expired
    if (!otpExpiry || otpExpiry < currentTime) {
      logger.warn('ERROR: OTP has expired');
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Verify OTP
    const storedOTP = String(user.resetOTP).trim();
    const providedOTP = String(otp).trim();
    
    logger.info('=== OTP COMPARISON ===');
    logger.info('Stored OTP:', `"${storedOTP}"`, `(length: ${storedOTP.length})`);
    logger.info('Provided OTP:', `"${providedOTP}"`, `(length: ${providedOTP.length})`);
    logger.info('Match?:', storedOTP === providedOTP);

    if (storedOTP !== providedOTP) {
      logger.warn('ERROR: OTP mismatch');
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    logger.info('OTP VERIFIED SUCCESSFULLY');

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    // Clear OTP after verification
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    
    await user.save();
    logger.info('Reset token generated and saved');
    logger.info("=== VERIFY OTP SUCCESS ===\n");

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken
      }
    });
  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP'
    });
  }
};

// Step 3: Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;
    logger.info("\n=== RESET PASSWORD REQUEST ===");
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify reset token
    if (user.resetToken !== resetToken || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear tokens
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();

    logger.info("=== RESET PASSWORD SUCCESS ===\n");

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

// Change password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old and new passwords are required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};