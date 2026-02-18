import React, { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import './PrayedButton.css';

const PrayedButton = ({ requestId, initialCount, onPrayed }) => {
  const [count, setCount] = useState(initialCount);
  const [isPrayed, setIsPrayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const messageTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handlePray = async () => {
    if (isLoading) return;

    // For registered users, prevent duplicate prayers
    if (isAuthenticated && isPrayed) {
      return;
    }

    setIsLoading(true);

    // Optimistic update
    const newCount = count + 1;
    setCount(newCount);

    try {
      const result = await requestsAPI.pray(requestId, user);
      setIsPrayed(true);
      setShowMessage(true);

      // Hide message after 3 seconds
      messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 3000);

      if (onPrayed) {
        onPrayed(requestId, result.prayedCount);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCount(initialCount);
      console.error('Error praying:', error);
      alert(error.message || t('errors.pray'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prayed-button-container">
      <button
        className={`prayed-button ${isPrayed ? 'prayed' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handlePray}
        disabled={isLoading || (isAuthenticated && isPrayed)}
        aria-label={isPrayed ? t('prayerCard.youPrayedAria') : t('prayerCard.prayAria')}
      >
        <Heart
          size={18}
          className={`prayed-icon ${isPrayed ? 'animate' : ''}`}
        />
        <span className="prayed-count">{count}</span>
        <span className="prayed-text">
          {isPrayed ? t('prayerCard.prayed') : t('prayerCard.iPrayed')}
        </span>
      </button>

      {showMessage && (
        <div className="prayed-message animate-in">
          <span className="prayed-message-text">
            {t('notifications.prayed')}
          </span>
          <button
            className="prayed-message-close"
            onClick={() => setShowMessage(false)}
            aria-label={t('common.close')}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PrayedButton;
