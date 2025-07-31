import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TestConnection = ({ onConnectionChange }) => {
  const [status, setStatus] = useState('Testing connection...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus(`✅ Backend Connected - Server: ${response.data.status}`);
        setIsConnected(true);
        if (onConnectionChange) onConnectionChange(true);
      } catch (error) {
        setStatus(`❌ Backend Disconnected: ${error.message}`);
        setIsConnected(false);
        if (onConnectionChange) onConnectionChange(false);
      }
    };

    testConnection();
    
    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000);
    
    return () => clearInterval(interval);
  }, [onConnectionChange]);

  return (
    <div style={{
      padding: '10px',
      backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
      color: isConnected ? '#155724' : '#721c24',
      border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '4px',
      margin: '10px',
      textAlign: 'center',
      fontSize: '14px'
    }}>
      <strong>Backend Status:</strong> {status}
    </div>
  );
};

export default TestConnection;
