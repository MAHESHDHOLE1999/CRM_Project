import api from './api';

export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  confirm: (id, convertToCustomer = false) => api.post(`/bookings/${id}/confirm`, { convertToCustomer }),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
  getStats: () => api.get('/bookings/stats')
};