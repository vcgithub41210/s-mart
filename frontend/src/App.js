import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [showLogin, setShowLogin] = useState(true); // Start with login page

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'home':
        return <Home />;
      case 'inventory':
        return <Inventory />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  const handleLogin = () => {
    // Simply redirect to home page without any authentication
    setShowLogin(false);
  };

  // If showLogin is true, display login page
  if (showLogin) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Otherwise show the main app
  return (
    <div className="App">
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
      />
      <main className="main-content">
        {renderCurrentSection()}
      </main>
    </div>
  );
}

export default App;
