import React, { useState, useEffect } from 'react';
import './Home.css';
import AddProductModal from './AddProductModal';


const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);


  // Mock data for demonstration - replace with actual API call
  const mockLowStockItems = [
    { id: 1, name: 'Wireless Headphones', currentStock: 3, minStock: 10 },
    { id: 2, name: 'USB Cables', currentStock: 5, minStock: 15 },
    { id: 3, name: 'Phone Cases', currentStock: 2, minStock: 8 }
  ];


  // Check for low stock items on component mount
  useEffect(() => {
    // Simulate API call to check low stock items
    const checkLowStock = () => {
      // In a real app, this would be an API call
      const lowStockData = mockLowStockItems.filter(item => item.currentStock <= item.minStock);
     
      if (lowStockData.length > 0) {
        setLowStockItems(lowStockData);
        setShowNotification(true);
      }
    };


    // Check immediately on mount
    checkLowStock();


    // Set up periodic checking (every 5 minutes)
    const interval = setInterval(checkLowStock, 5 * 60 * 1000);


    return () => clearInterval(interval);
  }, []);


  const handleAddProduct = (productData) => {
    // Here you would typically send the data to your backend API
    console.log('Product added:', productData);
   
    // Close modal
    setShowModal(false);
   
    // You can add success notification here
    alert('Product added successfully!');
  };


  const dismissNotification = () => {
    setShowNotification(false);
  };


  const viewLowStockDetails = () => {
    // Navigate to inventory page or show detailed view
    console.log('Viewing low stock details:', lowStockItems);
    alert(`Low stock items:\n${lowStockItems.map(item => `${item.name}: ${item.currentStock} left`).join('\n')}`);
  };


  return (
    <div className="home-container">
      {/* Low Stock Notification */}
      {showNotification && (
        <div className="notification-overlay">
          <div className="notification-popup">
            <div className="notification-header">
              <h3>⚠️ Low Stock Alert</h3>
              <button
                className="close-btn"
                onClick={dismissNotification}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
            <div className="notification-content">
              <p>
                <strong>{lowStockItems.length}</strong> item{lowStockItems.length > 1 ? 's' : ''}
                {lowStockItems.length > 1 ? ' are' : ' is'} running low on stock!
              </p>
              <div className="low-stock-list">
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} className="low-stock-item">
                    <span className="item-name">{item.name}</span>
                    <span className="stock-count">{item.currentStock} remaining</span>
                  </div>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="more-items">...and {lowStockItems.length - 3} more items</p>
                )}
              </div>
            </div>
            <div className="notification-actions">
              <button
                className="btn-primary"
                onClick={viewLowStockDetails}
              >
                View Details
              </button>
              <button
                className="btn-secondary"
                onClick={dismissNotification}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}


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
            <p className="stat-number warning">
              {lowStockItems.length}
              {lowStockItems.length > 0 && <span className="pulse-dot"></span>}
            </p>
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
          {lowStockItems.length > 0 && (
            <button
              className="action-btn warning"
              onClick={() => setShowNotification(true)}
            >
              View Low Stock ({lowStockItems.length})
            </button>
          )}
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

