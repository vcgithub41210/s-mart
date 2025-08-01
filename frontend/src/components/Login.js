import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Login = ({ onLogin, onSignupClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Add this for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Use authService to login with JWT authentication
      const result = await authService.login(username.trim(), password, loginType);
      
      if (result.success) {
        // Call the parent onLogin callback if it exists
        if (onLogin) {
          onLogin(loginType, username, password);
        }

        // Navigate based on role
        if (loginType === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }

        // Clear form on successful login
        setUsername('');
        setPassword('');
        setError('');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Extract error message from response
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup button click - FIXED
  const handleSignupClick = () => {
    navigate('/signup'); // Use React Router navigation
  };

  // Clear error when user starts typing
  const handleInputChange = (setter, value) => {
    setter(value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <img src="/smart-logo2.png" alt="S-MART Logo" className="login-logo" />
          
          <p>Streamline your inventory tracking and management with our comprehensive solution.</p>
          <ul>
            <li>Real-time inventory tracking</li>
            <li>Comprehensive dashboard analytics</li>
            <li>Easy-to-use interface</li>
            <li>Secure data management</li>
          </ul>
        </div>
        
        <div className="login-right">
          <div className="login-form-container">
            <h2>Login</h2>
            
            {/* Error Message Display */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            {/* Login Type Selection */}
            <div className="login-type-selector">
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="loginType"
                    value="staff"
                    checked={loginType === 'staff'}
                    onChange={(e) => setLoginType(e.target.value)}
                    disabled={loading}
                  />
                  <span className="radio-custom"></span>
                  Staff Login
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="loginType"
                    value="admin"
                    checked={loginType === 'admin'}
                    onChange={(e) => setLoginType(e.target.value)}
                    disabled={loading}
                  />
                  <span className="radio-custom"></span>
                  Admin Login
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">
                  {loginType === 'admin' ? 'Admin Username' : 'Staff Username'}
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => handleInputChange(setUsername, e.target.value)}
                  placeholder={loginType === 'admin' ? 'Enter admin username' : 'Enter staff username'}
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  {loginType === 'admin' ? 'Admin Password' : 'Staff Password'}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => handleInputChange(setPassword, e.target.value)}
                  placeholder={loginType === 'admin' ? 'Enter admin password' : 'Enter staff password'}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
              
              <button 
                type="submit" 
                className={`login-button ${loginType}-login ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  loginType === 'admin' ? 'Admin Login' : 'Staff Login'
                )}
              </button>
            </form>

            {/* Demo Credentials Info */}
            <div className="demo-credentials">
              <div className="demo-info">
                <h4>Demo Credentials:</h4>
                <div className="demo-accounts">
                  <div className="demo-account">
                    <strong>Admin:</strong> admin / admin123
                  </div>
                  <div className="demo-account">
                    <strong>Staff:</strong> staff / staff123
                  </div>
                </div>
              </div>
            </div>

            {/* Signup Button - FIXED */}
            <div className="signup-section">
              <p className="signup-text">Don't have an account?</p>
              <button 
                type="button" 
                className="signup-button"
                onClick={handleSignupClick} // Use the new handler
                disabled={loading}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
