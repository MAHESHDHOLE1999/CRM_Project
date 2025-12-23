import express from 'express';
import { 
  createCustomer, 
  getCustomers, 
  updateCustomer, 
  deleteCustomer,
  checkoutCustomer,
  getDashboardStats,
  getAnalytics,
  calculateRentalDuration,
  getEnhancedDashboardStats
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/stats', getDashboardStats);
router.get('/enhanced-stats', getEnhancedDashboardStats); // Make sure this is here
router.get('/analytics', getAnalytics);
router.post('/calculate-duration', calculateRentalDuration);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/:id/checkout', checkoutCustomer);

export default router;