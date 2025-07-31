import React, { useState, useEffect } from 'react';
import './EditProductModal.css';


const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [stockQuantity, setStockQuantity] = useState('');

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      setStockQuantity(product.stock || '');
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!stockQuantity || stockQuantity < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }

    onSubmit(parseInt(stockQuantity));
  };

  const handleClose = () => {
    setStockQuantity('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Stock</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="product-info">
          <p><strong>Product:</strong> {product?.name}</p>
          <p><strong>Current Stock:</strong> {product?.stock}</p>
          <p><strong>SKU:</strong> {product?.skuCode}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="stockQuantity">New Stock Quantity *</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              min="0"
              required
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
