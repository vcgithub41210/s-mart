import Product from '../models/Product.js';

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { productId, productName, stockAvailable, pricePerQty, skuCode, category } = req.body;

    // Check if product already exists
    const existingProduct = await Product.findOne({
      $or: [{ productId }, { skuCode }]
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this ID or SKU already exists'
      });
    }

    const product = new Product({
      productId,
      productName,
      stockAvailable,
      pricePerQty,
      skuCode,
      category
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product stock
export const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stockQuantity, operation } = req.body; // operation: 'add' or 'reduce'

    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (operation === 'add') {
      await product.addStock(stockQuantity);
    } else if (operation === 'reduce') {
      await product.reduceStock(stockQuantity);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add" or "reduce"'
      });
    }

    res.status(200).json({
      success: true,
      message: `Stock ${operation}ed successfully`,
      data: {
        productId: product.productId,
        productName: product.productName,
        currentStock: product.stockAvailable
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating stock'
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOneAndDelete({ productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        deletedProduct: {
          productId: product.productId,
          productName: product.productName
        }
      }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};
