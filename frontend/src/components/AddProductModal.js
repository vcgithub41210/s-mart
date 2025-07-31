import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    availableQuantity: '',
    category: '',
    skuCode: '',
    lowStockThreshold: ''
  });

  const categories = [
    'Electronics',
    'Furniture',
    'Appliances',
    'Clothing',
    'Books',
    'Sports',
    'Home & Garden',
    'Automotive',
    'Health & Beauty',
    'Food & Beverages'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form
    setFormData({
      productName: '',
      availableQuantity: '',
      category: '',
      skuCode: '',
      lowStockThreshold: ''
    });
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      productName: '',
      availableQuantity: '',
      category: '',
      skuCode: '',
      lowStockThreshold: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
              placeholder="Enter product name:"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="availableQuantity">Available Quantity *</label>
              <input
                type="number"
                id="availableQuantity"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lowStockThreshold">Low Stock Threshold *</label>
              <input
                type="number"
                id="lowStockThreshold"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="10"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skuCode">SKU Code *</label>
            <input
              type="text"
              id="skuCode"
              name="skuCode"
              value={formData.skuCode}
              onChange={handleInputChange}
              required
              placeholder="e.g., SKU-001-ABC"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
