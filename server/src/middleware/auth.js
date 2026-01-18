import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    // Token comes from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // ✅ NEW: Get user and store role in request
    const user = await User.findById(req.userId);
    if (user) {
      req.userRole = user.role; // 'admin' or 'user'
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session'
    });
  }
};

// ✅ Authorization Middleware (Check user role)
export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user from database to check role
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }

      // Attach user to request
      req.user = user;
      req.userRole = user.role;

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};
