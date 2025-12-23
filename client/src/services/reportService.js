import api from './api';

export const reportService = {
  getCustomerReport: (params) => api.get('/reports/customers', { params }),
  getItemReport: (params) => api.get('/reports/items', { params }),
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  getAllFitters: () => api.get('/reports/fitters')
};