import express from 'express';
import { 
  createItem, 
  getItems, 
  getItemById,
  updateItem, 
  deleteItem,
  getCategories,
  bulkRentItems,
  bulkReturnItems,
  checkAvailability,
  getInventoryStats
} from '../controllers/itemController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// ✅ POST routes (FIRST - before any GET routes)
router.post('/', createItem);
router.post('/bulk-rent', bulkRentItems);
router.post('/bulk-return', bulkReturnItems);
router.post('/check-availability', checkAvailability);

// ✅ GET specific named routes (SECOND - before :id wildcard)
router.get('/stats', getInventoryStats);
router.get('/categories', getCategories);

// ✅ GET generic and ID routes (LAST)
router.get('/', getItems);
router.get('/:id', getItemById);

// ✅ PUT/DELETE routes (LAST)
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;