import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      console.log('getAllProducts response:', response.data);
      // Handle your backend response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product stock (ENHANCED FOR STOCK UPDATES)
  updateStock: async (productId, stockData) => {
    try {
      console.log('Updating stock:', { productId, stockData });
      const response = await api.patch(`/products/${productId}/stock`, stockData);
      console.log('Stock update response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;
