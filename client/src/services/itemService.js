import api from './api';

export const itemService = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getCategories: () => api.get('/items/categories'),
  
  // NEW: Rent items when booking/customer is created
  rentItems: (items) => api.post('/items/bulk-rent', { items }),
  
  // NEW: Return items when customer is completed
  returnItems: (items) => api.post('/items/bulk-return', { items }),
  
  // NEW: Get item availability (check before adding to booking)
  checkAvailability: (items) => api.post('/items/check-availability', { items })
};