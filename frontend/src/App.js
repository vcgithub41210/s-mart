import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
// Add this import
import Orders from './components/Orders';

// In your component rendering logic



function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'home':
        return <Home userRole={userRole} />;
      case 'inventory':
        return <Inventory userRole={userRole} />;
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
        case 'orders':
        return <Orders userRole={userRole} />;
        default:
        return <Home userRole={userRole} />;
    }
  };

  const handleLogin = (loginType, username, password) => {
    console.log(`Login attempt: ${loginType}, Username: ${username}`);
    setUserRole(loginType);
    setShowLogin(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSignupSubmit = (role, username, password) => {
    console.log(`Signup: Role: ${role}, Username: ${username}`);
    // You can add signup logic here later
    alert('Account created successfully! Please login.');
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  // Show signup page
  if (showSignup) {
    return (
      <div className="App">
        <Signup 
          onSignupSubmit={handleSignupSubmit}
          onBackToLogin={handleBackToLogin}
        />
      </div>
    );
  }

  // Show login page
  if (showLogin) {
    return (
      <div className="App">
        <Login 
          onLogin={handleLogin}
          onSignupClick={handleSignupClick}
        />
      </div>
    );
  }

  // Show main app
  return (
    <div className="App">
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        userRole={userRole}
      />
      <main className="main-content">
        {renderCurrentSection()}
      </main>
    </div>
  );
}

export default App;
