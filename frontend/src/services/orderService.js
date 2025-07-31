import api from './api';

const orderService = {
  // Get all orders
  getAllOrders: async (status = null) => {
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await api.get('/orders', { params });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order (NEW METHOD)
  cancelOrder: async (orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;
