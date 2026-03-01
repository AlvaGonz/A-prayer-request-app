import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Menu, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { m } from 'framer-motion';
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
          {/* Spiritual Animated Icon set: Cross with entrance animation */}
          <div className="logo-icon-wrapper">
            <m.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <m.div
                initial={{ rotate: -15, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <img
                  src="/icons/Prayer%20Board%20ico%20no%20background.svg"
                  alt="Prayer Board Logo"
                  className="logo-icon"
                  style={{ width: 38, height: 38 }}
                />
              </m.div>
            </m.div>
          </div>
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="user-menu-trigger dropdown-trigger">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user.displayName}</span>
                    {user.role === 'admin' && (
                      <span className="admin-badge">{t('header.admin')}</span>
                    )}
                  </div>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-menu-content" sideOffset={8} align="end">
                  <DropdownMenu.Item asChild>
                    <button
                      className="logout-btn dropdown-item"
                      onClick={handleLogout}
                      aria-label={t('header.logout')}
                    >
                      <LogOut size={18} />
                      <span>{t('header.logout')}</span>
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
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
