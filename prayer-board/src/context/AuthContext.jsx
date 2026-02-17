import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authAPI.login({ email, password });
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return { token, user };
  };

  const register = async (data) => {
    const { token, user } = await authAPI.register(data);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    return { token, user };
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout
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
