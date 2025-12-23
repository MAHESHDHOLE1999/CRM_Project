import express from 'express';
import { 
  getCustomerReport,
  getItemReport,
  getFinancialReport,
  getAllFitters
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/customers', getCustomerReport);
router.get('/items', getItemReport);
router.get('/financial', getFinancialReport);
router.get('/fitters', getAllFitters);

export default router;