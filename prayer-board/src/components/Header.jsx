import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cross, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <Cross className="logo-icon" size={24} />
          <span className="logo-text">{t('app.title')}</span>
        </Link>
        
        <div className="header-actions">
          <LanguageSelector />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.displayName}</span>
                {user.role === 'admin' && (
                  <span className="admin-badge">{t('header.admin')}</span>
                )}
              </div>
              
              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label={t('header.logout')}
              >
                <LogOut size={18} />
                <span>{t('header.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                {t('header.login')}
              </Link>
              <Link to="/register" className="btn btn-primary">
                {t('header.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
