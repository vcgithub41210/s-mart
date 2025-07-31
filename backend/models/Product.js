import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  stockAvailable: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  pricePerQty: {
    type: Number,
    required: true,
    min: 0
  },
  skuCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ productId: 1 });
productSchema.index({ skuCode: 1 });
productSchema.index({ category: 1 });

// Virtual for checking if product is in stock
productSchema.virtual('isInStock').get(function() {
  return this.stockAvailable > 0;
});

// Method to reduce stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.stockAvailable >= quantity) {
    this.stockAvailable -= quantity;
    return this.save();
  } else {
    throw new Error('Insufficient stock available');
  }
};

// Method to add stock
productSchema.methods.addStock = function(quantity) {
  this.stockAvailable += quantity;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
