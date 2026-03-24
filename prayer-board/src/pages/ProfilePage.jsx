import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Loader2, ShieldCheck, CheckCircle2, 
  Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { m, AnimatePresence } from 'framer-motion';
import './AuthPages.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError(t('auth.errors.passwordsDoNotMatch'));
      setIsUpdating(false);
      return;
    }

    try {
      const updateData = { displayName, email };
      if (password) updateData.password = password;
      
      await updateProfile(updateData);
      setMessage(t('auth.profileUpdateSuccess'));
      setPassword('');
      setConfirmPassword('');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || t('auth.profileUpdateError'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <m.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="auth-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
             <div className="profile-avatar-large">
                {user.displayName.charAt(0).toUpperCase()}
             </div>
             <h1>{t('auth.profileTitle')}</h1>
             <div className="role-badge">
                <ShieldCheck size={14} />
                {user.role}
             </div>
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <m.div 
                className="profile-success-msg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CheckCircle2 size={16} />
                {message}
              </m.div>
            )}
            {error && (
              <m.div 
                className="auth-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={16} />
                {error}
              </m.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="displayName">
                <User size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {t('auth.nameUpdateLabel')}
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('auth.displayNamePlaceholder')}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">
                <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {t('auth.emailUpdateLabel')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">
                <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {t('auth.newPasswordLabel')}
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.newPasswordPlaceholder')}
                  disabled={isUpdating}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {password && (
              <m.div 
                className="form-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label htmlFor="confirmPassword">
                  <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  {t('auth.confirmNewPasswordLabel')}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmNewPasswordPlaceholder')}
                  required={!!password}
                  disabled={isUpdating}
                />
              </m.div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isUpdating || (displayName === user.displayName && email === user.email && !password)}
            >
              {isUpdating ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  {t('auth.saving')}
                </>
              ) : (
                t('auth.updateProfileBtn')
              )}
            </button>
            
            <button 
              type="button" 
              className="guest-link" 
              onClick={() => navigate('/')}
              style={{ marginTop: '12px', border: 'none' }}
            >
              {t('newRequest.wizard.back')}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-avatar-large {
          width: 80px;
          height: 80px;
          background-color: var(--color-accent-gold);
          color: var(--color-bg-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(226, 185, 111, 0.2);
        }
        
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background-color: rgba(226, 185, 111, 0.1);
          color: var(--color-accent-gold);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .profile-success-msg {
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid #22c55e;
          color: #22c55e;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </m.div>
  );
};

export default ProfilePage;
