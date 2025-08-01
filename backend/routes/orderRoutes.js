import express from 'express';
import { verifyToken, requireStaff } from '../middleware/auth.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(verifyToken);

// Order routes - All accessible to both staff and admin

// GET routes - Both staff and admin can view orders and stats
router.get('/', getAllOrders);                     // GET /api/orders
router.get('/stats', getOrderStats);               // GET /api/orders/stats  
router.get('/:orderId', getOrderById);             // GET /api/orders/:orderId

// POST routes - Both staff and admin can create orders
router.post('/', requireStaff, createOrder);       // POST /api/orders

// PATCH routes - Both staff and admin can update order status and cancel orders
router.patch('/:orderId/status', requireStaff, updateOrderStatus); // PATCH /api/orders/:orderId/status
router.patch('/:orderId/cancel', requireStaff, cancelOrder);       // PATCH /api/orders/:orderId/cancel

// DELETE routes - Both staff and admin can delete orders
router.delete('/:orderId', requireStaff, deleteOrder); // DELETE /api/orders/:orderId - Changed from requireAdmin to requireStaff

export default router;
