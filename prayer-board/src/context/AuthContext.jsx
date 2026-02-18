import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, APIError } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('prayerBoard_token');
        if (storedToken) {
          const { user } = await authAPI.me();
          setUser(user);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log('Session expired or invalid');
        // Token exists but is invalid - clear it
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { token, user } = await authAPI.login({ email, password });
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true, token, user };
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof APIError) {
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Account is deactivated')) {
          errorMessage = 'Your account has been deactivated. Please contact support.';
        } else if (error.statusCode === 429) {
          errorMessage = 'Too many login attempts. Please wait 15 minutes.';
        } else {
          errorMessage = error.message;
        }
      } else if (error.message === 'Network error. Please check your connection.') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }
      
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data) => {
    setAuthError(null);
    try {
      const { token, user } = await authAPI.register(data);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true, token, user };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error instanceof APIError) {
        if (error.message.includes('Email already registered')) {
          errorMessage = 'An account with this email already exists.';
        } else if (error.message.includes('Password must contain')) {
          errorMessage = error.message;
        } else if (error.message.includes('valid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.statusCode === 429) {
          errorMessage = 'Too many registration attempts. Please wait.';
        } else {
          errorMessage = error.message;
        }
      } else if (error.message === 'Network error. Please check your connection.') {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }
      
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    authError,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
