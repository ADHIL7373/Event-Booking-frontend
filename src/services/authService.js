/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './api';

const authService = {
  // Register new user
  register: async (fullName, email, password, confirmPassword) => {
    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      
      // Handle express-validator error format: { errors: [{ field, message }] }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors
          .map(err => {
            // Handle both object format { field, message } and string format
            return typeof err === 'string' ? err : err.message;
          })
          .filter(msg => msg);
        
        if (errorMessages.length > 0) {
          const err = new Error(errorData.message || 'Registration failed');
          err.errors = errorMessages;
          throw err;
        }
      }
      
      // Handle controller-level password validation format
      if (errorData.message) {
        const err = new Error(errorData.message);
        err.errors = [errorData.message];
        throw err;
      }
      
      const err = new Error('Registration failed');
      err.errors = ['Registration failed'];
      throw err;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // Update user profile
  updateProfile: async (fullName, phone, profileImage) => {
    try {
      const response = await api.put('/auth/profile', {
        fullName,
        phone,
        profileImage,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Forgot Password - Send OTP
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Reset Password
  resetPassword: async (email, resetToken, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },
};

export default authService;
