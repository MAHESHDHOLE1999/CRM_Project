import api from './api';

export const customerService = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  checkout: (id, data) => api.post(`/customers/${id}/checkout`, data),
  getStats: () => api.get('/customers/stats'),
  getEnhancedStats: () => api.get('/customers/enhanced-stats'),
  getAnalytics: (period) => api.get('/customers/analytics', { params: { period } }), // Add this
  calculateDuration: (data) => api.post('/customers/calculate-duration', data)
};