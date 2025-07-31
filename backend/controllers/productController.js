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

// ENHANCED: Update product stock (handles both MongoDB _id and productId)
export const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stockQuantity, operation, stockAvailable } = req.body;

    console.log('Update stock request:', { productId, body: req.body });

    // Handle direct stock update (for frontend integration)
    if (stockAvailable !== undefined) {
      let product;
      
      // First try to find by MongoDB _id (most common from frontend)
      try {
        product = await Product.findByIdAndUpdate(
          productId,
          { stockAvailable: parseInt(stockAvailable) },
          { new: true, runValidators: true }
        );
      } catch (error) {
        // If _id format is invalid, try finding by productId field
        console.log('Trying to find by productId field...');
        product = await Product.findOneAndUpdate(
          { productId: productId },
          { stockAvailable: parseInt(stockAvailable) },
          { new: true, runValidators: true }
        );
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      console.log('Stock updated successfully:', product);

      return res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: product
      });
    }

    // Handle operation-based stock updates (existing logic)
    let product = await Product.findById(productId);
    
    if (!product) {
      product = await Product.findOne({ productId });
    }

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

// ENHANCED: Delete product (handles both MongoDB _id and productId)
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    let product;
    
    // Try to find by MongoDB _id first
    try {
      product = await Product.findByIdAndDelete(productId);
    } catch (error) {
      // If _id format is invalid, try finding by productId field
      product = await Product.findOneAndDelete({ productId });
    }

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

// ENHANCED: Get product by ID (handles both MongoDB _id and productId)
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    let product;
    
    // Try to find by MongoDB _id first
    try {
      product = await Product.findById(productId);
    } catch (error) {
      // If _id format is invalid, try finding by productId field
      product = await Product.findOne({ productId });
    }

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
