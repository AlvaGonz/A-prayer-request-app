/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, APIError } from '../api';
import { safeStorage, safeSessionStorage } from '../utils/storage';

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
        const storedToken = safeSessionStorage.getItem('prayerBoard_token')
                         || safeStorage.getItem('prayerBoard_token');
        if (storedToken) {
          const { user } = await authAPI.me();
          setUser(user);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch {
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
      
      // Save to sessionStorage (dies when tab closes, reduces XSS surface)
      safeSessionStorage.setItem('prayerBoard_token', token);
      safeSessionStorage.setItem('prayerBoard_user', JSON.stringify(user));
      // Explicitly clear any stale localStorage token from previous sessions
      safeStorage.removeItem('prayerBoard_token');
      safeStorage.removeItem('prayerBoard_user');
      
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
      throw error;
    }
  };

  const register = async (data) => {
    setAuthError(null);
    try {
      const { token, user } = await authAPI.register(data);
      
      // Save to sessionStorage (dies when tab closes, reduces XSS surface)
      safeSessionStorage.setItem('prayerBoard_token', token);
      safeSessionStorage.setItem('prayerBoard_user', JSON.stringify(user));
      // Explicitly clear any stale localStorage token from previous sessions
      safeStorage.removeItem('prayerBoard_token');
      safeStorage.removeItem('prayerBoard_user');
      
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
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const updateProfile = async (data) => {
    setAuthError(null);
    try {
      const { user: updatedUser } = await authAPI.updateProfile(data);
      
      // Update local storage/sessionStorage
      const isSessionStored = !!safeSessionStorage.getItem('prayerBoard_user');
      const storage = isSessionStored ? safeSessionStorage : safeStorage;
      
      storage.setItem('prayerBoard_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      setAuthError(error.message || 'Failed to update profile');
      throw error;
    }
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
    updateProfile,
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
