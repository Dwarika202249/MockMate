import { clearTokens, getToken, isTokenExpired } from './api';

// Check if user is authenticated with valid token
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

// Centralized logout function
export const logout = (navigate, reason = 'manual') => {
  clearTokens();
  
  // Dispatch logout event for any listeners
  window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason } }));
  
  if (navigate) {
    navigate('/login');
  }
};

// Setup auth event listeners (call this in App.jsx)
export const setupAuthListeners = (navigate, dispatch, setLoggedOut) => {
  const handleLogout = (event) => {
    const { reason } = event.detail || {};
    
    if (setLoggedOut) {
      dispatch(setLoggedOut());
    }
    
    if (reason === 'session_expired') {
      // Could show a toast notification here
      console.log('Session expired, please login again');
    }
    
    if (navigate) {
      navigate('/login');
    }
  };
  
  window.addEventListener('auth:logout', handleLogout);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('auth:logout', handleLogout);
  };
};
  