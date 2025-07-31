import React, { useState } from 'react';
import './Home.css';
import AddProductModal from './AddProductModal';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = (productData) => {
    // Here you would typically send the data to your backend API
    console.log('Product added:', productData);
    
    // Close modal
    setShowModal(false);
    
    // You can add success notification here
    alert('Product added successfully!');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to S-Mart</h1>
        <p className="hero-subtitle">Your Complete Inventory Management Solution</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Items</h3>
            <p className="stat-number">1,247</p>
          </div>
          <div className="stat-card">
            <h3>Low Stock Alerts</h3>
            <p className="stat-number warning">23</p>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <p className="stat-number">15</p>
          </div>
          <div className="stat-card">
            <h3>Monthly Revenue</h3>
            <p className="stat-number success">$45,230</p>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => setShowModal(true)}
          >
            Add New Item
          </button>
          <button className="action-btn secondary">Generate Report</button>
          <button className="action-btn secondary">Check Stock Levels</button>
        </div>
      </div>

      <AddProductModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default Home;
