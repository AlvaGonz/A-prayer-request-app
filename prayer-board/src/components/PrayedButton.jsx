import React, { useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { safeStorage } from '../utils/storage';
import './PrayedButton.css';

const PrayedButton = ({ requestId, initialCount, onPrayed }) => {
  const [count, setCount] = useState(initialCount);
  const [isPrayed, setIsPrayed] = useState(() => {
    try {
      const stored = safeStorage.getItem('prayedRequests');
      if (stored) {
        const prayedRequests = JSON.parse(stored);
        return Array.isArray(prayedRequests) && prayedRequests.includes(requestId);
      }
    } catch (e) {
      console.error('Error reading from local storage', e);
    }
    return false;
  });

  useEffect(() => {
    try {
      const stored = safeStorage.getItem('prayedRequests');
      if (stored) {
        const prayedRequests = JSON.parse(stored);
        if (Array.isArray(prayedRequests) && prayedRequests.includes(requestId)) {
          setIsPrayed(true);
        } else {
          setIsPrayed(false);
        }
      }
    } catch (e) {
      console.error('Error reading from local storage', e);
    }
  }, [requestId]);
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

    setIsLoading(true);

    // Optimistic update
    const newCount = isPrayed ? Math.max(0, count - 1) : count + 1;
    setCount(newCount);

    try {
      if (isPrayed) {
        const result = await requestsAPI.unpray(requestId, user);
        setIsPrayed(false);
        setShowMessage(false);

        try {
          const stored = safeStorage.getItem('prayedRequests');
          let prayedRequests = stored ? JSON.parse(stored) : [];
          prayedRequests = prayedRequests.filter(id => id !== requestId);
          safeStorage.setItem('prayedRequests', JSON.stringify(prayedRequests));
        } catch (e) {
          console.error('Error writing to local storage', e);
        }

        if (onPrayed) {
          onPrayed(requestId, result.prayedCount);
        }
      } else {
        const result = await requestsAPI.pray(requestId, user);
        setIsPrayed(true);
        setShowMessage(true);

        // Save to local storage
        try {
          const stored = safeStorage.getItem('prayedRequests');
          const prayedRequests = stored ? JSON.parse(stored) : [];
          if (!prayedRequests.includes(requestId)) {
            prayedRequests.push(requestId);
            safeStorage.setItem('prayedRequests', JSON.stringify(prayedRequests));
          }
        } catch (e) {
          console.error('Error writing to local storage', e);
        }

        // Hide message after 7 seconds
        messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 7000);

        if (onPrayed) {
          onPrayed(requestId, result.prayedCount);
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setCount(initialCount);
      console.error('Error praying/unpraying:', error);
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
        disabled={isLoading}
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
