import React, { useState } from 'react';
import './Orders.css';
import BillModal from './BillModal';

const Orders = () => {
  const [filter, setFilter] = useState('all');
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data - replace with API calls later
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-07-31',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+91 9876543210',
      items: [
        { id: 1, name: 'Wireless Headphones', quantity: 2, price: 2999, total: 5998 },
        { id: 2, name: 'USB Cables', quantity: 5, price: 299, total: 1495 }
      ],
      totalAmount: 7493,
      status: 'pending',
      orderTime: '10:30 AM'
    },
    {
      id: 'ORD-002',
      date: '2024-07-31',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      customerPhone: '+91 9876543211',
      items: [
        { id: 3, name: 'Bluetooth Speakers', quantity: 1, price: 3999, total: 3999 },
        { id: 4, name: 'Power Banks', quantity: 2, price: 1299, total: 2598 }
      ],
      totalAmount: 6597,
      status: 'completed',
      orderTime: '11:45 AM',
      completedTime: '12:30 PM'
    },
    {
      id: 'ORD-003',
      date: '2024-07-30',
      customerName: 'Mike Johnson',
      customerEmail: 'mike.johnson@email.com',
      customerPhone: '+91 9876543212',
      items: [
        { id: 5, name: 'Laptop Chargers', quantity: 1, price: 1499, total: 1499 },
        { id: 6, name: 'Wireless Mouse', quantity: 3, price: 899, total: 2697 }
      ],
      totalAmount: 4196,
      status: 'pending',
      orderTime: '2:15 PM'
    },
    {
      id: 'ORD-004',
      date: '2024-07-30',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      customerPhone: '+91 9876543213',
      items: [
        { id: 7, name: 'Phone Cases', quantity: 4, price: 599, total: 2396 },
        { id: 8, name: 'Screen Protectors', quantity: 10, price: 199, total: 1990 }
      ],
      totalAmount: 4386,
      status: 'completed',
      orderTime: '3:20 PM',
      completedTime: '4:00 PM'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleCompleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as completed?')) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: 'completed',
                completedTime: new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            : order
        )
      );
      alert('Order marked as completed!');
    }
  };

  const handleGenerateBill = (order) => {
    setSelectedOrder(order);
    setShowBillModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { totalOrders, pendingOrders, completedOrders, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div className="header-title">
            <h1>Orders Management</h1>
            <p className="orders-subtitle">Track and manage all your orders</p>
          </div>

          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-number">{stats.pendingOrders}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card completed">
              <div className="stat-number">{stats.completedOrders}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card revenue">
              <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="orders-filters">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pendingOrders})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completedOrders})
            </button>
          </div>
        </div>

        <div className="orders-content">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <div className="no-orders-icon">📋</div>
              <h3>No orders found</h3>
              <p>No orders match your current filter criteria.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map(order => (
                <div key={order.id} className={`order-card ${order.status}`}>
                  <div className="order-header">
                    <div className="order-id-section">
                      <h3 className="order-id">{order.id}</h3>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                      </span>
                    </div>
                    <div className="order-date">
                      <span className="date">{formatDate(order.date)}</span>
                      <span className="time">{order.orderTime}</span>
                    </div>
                  </div>

                  <div className="customer-info">
                    <h4>Customer Details</h4>
                    <div className="customer-details">
                      <p><strong>Name:</strong> {order.customerName}</p>
                      <p><strong>Email:</strong> {order.customerEmail}</p>
                      <p><strong>Phone:</strong> {order.customerPhone}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items Ordered</h4>
                    <div className="items-list">
                      {order.items.map(item => (
                        <div key={item.id} className="item-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                          <span className="item-price">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: {formatCurrency(order.totalAmount)}</strong>
                    </div>
                    <div className="order-actions">
                      {order.status === 'pending' ? (
                        <button
                          className="complete-btn"
                          onClick={() => handleCompleteOrder(order.id)}
                        >
                          Mark as Completed
                        </button>
                      ) : (
                        <div className="completed-actions">
                          <span className="completed-time">
                            Completed at {order.completedTime}
                          </span>
                          <button
                            className="bill-btn"
                            onClick={() => handleGenerateBill(order)}
                          >
                            📄 Generate Bill
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BillModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default Orders;
