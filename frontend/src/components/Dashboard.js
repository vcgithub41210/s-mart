import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Sales Overview</h3>
          <div className="chart-placeholder">
            <p>📈 Sales Chart</p>
            <p className="placeholder-text">Chart will be implemented here</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Stock Levels</h3>
          <div className="chart-placeholder">
            <p>📊 Stock Chart</p>
            <p className="placeholder-text">Stock level visualization</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📦</span>
              <div>
                <p>New item added: Laptop Dell XPS 13</p>
                <small>2 hours ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⚠️</span>
              <div>
                <p>Low stock alert: Coffee Maker</p>
                <small>4 hours ago</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div>
                <p>Inventory updated: Office Chair</p>
                <small>1 day ago</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Top Categories</h3>
          <div className="category-list">
            <div className="category-item">
              <span>Electronics</span>
              <span className="category-count">145 items</span>
            </div>
            <div className="category-item">
              <span>Furniture</span>
              <span className="category-count">67 items</span>
            </div>
            <div className="category-item">
              <span>Appliances</span>
              <span className="category-count">43 items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
