import React, { useState, useEffect } from 'react';
import './Home.css';
import AddProductModal from './AddProductModal';
import PlaceOrderModal from './PlaceOrderModal';
import productService from '../services/productService';

const Home = ({ isConnected }) => {
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [revenueType, setRevenueType] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const revenueData = {
    daily: 2850,
    weekly: 18750,
    monthly: 75230
  };

  // Fetch low stock items from database
  const fetchLowStockItems = async () => {
    if (!isConnected) {
      setError('Backend connection required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get all products from database
      const data = await productService.getAllProducts();
      
      // Handle different response structures
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data && Array.isArray(data.data)) {
        products = data.data;
      } else {
        console.error('Unexpected data structure:', data);
        setError('Invalid data format received from server');
        return;
      }

      // Transform and filter for low stock items
      const transformedProducts = products.map(product => ({
        id: product._id || product.productId,
        name: product.productName || 'Unknown Product',
        currentStock: product.stockAvailable || 0,
        minStock: product.lowStockThreshold || 10,
        skuCode: product.skuCode,
        category: product.category
      }));

      // Filter products where current stock is at or below minimum threshold
      const lowStockData = transformedProducts.filter(item => 
        item.currentStock <= item.minStock
      );

      // Sort by stock level (lowest stock first)
      lowStockData.sort((a, b) => a.currentStock - b.currentStock);

      setLowStockItems(lowStockData);
      console.log('Low stock items found:', lowStockData);

    } catch (err) {
      console.error('Error fetching low stock items:', err);
      setError('Failed to load low stock data: ' + err.message);
      setLowStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchLowStockItems();
    
    // Set up interval to check every 5 minutes
    const interval = setInterval(fetchLowStockItems, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleAddProduct = async (productData) => {
    try {
      // Transform frontend data to match your MongoDB schema
      const newProductData = {
        productId: productData.skuCode || `PROD-${Date.now()}`,
        productName: productData.productName,
        category: productData.category,
        stockAvailable: parseInt(productData.availableQuantity),
        pricePerQty: parseFloat(productData.price) || 0,
        skuCode: productData.skuCode,
        lowStockThreshold: parseInt(productData.lowStockThreshold) || 10
      };

      await productService.createProduct(newProductData);
      setShowModal(false);
      alert(`Product "${productData.productName}" added successfully!`);
      
      // Refresh low stock data after adding new product
      fetchLowStockItems();
    } catch (err) {
      alert('Failed to add product: ' + err.message);
      console.error('Error adding product:', err);
    }
  };

  const handlePlaceOrder = (orderData) => {
    console.log('Order placed:', orderData);
    setShowOrderModal(false);
    alert(`Order placed successfully!\nProduct: ${orderData.product.name}\nQuantity: ${orderData.quantity}\nTotal: ₹${orderData.totalPrice.toLocaleString('en-IN')}`);
    
    // Refresh low stock data after placing order (in case stock changed)
    fetchLowStockItems();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get urgency class based on stock level
  const getUrgencyClass = (currentStock, minStock) => {
    if (currentStock <= 5) return 'critical-stock'; // RED - Really low (0-5 items)
    if (currentStock <= 15) return 'warning-stock'; // ORANGE - Shortage (6-15 items)  
    if (currentStock <= 25) return 'low-stock'; // YELLOW - Little shortage (16-25 items)
    return 'normal-stock'; // Default (shouldn't appear in low stock section)
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
              {!isConnected ? (
                <div className="connection-error">
                  <p>❌ Backend connection required to check stock levels</p>
                </div>
              ) : loading ? (
                <div className="loading-state">
                  <p>⏳ Loading stock data...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>⚠️ {error}</p>
                  <button className="retry-btn" onClick={fetchLowStockItems}>
                    Retry
                  </button>
                </div>
              ) : lowStockItems.length > 0 ? (
                <div className="low-stock-scrollable">
                  {lowStockItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`stock-item ${getUrgencyClass(item.currentStock, item.minStock)}`}
                    >
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-sku">SKU: {item.skuCode}</span>
                        {item.currentStock === 0 && (
                          <span className="out-of-stock">OUT OF STOCK</span>
                        )}
                      </div>
                      <div className="stock-count">
                        {item.currentStock}
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
