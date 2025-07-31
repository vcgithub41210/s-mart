import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onSignupSubmit, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('staff');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic password confirmation check
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Call the signup handler and redirect back to login
    onSignupSubmit(role, username, password);
    onBackToLogin();
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-left">
          <img src="/smart-logo2.png" alt="S-MART Logo" className="signup-logo" />
          
          <p>Join our inventory management system and streamline your business operations.</p>
          <ul>
            <li>Create your secure account</li>
            <li>Choose your role and permissions</li>
            <li>Start managing inventory efficiently</li>
            <li>Access comprehensive analytics</li>
          </ul>
        </div>
        
        <div className="signup-right">
          <div className="signup-form-container">
            <h2>Sign Up</h2>
            
            {/* Role Selection */}
            <div className="role-selector">
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={role === 'staff'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Staff Account
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Admin Account
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="signup-username">
                  {role === 'admin' ? 'Admin Username' : 'Staff Username'}
                </label>
                <input
                  type="text"
                  id="signup-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'admin' ? 'Enter admin username' : 'Enter staff username'}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-password">
                  {role === 'admin' ? 'Admin Password' : 'Staff Password'}
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={role === 'admin' ? 'Enter admin password' : 'Enter staff password'}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <button type="submit" className={`signup-button ${role}-signup`}>
                {role === 'admin' ? 'Create Admin Account' : 'Create Staff Account'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="login-section">
              <p className="login-text">Already have an account?</p>
              <button 
                type="button" 
                className="back-to-login-button"
                onClick={onBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
