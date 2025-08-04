import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';
import orderService from '../services/orderService';
import productService from '../services/productService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ isConnected }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [stockData, setStockData] = useState({
    topProducts: [],
    topCategories: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedStockView, setSelectedStockView] = useState('products');

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!isConnected) {
      setError('Backend connection required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch orders and products data
      const [orders, products] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);

      console.log('Dashboard data loaded:', { orders: orders.length, products: products.length });

      // Process revenue data
      processRevenueData(orders);
      
      // Process stock data
      processStockData(orders, products);
      
      // Process recent orders
      processRecentOrders(orders);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process revenue data for charts
  const processRevenueData = (orders) => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    // Group orders by time periods
    const daily = groupOrdersByDays(completedOrders, 7);
    const weekly = groupOrdersByWeeks(completedOrders, 4);
    const monthly = groupOrdersByMonths(completedOrders, 12);

    setRevenueData({ daily, weekly, monthly });
  };

  // Group orders by days
  const groupOrdersByDays = (orders, days) => {
    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      const revenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      result.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: revenue,
        count: dayOrders.length
      });
    }

    return result;
  };

  // Group orders by weeks
  const groupOrdersByWeeks = (orders, weeks) => {
    const result = [];
    const now = new Date();

    for (let i = weeks - 1; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - (i + 1) * 7);
      const endDate = new Date(now);
      endDate.setDate(now.getDate() - i * 7);

      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt);
        return orderDate >= startDate && orderDate < endDate;
      });

      const revenue = weekOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      result.push({
        label: `Week ${weeks - i}`,
        value: revenue,
        count: weekOrders.length
      });
    }

    return result;
  };

  // Group orders by months
  const groupOrdersByMonths = (orders, months) => {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate || order.createdAt);
        return orderDate >= date && orderDate < nextMonth;
      });

      const revenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      result.push({
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: revenue,
        count: monthOrders.length
      });
    }

    return result;
  };

  // Process stock data for charts
  const processStockData = (orders, products) => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    // Calculate most sold products
    const productSales = {};
    const categorySales = {};

    completedOrders.forEach(order => {
      order.items.forEach(item => {
        // Product sales
        if (!productSales[item.productName]) {
          productSales[item.productName] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productName].quantity += item.quantity;
        productSales[item.productName].revenue += item.totalPrice || (item.quantity * item.pricePerUnit);

        // Find product category
        const product = products.find(p => p.productId === item.productId || p.productName === item.productName);
        const category = product?.category || 'Other';

        if (!categorySales[category]) {
          categorySales[category] = {
            name: category,
            quantity: 0,
            revenue: 0
          };
        }
        categorySales[category].quantity += item.quantity;
        categorySales[category].revenue += item.totalPrice || (item.quantity * item.pricePerUnit);
      });
    });

    // Sort and get top items
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const topCategories = Object.values(categorySales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    setStockData({ topProducts, topCategories });
  };

  // Process recent orders
  const processRecentOrders = (orders) => {
    const recent = orders
      .sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
      .slice(0, 6)
      .map(order => ({
        id: order.orderId,
        customerName: order.customerInfo?.name || 'Unknown Customer',
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt || order.orderDate,
        itemCount: order.items.length
      }));

    setRecentOrders(recent);
  };

  useEffect(() => {
    loadDashboardData();
  }, [isConnected]);

  // Chart configurations
  const revenueChartData = {
    labels: revenueData[selectedPeriod]?.map(item => item.label) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData[selectedPeriod]?.map(item => item.value) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: selectedPeriod === 'daily',
      },
    ],
  };

  const stockChartData = {
    labels: stockData[selectedStockView === 'products' ? 'topProducts' : 'topCategories']?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Quantity Sold',
        data: stockData[selectedStockView === 'products' ? 'topProducts' : 'topCategories']?.map(item => item.quantity) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(168, 85, 247, 0.6)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-error">
          <p>❌ Backend connection required to load dashboard data</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-error">
          <p>⚠️ {error}</p>
          <button className="retry-btn" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        
      </div>
      
      <div className="dashboard-grid">
        {/* Sales Overview Chart */}
        <div className="dashboard-card sales-card">
          <div className="card-header">
            <h3>📈 Sales Overview</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-selector"
            >
              <option value="daily">Daily (7 days)</option>
              <option value="weekly">Weekly (4 weeks)</option>
              <option value="monthly">Monthly (12 months)</option>
            </select>
          </div>
          <div className="chart-container">
            {selectedPeriod === 'daily' ? (
              <Line data={revenueChartData} options={chartOptions} />
            ) : (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
          </div>
          <div className="chart-summary">
            <div className="summary-item">
              <span className="summary-label">Total Revenue:</span>
              <span className="summary-value">
                {formatCurrency(revenueData[selectedPeriod]?.reduce((sum, item) => sum + item.value, 0) || 0)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Orders:</span>
              <span className="summary-value">
                {revenueData[selectedPeriod]?.reduce((sum, item) => sum + item.count, 0) || 0}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stock Levels Chart */}
        <div className="dashboard-card stock-card">
          <div className="card-header">
            <h3>📊 Top Selling Items</h3>
            <select
              value={selectedStockView}
              onChange={(e) => setSelectedStockView(e.target.value)}
              className="period-selector"
            >
              <option value="products">Top Products</option>
              <option value="categories">Top Categories</option>
            </select>
          </div>
          <div className="chart-container">
            <Doughnut 
              data={stockChartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }} 
            />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h3>🕒 Recent Orders</h3>
          <div className="activity-list">
            {recentOrders.length === 0 ? (
              <div className="no-activity">
                <p>No recent orders found</p>
              </div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="activity-item">
                  <span className="activity-icon" style={{ color: getStatusColor(order.status) }}>
                    {getStatusIcon(order.status)}
                  </span>
                  <div className="activity-content">
                    <p className="activity-title">
                      <p className="activity-title">
  Order #{order.id.substring(0, 5)} - {order.customerName}
</p>

                    </p>
                    <div className="activity-details">
                      <span className="activity-amount">{formatCurrency(order.totalAmount)}</span>
                      <span className="activity-items">{order.itemCount} items</span>
                      <span className="activity-time">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Top Categories Summary */}
        <div className="dashboard-card categories-card">
          <h3>🏷️ Top Categories</h3>
          <div className="category-list">
            {stockData.topCategories.slice(0, 5).map((category, index) => (
              <div key={category.name} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.quantity} sold</span>
                </div>
                <div className="category-revenue">
                  {formatCurrency(category.revenue)}
                </div>
              </div>
            ))}
            {stockData.topCategories.length === 0 && (
              <div className="no-categories">
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
