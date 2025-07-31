import React from 'react';
import './Navbar.css';

const Navbar = ({ currentSection, setCurrentSection }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>S-Mart</h2>
          <span className="brand-subtitle">Inventory Management</span>
        </div>
        
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.id} className="navbar-item">
              <button
                className={`navbar-link ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => setCurrentSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
