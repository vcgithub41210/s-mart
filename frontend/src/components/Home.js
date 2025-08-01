import React, { useState, useEffect } from 'react';
import './Home.css';
import AddProductModal from './AddProductModal';
import PlaceOrderModal from './PlaceOrderModal';
import productService from '../services/productService';
import orderService from '../services/orderService';

const Home = ({ userRole, isConnected }) => { // Added userRole prop
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [revenueType, setRevenueType] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add state for revenue data
  const [revenueData, setRevenueData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    total: 0
  });
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState(null);

  // Fetch revenue data from database
  const fetchRevenueData = async () => {
    if (!isConnected) {
      setRevenueError('Backend connection required');
      return;
    }

    try {
      setRevenueLoading(true);
      setRevenueError(null);

      // Get order statistics (total revenue from completed orders)
      const stats = await orderService.getOrderStats();
      
      // Get all completed orders to calculate daily/weekly revenue
      const orders = await orderService.getAllOrders('completed');
      
      console.log('Revenue stats:', stats);
      console.log('Completed orders:', orders);

      // Calculate revenue by time periods
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      let dailyRevenue = 0;
      let weeklyRevenue = 0;
      let monthlyRevenue = 0;

      // Calculate revenue from orders
      if (Array.isArray(orders)) {
        orders.forEach(order => {
          const orderDate = new Date(order.orderDate || order.createdAt);
          const orderAmount = order.totalAmount || 0;

          // Daily revenue (today)
          if (orderDate >= today) {
            dailyRevenue += orderAmount;
          }

          // Weekly revenue (last 7 days)
          if (orderDate >= weekAgo) {
            weeklyRevenue += orderAmount;
          }

          // Monthly revenue (last 30 days)
          if (orderDate >= monthAgo) {
            monthlyRevenue += orderAmount;
          }
        });
      }

      setRevenueData({
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        total: stats.totalRevenue || 0
      });

    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setRevenueError('Failed to load revenue data: ' + err.message);
      
      // Fallback to default values on error
      setRevenueData({
        daily: 0,
        weekly: 0,
        monthly: 0,
        total: 0
      });
    } finally {
      setRevenueLoading(false);
    }
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
    fetchRevenueData(); // Add revenue data fetch
    
    // Set up interval to check every 5 minutes
    const interval = setInterval(() => {
      fetchLowStockItems();
      fetchRevenueData(); // Refresh revenue data too
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleAddProduct = async (productData) => {
    try {
      // Check if user is admin before allowing product creation
      if (userRole !== 'admin') {
        alert('Only administrators can add new products.');
        return;
      }

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

  const handlePlaceOrder = async (orderData) => {
    try {
      console.log('Placing order with data:', orderData);
      
      // Validate orderData structure
      if (!orderData) {
        throw new Error('Order data is missing');
      }
      
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('No items selected for the order');
      }
      
      if (!orderData.customerInfo) {
        throw new Error('Customer information is missing');
      }
      
      const { customerInfo, items } = orderData;
      
      // Validate customer info
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        throw new Error('Customer information is incomplete');
      }
      
      // Call the order service to create the order
      const createdOrder = await orderService.createOrder(orderData);
      
      setShowOrderModal(false);
      
      // Calculate total amount safely
      const totalAmount = items.reduce((total, item) => 
        total + ((item.pricePerUnit || 0) * (item.quantity || 0)), 0
      );
      
      // Show success message with order details
      alert(`🎉 Order placed successfully!

Order ID: ${createdOrder.orderId || 'Generated'}
Customer: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
Items: ${items.length}
Total Amount: ₹${totalAmount.toFixed(2)}

Stock has been automatically updated.`);
      
      // Refresh both low stock and revenue data since both have changed
      fetchLowStockItems();
      fetchRevenueData(); // Refresh revenue after placing order
      
    } catch (err) {
      console.error('Error placing order:', err);
      
      // Show specific error message
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`❌ Failed to place order: ${errorMessage}`);
      
      // Don't close modal on error so user can try again
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Calculate revenue growth percentage (mock calculation for now)
  const calculateGrowthPercentage = () => {
    // You can implement actual growth calculation based on historical data
    // For now, using a simple calculation based on current vs previous period
    const currentRevenue = revenueData[revenueType];
    const mockPreviousRevenue = currentRevenue * 0.9; // Mock 10% less for previous period
    
    if (mockPreviousRevenue === 0) return '+0%';
    
    const growth = ((currentRevenue - mockPreviousRevenue) / mockPreviousRevenue) * 100;
    const sign = growth >= 0 ? '+' : '';
    
    return `${sign}${growth.toFixed(1)}%`;
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

          {/* Revenue Section - Updated with Real Data */}
          <div className="revenue-section">
            <div className="section-header">
              <h2>Revenue</h2>
              <div className="revenue-controls">
                <select 
                  value={revenueType} 
                  onChange={(e) => setRevenueType(e.target.value)}
                  className="revenue-dropdown"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="total">All Time</option>
                </select>
              </div>
            </div>
            
            <div className="revenue-display">
              {!isConnected ? (
                <div className="revenue-error">
                  <p>❌ Backend connection required</p>
                </div>
              ) : revenueLoading ? (
                <div className="revenue-loading">
                  <p>⏳ Loading revenue data...</p>
                </div>
              ) : revenueError ? (
                <div className="revenue-error">
                  <p>⚠️ {revenueError}</p>
                  <button className="retry-btn" onClick={fetchRevenueData}>
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="revenue-amount">
                    {formatCurrency(revenueData[revenueType])}
                  </div>
                  <div className="revenue-label">
                    {revenueType === 'total' ? 'Total' : revenueType.charAt(0).toUpperCase() + revenueType.slice(1)} Revenue
                  </div>
                  <div className="revenue-trend">
                    <span className="trend-up">↗️ {calculateGrowthPercentage()}</span>
                    <span className="trend-text">vs last {revenueType}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Section - CONDITIONALLY RENDERED */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          display: 'flex',
          gap: userRole === 'admin' ? '2.5rem' : '0', // Adjust gap based on buttons shown
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 1rem'
        }}>
          {/* CONDITIONALLY SHOW ADD PRODUCT BUTTON ONLY FOR ADMIN */}
          {userRole === 'admin' && (
            <button
              style={{
                border: 'none',
                padding: '1.3rem 4rem',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '350px',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
              }}
              onClick={() => setShowModal(true)}
            >
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>+</span>
              Add New Product
            </button>
          )}
          
          {/* PLACE ORDER BUTTON - ALWAYS VISIBLE FOR BOTH ROLES */}
          <button
            style={{
              border: 'none',
              padding: '1.3rem 4rem',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '350px',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
              e.target.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }}
            onClick={() => setShowOrderModal(true)}
          >
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🛒</span>
            Place Order
          </button>
        </div>
      </div>

      {/* CONDITIONALLY RENDER ADD PRODUCT MODAL ONLY FOR ADMIN */}
      {userRole === 'admin' && (
        <AddProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      <PlaceOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handlePlaceOrder}
      />
    </div>
  );
};

export default Home;
