import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { EyeToggleIcon } from '../components/ui/animated-state-icons';
import { useAuth } from '../context/AuthContext';
import { m } from 'framer-motion';
import './AuthPages.css';

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();

  const validatePassword = (pass) => {
    if (pass.length < 8) return t('auth.errors.passwordMinLength');
    if (!/[A-Z]/.test(pass)) return t('auth.errors.passwordUppercase');
    if (!/[0-9]/.test(pass)) return t('auth.errors.passwordNumber');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (displayName.length < 2) {
      setError(t('auth.errors.displayNameMin'));
      return;
    }

    setIsLoading(true);

    try {
      await register({ displayName, email, password });
      navigate('/');
    } catch (err) {
      if (err.statusCode === 429) {
        setError(t('auth.errors.rateLimit'));
      } else {
        setError(err.message || t('auth.errors.createFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <m.div
      className="auth-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <img
              src="/icons/Prayer%20Board%20ico%20no%20background.svg"
              alt="Prayer Board Logo"
              className="logo-icon"
              style={{ width: 58, height: 58 }}
            />
            <span>{t('app.title')}</span>
          </Link>
        </div>

        <div className="auth-card">
          <h1>{t('auth.registerTitle')}</h1>
          <p className="auth-subtitle">{t('header.signup')}</p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="displayName">{t('auth.displayName')}</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('auth.displayNamePlaceholder')}
                required
                disabled={isLoading}
                maxLength={50}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">{t('auth.password')}</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.createPasswordPlaceholder')}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeToggleIcon size={20} isHidden={!showPassword} />
                </button>
              </div>
              <p className="field-hint">
                {t('auth.passwordHint')}
              </p>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">
                {t('auth.confirmPassword') || 'Confirm Password'}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder') || 'Repeat your password'}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  {t('auth.creatingAccount')}
                </>
              ) : (
                t('auth.createAccountBtn')
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('auth.or')}</span>
          </div>

          <Link to="/" className="guest-link">
            {t('auth.guest')}
          </Link>
        </div>

        <p className="auth-footer">
          {t('auth.hasAccount')} <Link to="/login">{t('header.login')}</Link>
        </p>
      </div>
    </m.div>
  );
};

export default RegisterPage;
