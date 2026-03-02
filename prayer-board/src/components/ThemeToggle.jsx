import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`theme-toggle-capsule ${isDark ? 'dark' : 'light'} ${className}`}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      aria-label={t('theme.toggle', { theme: isDark ? t('theme.light') : t('theme.dark') })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <div className="theme-toggle-inner">
        {/* Left/Sliding Puck */}
        <div className={`theme-toggle-puck ${isDark ? 'puck-dark-left' : 'puck-light-right'}`}>
          {isDark ? (
            <Moon className="icon-white" size={16} strokeWidth={1.5} />
          ) : (
            <Sun className="icon-gray-700" size={16} strokeWidth={1.5} />
          )}
        </div>

        {/* Right/Stationary Puck */}
        <div className={`theme-toggle-stationary ${isDark ? 'station-dark-right' : 'station-light-left'}`}>
          {isDark ? (
            <Sun className="icon-gray-500" size={16} strokeWidth={1.5} />
          ) : (
            <Moon className="icon-black" size={16} strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
