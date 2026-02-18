import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cross, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <Cross className="logo-icon" size={24} />
          <span className="logo-text">Prayer Board</span>
        </Link>
        
        <div className="header-actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.displayName}</span>
                {user.role === 'admin' && (
                  <span className="admin-badge">Admin</span>
                )}
              </div>
              
              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
