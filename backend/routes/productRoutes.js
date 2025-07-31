import express from 'express';
import {
  createProduct,
  updateStock,
  deleteProduct,
  getAllProducts,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

// Product routes
router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.patch('/:productId/stock', updateStock);
router.delete('/:productId', deleteProduct);

export default router;
