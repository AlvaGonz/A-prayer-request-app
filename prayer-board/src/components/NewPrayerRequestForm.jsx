
import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import useFocusTrap from '../hooks/useFocusTrap';
import './NewPrayerRequestForm.css';

const NewPrayerRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const modalRef = useFocusTrap(isOpen);
  const closeButtonRef = useRef(null);

  const maxLength = 1000;
  const charCount = body.length;

  const validate = (text) => {
    if (text.length < 10) return t('newRequest.minCharsError');
    return null;
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, loading, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate(body);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await requestsAPI.create(
        { body, isAnonymous },
        isAuthenticated ? user : null
      );

      setBody('');
      setIsAnonymous(true);
      onSuccess(result.request);
      onClose();
    } catch (err) {
      setError(t('errors.creating'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBody('');
      setIsAnonymous(true);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-header">
          <h3 id="modal-title">{t('newRequest.title')}</h3>
          <button
            ref={closeButtonRef}
            className="close-btn"
            onClick={onClose}
            aria-label={t('newRequest.close')}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prayer-form">
          <div className="form-group">
            <label htmlFor="prayer-body" className="sr-only">
              {t('newRequest.prayerBodyLabel')}
            </label>
            <textarea
              id="prayer-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('newRequest.placeholder')}
              maxLength={maxLength}
              rows={6}
              disabled={loading}
            />
            <div className="char-count">
              {t('newRequest.charCount', { count: body.length, max: 1000 })}
            </div>
          </div>

          {isAuthenticated && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={!isAuthenticated || loading}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  {t('newRequest.anonymous')}
                </span>
              </label>
              <p id="anonymous-hint" className="checkbox-hint">
                {isAnonymous ? t('newRequest.anonymousHint') : t('newRequest.privacyNotice')}
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <p className="guest-notice" role="note">
              <Trans i18nKey="newRequest.guestNoticeWithLink">
                You are posting as a guest. Your request will appear as "Anonymous."
                <Link to="/register">Create an account</Link> to post with your name.
              </Trans>
            </p>
          )}

          <p className="privacy-notice" role="note">
            <Globe size={16} className="icon-inline" aria-hidden="true" />
            {t('newRequest.privacyNotice')}
          </p>

          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              <AlertCircle size={16} className="icon-inline" aria-hidden="true" />
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {t('newRequest.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!body.trim() || loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" aria-hidden="true" />
                  {t('newRequest.submitting')}
                </>
              ) : (
                <>
                  <MessageCircle size={16} aria-hidden="true" />
                  {t('newRequest.submit')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPrayerRequestForm;
