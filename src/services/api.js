/**
 * API Service
 * Axios instance with default configuration
 */

import axios from 'axios';

// Determine API base URL - default to production HTTPS backend
let API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('[API] Env REACT_APP_API_URL:', API_BASE_URL);
console.log('[API] Window location:', typeof window !== 'undefined' ? window.location.href : 'N/A');

// If no env var, determine based on environment
if (!API_BASE_URL) {
  const isProduction = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('render.com') ||
    window.location.protocol === 'https:'
  );
  
  if (isProduction) {
    // Production: Use HTTPS backend
    API_BASE_URL = 'https://event-booking-backend-suu5.onrender.com/api';
    console.log('[API] PRODUCTION MODE - Using:', API_BASE_URL);
  } else {
    // Development: Use localhost
    API_BASE_URL = 'http://localhost:5000/api';
    console.log('[API] DEVELOPMENT MODE - Using:', API_BASE_URL);
  }
}

console.log('[API] Final API_BASE_URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include token and set Content-Type for JSON requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set Content-Type only for non-FormData requests
    if (!config.data || !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
