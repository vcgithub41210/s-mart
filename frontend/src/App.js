import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

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
