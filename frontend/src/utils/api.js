import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000, // 15 second timeout for performance
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token utilities
const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (token, refreshToken = null) => {
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};
const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Check if token is expired (decode without verification for client-side check)
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Add 30 second buffer for clock skew
    return payload.exp * 1000 < Date.now() - 30000;
  } catch {
    return true;
  }
};

// Get token expiration time in ms
const getTokenExpiry = (token) => {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch {
    return 0;
  }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token && !config.headers.Authorization) {
      // Check if token is about to expire (within 5 minutes)
      if (!isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request timestamp for latency tracking
    config.metadata = { startTime: Date.now() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401s and latency logging
api.interceptors.response.use(
  (response) => {
    // Log API latency in development
    if (import.meta.env.DEV && response.config.metadata) {
      const latency = Date.now() - response.config.metadata.startTime;
      if (latency > 2000) {
        console.warn(`⚠️ Slow API call: ${response.config.url} took ${latency}ms`);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getRefreshToken();
      
      // If we have a refresh token, try to refresh
      if (refreshToken && !isTokenExpired(refreshToken)) {
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/auth/refresh`,
              { refreshToken }
            );
            
            const { token: newToken, refreshToken: newRefreshToken } = response.data;
            setTokens(newToken, newRefreshToken);
            
            isRefreshing = false;
            onTokenRefreshed(newToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            clearTokens();
            
            // Dispatch custom event for logout
            window.dispatchEvent(new CustomEvent('auth:logout', { 
              detail: { reason: 'refresh_failed' }
            }));
            
            return Promise.reject(refreshError);
          }
        } else {
          // Wait for token refresh to complete
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }
      } else {
        // No refresh token or expired - logout
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'session_expired' }
        }));
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - API unreachable');
    }
    
    return Promise.reject(error);
  }
);

// Export utilities
export { getToken, setTokens, clearTokens, isTokenExpired, getTokenExpiry };
export default api;
