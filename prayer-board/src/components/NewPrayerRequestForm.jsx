import React, { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X, MessageCircle, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import useFocusTrap from '../hooks/useFocusTrap';
import './NewPrayerRequestForm.css';

const NewPrayerRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const modalRef = useFocusTrap(isOpen);
  const closeButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isValid, isSubmitting },
    clearErrors,
  } = useForm({
    defaultValues: { body: '', isAnonymous: true },
    mode: 'onChange',
  });

  const bodyContent = useWatch({ control, name: 'body', defaultValue: '' });
  const isAnonymousValue = useWatch({ control, name: 'isAnonymous', defaultValue: true });
  const maxLength = 1000;

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
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
  }, [isOpen, isSubmitting]); // Using handleClose indirectly via state check, but safe

  const onSubmit = async (data) => {
    clearErrors('root');

    try {
      const result = await requestsAPI.create(
        { body: data.body.trim(), isAnonymous: data.isAnonymous },
        isAuthenticated ? user : null
      );

      reset();
      onSuccess(result.request);
      onClose();
    } catch (err) {
      setError('root', { type: 'manual', message: t('errors.creating') });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      clearErrors();
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
            type="button"
            className="close-btn"
            onClick={handleClose}
            aria-label={t('newRequest.close')}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="prayer-form">
          <div className="form-group">
            <label htmlFor="prayer-body" className="sr-only">
              {t('newRequest.prayerBodyLabel')}
            </label>
            <textarea
              id="prayer-body"
              {...register('body', {
                required: t('newRequest.minCharsError'),
                minLength: { value: 10, message: t('newRequest.minCharsError') },
                maxLength: maxLength
              })}
              placeholder={t('newRequest.placeholder')}
              rows={6}
              disabled={isSubmitting}
            />
            <div className="char-count">
              {t('newRequest.charCount', { count: bodyContent?.length || 0, max: maxLength })}
            </div>
            {errors.body && (
              <div className="error-message error-message-field" role="alert">
                {errors.body.message}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  {...register('isAnonymous')}
                  disabled={!isAuthenticated || isSubmitting}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  {t('newRequest.anonymous')}
                </span>
              </label>
              <p id="anonymous-hint" className="checkbox-hint">
                {isAnonymousValue ? t('newRequest.anonymousHint') : t('newRequest.privacyNotice')}
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

          {errors.root && (
            <div className="error-message" role="alert" aria-live="assertive">
              <AlertCircle size={16} className="icon-inline" aria-hidden="true" />
              {errors.root.message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('newRequest.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!bodyContent?.trim() || !isValid || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
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
