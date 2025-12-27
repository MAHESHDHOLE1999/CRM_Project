import api from './api';

export const customerService = {
  // Customer CRUD
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  checkout: (id, data) => api.post(`/customers/${id}/checkout`, data),
  
  // Duration Calculation
  calculateDuration: (data) => api.post('/customers/calculate-duration', data),
  
  // Dashboard Stats Endpoints
  getStats: () => api.get('/customers/stats'),
  getEnhancedDashboardStats: () => api.get('/customers/enhanced-stats'),
  
  // Analytics & Financial Data
  getAnalytics: (period) => 
    api.get('/customers/analytics', { params: { period } }),
  
  getFinancialStats: (params) => 
    api.get('/customers/financial-stats', { params }),
  
  // Fitter Report (for dashboard fitter performance chart)
  getFitterReport: (params) => 
    api.get('/customers/fitter-report', { params })
};