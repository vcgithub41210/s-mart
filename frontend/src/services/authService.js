import api from './api';

const authService = {
  // Login user
  login: async (username, password, role) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
        role
      });
      
      const { token, user } = response.data.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Auth service login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout API call failed, but continuing with local cleanup');
    } finally {
      // Always clean up local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    return authService.hasRole('admin');
  },

  // Check if user is staff
  isStaff: () => {
    return authService.hasRole('staff');
  }
};

// Set up axios interceptor to automatically add token
const token = authService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;
