import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import useFocusTrap from '../hooks/useFocusTrap';
import './NewPrayerRequestForm.css';

const NewPrayerRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const modalRef = useFocusTrap(isOpen);
  const closeButtonRef = useRef(null);

  const maxLength = 1000;
  const charCount = body.length;

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
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
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (charCount < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);

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
      setError(err.message || 'Failed to post prayer request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
          <h2 id="modal-title">Share a Prayer Request</h2>
          <button 
            ref={closeButtonRef}
            className="close-btn" 
            onClick={handleClose}
            aria-label="Close prayer request form"
            disabled={isSubmitting}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p id="modal-description" className="sr-only">
          Form to share a new prayer request with the community
        </p>

        <form onSubmit={handleSubmit} className="prayer-form">
          <div className="form-group">
            <label htmlFor="prayer-body" className="sr-only">
              Your prayer request
            </label>
            <textarea
              id="prayer-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share what you would like prayer for..."
              maxLength={maxLength}
              rows={6}
              disabled={isSubmitting}
              autoFocus
              aria-required="true"
              aria-describedby="char-count prayer-hint"
              aria-invalid={charCount > 0 && charCount < 10 ? 'true' : 'false'}
            />
            <div id="char-count" className="char-counter" aria-live="polite">
              <span className={charCount > maxLength * 0.9 ? 'near-limit' : ''}>
                {charCount}
              </span>
              /{maxLength}
            </div>
            <span id="prayer-hint" className="sr-only">
              Minimum 10 characters required
            </span>
          </div>

          {isAuthenticated && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={isSubmitting}
                  aria-describedby="anonymous-hint"
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  Post anonymously
                </span>
              </label>
              <p id="anonymous-hint" className="checkbox-hint">
                Your request will appear as "Anonymous" to others
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <p className="guest-notice" role="note">
              You are posting as a guest. Your request will appear as "Anonymous."
              <a href="/register"> Create an account</a> to post with your name.
            </p>
          )}

          <p className="privacy-notice" role="note">
            Your request will be visible to everyone on the prayer wall.
          </p>

          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || charCount < 10}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="sr-only">Posting</span>
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  Share Request
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
