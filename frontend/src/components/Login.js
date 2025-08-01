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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.login(username.trim(), password, loginType);
      
      if (result.success) {
        if (onLogin) {
          onLogin(loginType, username, password);
        }

        if (loginType === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/home');
        }

        setUsername('');
        setPassword('');
        setError('');
      }
    } catch (err) {
      console.error('Login error:', err);
      
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

  const handleSignupClick = () => {
    navigate('/signup');
  };

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
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
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
                  style={{
                    color: '#333',
                    backgroundColor: '#fff',
                    fontSize: '16px'
                  }}
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
                  style={{
                    color: '#333',
                    backgroundColor: '#fff',
                    fontSize: '16px'
                  }}
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

            <div className="signup-section">
              <p className="signup-text">Don't have an account?</p>
              <button 
                type="button" 
                className="signup-button"
                onClick={handleSignupClick}
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
