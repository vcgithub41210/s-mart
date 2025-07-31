import React, { useState } from 'react';
import './PlaceOrderModal.css';

const PlaceOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1
  });

  // Mock product data with prices
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 2999 },
    { id: 2, name: 'USB Cables', price: 299 },
    { id: 3, name: 'Phone Cases', price: 599 },
    { id: 4, name: 'Laptop Chargers', price: 1499 },
    { id: 5, name: 'Bluetooth Speakers', price: 3999 },
    { id: 6, name: 'Power Banks', price: 1299 },
    { id: 7, name: 'Screen Protectors', price: 199 },
    { id: 8, name: 'Wireless Mouse', price: 899 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSelectedProduct = () => {
    return products.find(product => product.name === formData.product);
  };

  const calculateTotal = () => {
    const selectedProduct = getSelectedProduct();
    if (selectedProduct && formData.quantity > 0) {
      return selectedProduct.price * formData.quantity;
    }
    return 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.product || formData.quantity <= 0) {
      alert('Please select a product and enter a valid quantity');
      return;
    }

    const selectedProduct = getSelectedProduct();
    const orderData = {
      product: selectedProduct,
      quantity: parseInt(formData.quantity),
      totalPrice: calculateTotal(),
      orderDate: new Date().toISOString()
    };

    onSubmit(orderData);
    
    // Reset form
    setFormData({
      product: '',
      quantity: 1
    });
  };

  const handleClose = () => {
    setFormData({
      product: '',
      quantity: 1
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Place New Order</h2>
          <button 
            className="close-button"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="product">Select Product *</label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Choose a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.name}>
                  {product.name} - {formatCurrency(product.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              max="100"
              required
              className="form-input"
            />
          </div>

          {formData.product && formData.quantity > 0 && (
            <div className="price-display">
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Unit Price:</span>
                  <span>{formatCurrency(getSelectedProduct()?.price || 0)}</span>
                </div>
                <div className="price-row">
                  <span>Quantity:</span>
                  <span>{formData.quantity}</span>
                </div>
                <div className="price-row total">
                  <span>Total Price:</span>
                  <span className="total-amount">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="place-order-button"
              disabled={!formData.product || formData.quantity <= 0}
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderModal;
