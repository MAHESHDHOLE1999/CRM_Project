// File: src/services/authService.js
import api from './api';

export const authService = {
  // Login
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  // Register
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
  
  // Logout
  logout: () => 
    api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => 
    api.get('/auth/me'),
  
  // Forgot password - Send OTP
  forgotPassword: (email) => 
    api.post('/users/forgot-password', { email }),
  
  // Verify OTP
  verifyOtp: (email, otp) => 
    api.post('/users/verify-otp', { email, otp }),
  
  // Reset password
  resetPassword: (email, newPassword, resetToken) => 
    api.post('/users/reset-password', { email, newPassword, resetToken }),
  
  // Change password (for logged-in users)
  changePassword: (oldPassword, newPassword) => 
    api.post('/auth/change-password', { oldPassword, newPassword })
};


// File: src/services/userService.js
import api from './api';

export const userService = {
  // Get all users
  getAll: (params) => 
    api.get('/users', { params }),
  
  // Get single user
  getById: (id) => 
    api.get(`/users/${id}`),
  
  // Create user
  create: (data) => 
    api.post('/users', data),
  
  // Update user
  update: (id, data) => 
    api.put(`/users/${id}`, data),
  
  // Delete user
  delete: (id) => 
    api.delete(`/users/${id}`),
  
  // Bulk actions
  bulkDelete: (userIds) => 
    api.post('/users/bulk-delete', { userIds }),
  
  // Reset user password (admin only)
  resetUserPassword: (userId) => 
    api.post(`/users/${userId}/reset-password`),
  
  // Toggle user status
  toggleStatus: (userId) => 
    api.patch(`/users/${userId}/toggle-status`),
  
  // Get user statistics
  getStats: () => 
    api.get('/users/stats')
};