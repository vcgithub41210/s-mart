import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    // Validate stock availability for all items
    for (const item of items) {
      const product = await Product.findOne({ productId: item.productId });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (product.stockAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.productName}. Available: ${product.stockAvailable}, Requested: ${item.quantity}`
        });
      }
    }

    // Create order with unique ID
    const orderId = uuidv4();
    const orderItems = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.pricePerUnit
    }));

    const order = new Order({
      orderId,
      items: orderItems,
      customerInfo
    });

    await order.save();

    // Reduce stock for all items
    for (const item of items) {
      const product = await Product.findOne({ productId: item.productId });
      await product.reduceStock(item.quantity);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status'
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let orders;
    if (status && status !== 'all') {
      orders = await Order.findByStatus(status);
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed order'
      });
    }

    // Restore stock if order is being cancelled
    if (order.status === 'pending') {
      for (const item of order.items) {
        const product = await Product.findOne({ productId: item.productId });
        if (product) {
          await product.addStock(item.quantity);
        }
      }
    }

    await order.updateStatus('cancelled');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order stats',
      error: error.message
    });
  }
};

// Delete order (optional - for admin purposes)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOneAndDelete({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: {
        deletedOrder: {
          orderId: order.orderId,
          customerName: order.customerInfo?.name
        }
      }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};
