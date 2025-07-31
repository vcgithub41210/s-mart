import React from 'react';
import './Navbar.css';


const Navbar = ({ currentSection, setCurrentSection }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'orders', label: 'Orders'},
    { id: 'dashboard', label: 'Dashboard' }
  ];


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="smart-logo2.png" alt="S-Mart Logo" />
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



