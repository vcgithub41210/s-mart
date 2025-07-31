import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/status', updateOrderStatus);
router.patch('/:orderId/cancel', cancelOrder);

export default router;
