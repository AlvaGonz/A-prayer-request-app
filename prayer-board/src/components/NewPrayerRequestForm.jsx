import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import './NewPrayerRequestForm.css';

const NewPrayerRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const [body, setBody] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const maxLength = 1000;
  const charCount = body.length;

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
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share a Prayer Request</h2>
          <button 
            className="close-btn" 
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

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
            />
            <div className="char-counter">
              <span className={charCount > maxLength * 0.9 ? 'near-limit' : ''}>
                {charCount}
              </span>
              /{maxLength}
            </div>
          </div>

          {isAuthenticated && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  Post anonymously
                </span>
              </label>
              <p className="checkbox-hint">
                Your request will appear as "Anonymous" to others
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <p className="guest-notice">
              You are posting as a guest. Your request will appear as "Anonymous."
              <a href="/register"> Create an account</a> to post with your name.
            </p>
          )}

          <p className="privacy-notice">
            Your request will be visible to everyone on the prayer wall.
          </p>

          {error && (
            <div className="error-message">
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
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send size={16} />
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
