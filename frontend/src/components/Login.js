import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          {/* Update the src to match your actual filename */}
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
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
