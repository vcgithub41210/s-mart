import React, { useState, useEffect } from 'react';
import './Home.css';
import AddProductModal from './AddProductModal';
import PlaceOrderModal from './PlaceOrderModal';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [revenueType, setRevenueType] = useState('monthly');

  const mockLowStockItems = [
    { id: 1, name: 'Wireless Headphones', currentStock: 3, minStock: 10 },
    { id: 2, name: 'USB Cables', currentStock: 5, minStock: 15 },
    { id: 3, name: 'Phone Cases', currentStock: 2, minStock: 8 },
    { id: 4, name: 'Laptop Chargers', currentStock: 1, minStock: 12 },
    { id: 5, name: 'Bluetooth Speakers', currentStock: 4, minStock: 20 },
    { id: 6, name: 'Power Banks', currentStock: 3, minStock: 15 },
    { id: 7, name: 'Screen Protectors', currentStock: 7, minStock: 25 },
    { id: 8, name: 'Wireless Mouse', currentStock: 2, minStock: 10 }
  ];

  const revenueData = {
    daily: 2850,
    weekly: 18750,
    monthly: 75230
  };

  useEffect(() => {
    const checkLowStock = () => {
      const lowStockData = mockLowStockItems.filter(item => item.currentStock <= item.minStock);
      if (lowStockData.length > 0) {
        setLowStockItems(lowStockData);
      }
    };

    checkLowStock();
    const interval = setInterval(checkLowStock, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddProduct = (productData) => {
    console.log('Product added:', productData);
    setShowModal(false);
    alert('Product added successfully!');
  };

  const handlePlaceOrder = (orderData) => {
    console.log('Order placed:', orderData);
    setShowOrderModal(false);
    alert(`Order placed successfully!\nProduct: ${orderData.product.name}\nQuantity: ${orderData.quantity}\nTotal: ₹${orderData.totalPrice.toLocaleString('en-IN')}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to S-Mart</h1>
        <p className="hero-subtitle">Your Complete Inventory Management Solution</p>
        
        {/* Main Content Section */}
        <div className="main-content">
          {/* Low Stock Alert Section */}
          <div className="low-stock-section">
            <div className="section-header">
              <h2>Low Stock Alert</h2>
              <span className="alert-badge">{lowStockItems.length}</span>
            </div>
            <div className="low-stock-container">
              {lowStockItems.length > 0 ? (
                <div className="low-stock-scrollable">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="stock-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="stock-level">
                          Stock: <span className="danger">{item.currentStock}</span> / {item.minStock}
                        </span>
                      </div>
                      <div className="urgency-indicator">
                        {item.currentStock <= 2 ? '🔴' : '🟡'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-alerts">
                  <p>✅ All items are well stocked!</p>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Section */}
          <div className="revenue-section">
            <div className="section-header">
              <h2>Revenue</h2>
              <select 
                value={revenueType} 
                onChange={(e) => setRevenueType(e.target.value)}
                className="revenue-dropdown"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="revenue-display">
              <div className="revenue-amount">
                {formatCurrency(revenueData[revenueType])}
              </div>
              <div className="revenue-label">
                {revenueType.charAt(0).toUpperCase() + revenueType.slice(1)} Revenue
              </div>
              <div className="revenue-trend">
                <span className="trend-up">↗️ +12.5%</span>
                <span className="trend-text">vs last {revenueType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="action-buttons-section">
          <button
            className="action-btn add-product-btn"
            onClick={() => setShowModal(true)}
          >
            <span className="btn-icon">+</span>
            Add New Product
          </button>
          
          <button
            className="action-btn place-order-btn"
            onClick={() => setShowOrderModal(true)}
          >
            <span className="btn-icon">🛒</span>
            Place Order
          </button>
        </div>
      </div>

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddProduct}
      />

      <PlaceOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handlePlaceOrder}
      />
    </div>
  );
};

export default Home;
