import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cross, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <Cross className="logo-icon" size={24} />
          <span className="logo-text">{t('app.title')}</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`header-actions ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-only-group" onClick={(e) => e.stopPropagation()}>
            <LanguageSelector />
            <ThemeToggle />
          </div>

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
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                {t('header.login')}
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                {t('header.signup')}
              </Link>
            </div>
          )}
        </div>

        {/* Overlay to close menu when clicking outside */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;
