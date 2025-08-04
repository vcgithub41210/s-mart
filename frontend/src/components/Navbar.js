import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import LogoutModal from './LogoutModal';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // New state for logout modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Same navigation items for both staff and admin
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/home' },
    { id: 'inventory', label: 'Inventory', icon: '📦', path: '/inventory' },
    { id: 'orders', label: 'Orders', icon: '📋', path: '/orders' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Updated to show modal instead of window.confirm
  const promptLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getCurrentUser = () => {
    const user = authService.getCurrentUser();
    return user?.fullName || user?.username || 'User';
  };

  // Get current user data for modal
  const getUserData = () => {
    const user = authService.getCurrentUser();
    return {
      name: user?.fullName || user?.username || 'User',
      role: userRole
    };
  };

  // Get current active section based on current path
  const getCurrentSection = () => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => item.path === currentPath);
    return activeItem?.id || 'home';
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img src="smart-logo2.png" alt="S-Mart Logo" />
            <div className="brand-text">
              <h2>S-MART</h2>
              <span className="brand-subtitle">Inventory Management</span>
            </div>
          </div>
         
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li key={item.id} className="navbar-item">
                <button
                  className={`navbar-link ${getCurrentSection() === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{getCurrentUser()}</span>
              <span className="user-role">{userRole?.toUpperCase()}</span>
            </div>
            <button className="logout-btn" onClick={promptLogout}>
              <span className="logout-icon">🔓</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        userData={getUserData()}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
};

export default Navbar;
