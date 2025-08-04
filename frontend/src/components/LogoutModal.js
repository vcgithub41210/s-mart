import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onCancel, onConfirm, userData }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <div className="logout-modal-header">
          <div className="logout-modal-icon">
            🔐
          </div>
          <h2 className="logout-modal-title">Confirm Logout</h2>
        </div>

        <div className="logout-modal-content">
          <div className="logout-warning">
            <p className="logout-main-message">
              Are you sure you want to logout?
            </p>
            <p className="logout-sub-message">
              You will need to login again to access the system.
            </p>
          </div>

          

          
        </div>

        <div className="logout-modal-footer">
          <button 
            className="logout-modal-btn logout-modal-cancel"
            onClick={onCancel}
          >
            Stay Logged In
          </button>
          <button 
            className="logout-modal-btn logout-modal-confirm"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
