import React from 'react';
import './CancelModal.css';

const CancelModal = ({ isOpen, onCancel, onConfirm, orderData }) => {
  if (!isOpen) return null;

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal">
        <div className="cancel-modal-header">
          <div className="cancel-modal-icon">
            ⚠️
          </div>
          <h2 className="cancel-modal-title">Cancel Order</h2>
        </div>

        <div className="cancel-modal-content">
          <div className="cancel-warning">
            <p className="cancel-main-message">
              Are you sure you want to cancel this order?
            </p>
            <p className="cancel-sub-message">
              This action cannot be undone. The stock will be restored automatically.
            </p>
          </div>

          {orderData && (
            <div className="cancel-order-details">
              <h4>Order Details:</h4>
              <div className="cancel-detail-item">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{orderData.orderId}</span>
              </div>
              <div className="cancel-detail-item">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">{orderData.customerName}</span>
              </div>
              <div className="cancel-detail-item">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(orderData.totalAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="cancel-consequences">
            <div className="consequence-item">
              <span className="consequence-icon">📦</span>
              <span>Stock will be restored for all items</span>
            </div>
            <div className="consequence-item">
              <span className="consequence-icon">📧</span>
              <span>Customer may need to be notified</span>
            </div>
            
          </div>
        </div>

        <div className="cancel-modal-footer">
          <button 
            className="cancel-modal-btn cancel-modal-cancel"
            onClick={onCancel}
          >
            Keep Order
          </button>
          <button 
            className="cancel-modal-btn cancel-modal-confirm"
            onClick={onConfirm}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
