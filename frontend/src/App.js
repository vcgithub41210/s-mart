import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Orders from './components/Orders';
// Add the TestConnection component
import TestConnection from './components/TestConnection';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [userRole, setUserRole] = useState(null);
  // Add connection status state
  const [isConnected, setIsConnected] = useState(false);

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'home':
        return <Home userRole={userRole} isConnected={isConnected} />;
      case 'inventory':
        return <Inventory userRole={userRole} isConnected={isConnected} />;
      case 'dashboard':
        return <Dashboard userRole={userRole} isConnected={isConnected} />;
      case 'orders':
        return <Orders userRole={userRole} isConnected={isConnected} />;
      default:
        return <Home userRole={userRole} isConnected={isConnected} />;
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

  // Show main app with connection test
  return (
    <div className="App">
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        userRole={userRole}
      />
      {/* Add connection status banner */}
      <TestConnection onConnectionChange={setIsConnected} />
      
      <main className="main-content">
        {renderCurrentSection()}
      </main>
    </div>
  );
}

export default App;
