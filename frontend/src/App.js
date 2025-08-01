import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Orders from './components/Orders';
import TestConnection from './components/TestConnection';
import authService from './services/authService';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = authService.getToken();
        const user = authService.getCurrentUser();
        
        if (token && user) {
          setIsAuthenticated(true);
          setUserRole(user.role);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (loginType, username, password) => {
    console.log(`Login successful: ${loginType}, Username: ${username}`);
    setUserRole(loginType);
    setIsAuthenticated(true);
  };

  const handleSignupSubmit = (role, username, password) => {
    console.log(`Signup: Role: ${role}, Username: ${username}`);
    alert('Account created successfully! Please login.');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Public Route Component (only accessible when not authenticated)
  const PublicRoute = ({ children }) => {
    if (isAuthenticated) {
      // Redirect authenticated users to appropriate dashboard
      if (userRole === 'admin') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/home" replace />;
      }
    }
    return children;
  };

  // Check if we should show navbar and test connection (not on login/signup pages)
  const shouldShowNavbar = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <div className="App">
      {/* Show Navbar only for authenticated users */}
      {shouldShowNavbar && (
        <Navbar userRole={userRole} />
      )}
      
      {/* Show connection test only for authenticated users */}
      {isAuthenticated && (
        <TestConnection onConnectionChange={setIsConnected} />
      )}
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login 
                  onLogin={handleLogin}
                  onSignupClick={() => {/* Navigation handled by Login component */}}
                />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup 
                  onSignupSubmit={handleSignupSubmit}
                  onBackToLogin={() => {/* Navigation handled by Signup component */}}
                />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home userRole={userRole} isConnected={isConnected} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Inventory userRole={userRole} isConnected={isConnected} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders userRole={userRole} isConnected={isConnected} />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboard accessible to both staff and admin */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard userRole={userRole} isConnected={isConnected} />
              </ProtectedRoute>
            } 
          />

          {/* Default route - redirect based on auth status and role */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                userRole === 'admin' ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/home" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch-all route */}
          <Route 
            path="*" 
            element={
              <Navigate to={isAuthenticated ? (userRole === 'admin' ? '/dashboard' : '/home') : '/login'} replace />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
