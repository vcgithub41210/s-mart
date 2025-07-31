import express from 'express';
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

// Order routes
router.post('/', createOrder);                    // POST /api/orders
router.get('/', getAllOrders);                   // GET /api/orders
router.get('/stats', getOrderStats);             // GET /api/orders/stats
router.get('/:orderId', getOrderById);           // GET /api/orders/:orderId
router.patch('/:orderId/status', updateOrderStatus); // PATCH /api/orders/:orderId/status
router.patch('/:orderId/cancel', cancelOrder);   // PATCH /api/orders/:orderId/cancel
router.delete('/:orderId', deleteOrder);         // DELETE /api/orders/:orderId

export default router;
