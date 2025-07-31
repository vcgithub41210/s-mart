import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  items: [orderItemSchema],
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    lowercase: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  customerInfo: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ status: 1 });

// Virtual for getting total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to calculate total amount
orderSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.totalPrice;
  }, 0);
  next();
});

// Method to add item to order
orderSchema.methods.addItem = function(productName, productId, quantity, pricePerUnit) {
  const totalPrice = quantity * pricePerUnit;
  this.items.push({
    productName,
    productId,
    quantity,
    pricePerUnit,
    totalPrice
  });
  return this.save();
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
  const validStatuses = ['pending', 'completed', 'cancelled'];
  if (validStatuses.includes(newStatus.toLowerCase())) {
    this.status = newStatus.toLowerCase();
    return this.save();
  } else {
    throw new Error('Invalid status. Must be pending, completed, or cancelled');
  }
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status: status.toLowerCase() });
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
