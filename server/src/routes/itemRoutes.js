import express from 'express';
import { 
  createItem, 
  getItems, 
  getItemById,
  updateItem, 
  deleteItem,
  getCategories,
  rentItem,
  returnItem,
  getInventoryStats
} from '../controllers/itemController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createItem);
router.get('/', getItems);
router.get('/stats', getInventoryStats);
router.get('/categories', getCategories);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:id/rent', rentItem);
router.post('/:id/return', returnItem);

export default router;