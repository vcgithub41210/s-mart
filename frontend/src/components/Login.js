import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onSignupClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('staff'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginType, username, password);
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={loginType === 'admin' ? 'Enter admin username' : 'Enter staff username'}
                  required
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginType === 'admin' ? 'Enter admin password' : 'Enter staff password'}
                  required
                />
              </div>
              
              <button type="submit" className={`login-button ${loginType}-login`}>
                {loginType === 'admin' ? 'Admin Login' : 'Staff Login'}
              </button>
            </form>

            {/* Signup Button */}
            <div className="signup-section">
              <p className="signup-text">Don't have an account?</p>
              <button 
                type="button" 
                className="signup-button"
                onClick={onSignupClick}
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
