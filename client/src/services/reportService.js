import api from './api';

export const reportService = {
  // Customer Reports - Using customers endpoint
  getCustomerReport: (params) =>
    api.get('/customers/fitter-report', { params }),
  
  // Item Reports (if you have item reports)
  getItemReport: (params) =>
    api.get('/items/report', { params }),
  
  // Financial Reports
  getFinancialReport: (params) =>
    api.get('/customers/financial-stats', { params }),
  
  // Fitter Reports
  getAllFitters: () =>
    api.get('/customers/fitter-report'),
  
  // Export Reports (if you have export endpoints)
  exportCustomerReportCSV: (params) =>
    api.get('/customers/export/csv', { params, responseType: 'blob' }),
  
  exportCustomerReportPDF: (params) =>
    api.get('/customers/export/pdf', { params, responseType: 'blob' }),
  
  exportFinancialReportPDF: (params) =>
    api.get('/customers/financial-export/pdf', { params, responseType: 'blob' })
};