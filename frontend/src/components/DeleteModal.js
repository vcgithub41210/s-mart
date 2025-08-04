import React from 'react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onCancel, onConfirm, productData }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <div className="delete-modal-icon">
            🗑️
          </div>
          <h2 className="delete-modal-title">Delete Product</h2>
        </div>

        <div className="delete-modal-content">
          <div className="delete-warning">
            <p className="delete-main-message">
              Are you sure you want to delete this product?
            </p>
            <p className="delete-sub-message">
              This action cannot be undone. All product data will be permanently removed.
            </p>
          </div>

          {productData && (
            <div className="delete-product-details">
              <h4>Product Details:</h4>
              <div className="delete-detail-item">
                <span className="detail-label">Product ID:</span>
                <span className="detail-value">{productData.productId || productData.id}</span>
              </div>
              <div className="delete-detail-item">
                <span className="detail-label">Product Name:</span>
                <span className="detail-value">{productData.name}</span>
              </div>
              <div className="delete-detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{productData.category}</span>
              </div>
              <div className="delete-detail-item">
                <span className="detail-label">Current Stock:</span>
                <span className="detail-value">{productData.stock} units</span>
              </div>
              <div className="delete-detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">₹{productData.price?.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="delete-consequences">
            <div className="consequence-item">
              <span className="consequence-icon">⚠️</span>
              <span>Product will be removed from inventory</span>
            </div>
            <div className="consequence-item">
              <span className="consequence-icon">📊</span>
              <span>Historical data will be lost</span>
            </div>
            <div className="consequence-item">
              <span className="consequence-icon">🛍️</span>
              <span>Product cannot be ordered by customers</span>
            </div>
          </div>
        </div>

        <div className="delete-modal-footer">
          <button 
            className="delete-modal-btn delete-modal-cancel"
            onClick={onCancel}
          >
            Keep Product
          </button>
          <button 
            className="delete-modal-btn delete-modal-confirm"
            onClick={onConfirm}
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
