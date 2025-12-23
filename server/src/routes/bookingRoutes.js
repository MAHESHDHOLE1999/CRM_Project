import express from 'express';
import { 
  createBooking, 
  getBookings, 
  getBookingById,
  updateBooking, 
  deleteBooking,
  confirmBooking,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.post('/:id/confirm', confirmBooking);
router.post('/:id/cancel', cancelBooking);

export default router;