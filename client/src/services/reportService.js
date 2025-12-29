// import api from './api';

// export const reportService = {
//   // ✅ FIXED: Customer Reports
//   getCustomerReport: (params) =>
//     api.get('/reports/customers', { params }),  // Changed from /customers/fitter-report
  
//   // ✅ FIXED: Item Reports
//   getItemReport: (params) =>
//     api.get('/reports/items', { params }),      // Changed from /items/report
  
//   // ✅ FIXED: Financial Reports
//   getFinancialReport: (params) =>
//     api.get('/reports/financial', { params }),  // Changed from /customers/financial-stats
  
//   // ✅ FIXED: Fitter Reports - Returns array directly
//   getAllFitters: () =>
//     api.get('/reports/fitters'),
  
//   // Export Reports
//   exportCustomerReportCSV: (params) =>
//     api.get('/reports/customers/export/csv', { params, responseType: 'blob' }),
  
//   exportCustomerReportPDF: (params) =>
//     api.get('/reports/customers/export/pdf', { params, responseType: 'blob' }),
  
//   exportFinancialReportPDF: (params) =>
//     api.get('/reports/financial/export/pdf', { params, responseType: 'blob' })
// };

import api from './api';

export const reportService = {
  // ✅ Customer Reports
  getCustomerReport: (params) =>
    api.get('/reports/customers', { params }),
  
  // ✅ Item/Inventory Reports
  getItemReport: (params) =>
    api.get('/reports/items', { params }),
  
  // ✅ Financial Reports
  getFinancialReport: (params) =>
    api.get('/reports/financial', { params }),
  
  // ✅ Get all fitters (returns simple array)
  getAllFitters: () =>
    api.get('/reports/fitters'),
  
  // Export functionality (optional)
  exportCustomerReportCSV: (params) =>
    api.get('/reports/customers/export/csv', { params, responseType: 'blob' }),
  
  exportCustomerReportPDF: (params) =>
    api.get('/reports/customers/export/pdf', { params, responseType: 'blob' }),
  
  exportFinancialReportPDF: (params) =>
    api.get('/reports/financial/export/pdf', { params, responseType: 'blob' })
};