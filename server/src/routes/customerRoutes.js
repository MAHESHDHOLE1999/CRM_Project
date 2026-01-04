import express from 'express';
import { 
  createCustomer, 
  getCustomers, 
  getCustomerById,
  updateCustomer, 
  deleteCustomer,
  checkoutCustomer,
  getDashboardStats,
  getAnalytics,
  calculateRentalDuration,
  getEnhancedDashboardStats,
  getFinancialStats,
  getFitterReport
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
// import { generateBill } from '../controllers/billController.js';
import { generateBookingBill } from '../controllers/billController.js';

const router = express.Router();

router.use(authenticate);

// ========================================
// POST ROUTES (must be before GET routes)
// ========================================
router.post('/', createCustomer);
router.post('/calculate-duration', calculateRentalDuration);
router.post('/:id/checkout', checkoutCustomer);

// ========================================
// GET SPECIFIC ROUTES (before /:id)
// ========================================
router.get('/stats', getDashboardStats);
router.get('/enhanced-stats', getEnhancedDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/financial-stats', getFinancialStats);
router.get('/fitter-report', getFitterReport);
// router.get('/:id/bill', generateBill);
router.get('/:id/bill', generateBookingBill);
router.get('/:id', getCustomerById);

// ========================================
// GET GENERIC ROUTES (LAST!)
// ========================================
router.get('/', getCustomers);

// ========================================
// PUT/DELETE ROUTES
// ========================================
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;