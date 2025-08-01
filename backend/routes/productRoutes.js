import express from 'express';
import { verifyToken, requireStaff, requireAdmin } from '../middleware/auth.js';
import {
  createProduct,
  updateStock,
  deleteProduct,
  getAllProducts,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

// Apply authentication middleware to all product routes
router.use(verifyToken);

// Product routes with corrected permissions

// GET routes - Both staff and admin can view products
router.get('/', getAllProducts);                   // GET /api/products
router.get('/:productId', getProductById);         // GET /api/products/:productId

// POST routes - Only admin can add new products (staff cannot)
router.post('/', requireAdmin, createProduct);     // POST /api/products - ADMIN ONLY

// PATCH routes - Both staff and admin can update stock
router.patch('/:productId/stock', requireStaff, updateStock); // PATCH /api/products/:productId/stock

// DELETE routes - Both staff and admin can delete products
router.delete('/:productId', requireStaff, deleteProduct); // DELETE /api/products/:productId - Changed from requireAdmin to requireStaff

export default router;
