import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { HeartIcon } from './ui/animated-state-icons';
import { useTranslation } from 'react-i18next';
import { usePrayMutation } from '../hooks/usePrayMutation';
import { useAuth } from '../context/AuthContext';
import { safeStorage } from '../utils/storage';
import Sparkles from './Sparkles';
import { RippleButton } from './ui/RippleButton';
import './RipplePrayedButton.css';

/**
 * RipplePrayedButton - A prayer button with ripple effect and heart animation
 * Tracks prayer count and user interactions with localStorage persistence
 */
const RipplePrayedButton = ({ requestId, initialCount, onPrayed }) => {
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

  const prayMutation = usePrayMutation(requestId);
  const [showMessage, setShowMessage] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const messageTimeoutRef = useRef(null);

  // Sync with localStorage on mount and when requestId changes
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // Sync prop updates if they change externally
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handlePray = async () => {
    if (prayMutation.isPending) return;

    // Optimistic update
    const prevPrayed = isPrayed;
    const prevCount = count;
    const newCount = prevPrayed ? Math.max(0, count - 1) : count + 1;

    setCount(newCount);
    setIsPrayed(!prevPrayed);

    try {
      if (prevPrayed) {
        // Un-pray
        const result = await prayMutation.mutateAsync({ isPraying: true });
        setShowMessage(false);
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

        // Remove from localStorage
        try {
          const stored = safeStorage.getItem('prayedRequests');
          let prayedRequests = stored ? JSON.parse(stored) : [];
          prayedRequests = prayedRequests.filter(id => id !== requestId);
          safeStorage.setItem('prayedRequests', JSON.stringify(prayedRequests));
        } catch (e) {
          console.error('Error writing to local storage', e);
        }

        if (onPrayed) {
          onPrayed(requestId, result.prayedCount || newCount);
        }
      } else {
        // Pray
        const result = await prayMutation.mutateAsync({ isPraying: false });
        setShowMessage(true);
        setShowSparkles(true);

        // Save to localStorage
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

        // Hide message after 10 seconds
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 10000);

        if (onPrayed) {
          onPrayed(requestId, result.prayedCount || newCount);
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setCount(prevCount);
      setIsPrayed(prevPrayed);
      console.error('Error praying/unpraying:', error);
      if (error.statusCode === 429) {
        alert(t('auth.errors.rateLimit'));
      } else {
        alert(error.message || t('errors.pray'));
      }
    }
  };

  return (
    <div className="ripple-prayed-button-container">
      <RippleButton
        onClick={handlePray}
        disabled={prayMutation.isPending}
        className={`ripple-prayed-button ${isPrayed ? 'prayed' : ''} ${prayMutation.isPending ? 'loading' : ''}`}
        aria-label={isPrayed ? t('prayerCard.youPrayedAria') : t('prayerCard.prayAria')}
        rippleColor="rgba(221, 179, 104, 0.4)"
      >
        <HeartIcon
          size={22}
          className={`prayed-icon ${isPrayed ? 'animate' : ''}`}
          isFilled={isPrayed}
        />
        <span className="prayed-count">{count}</span>
        <div className="prayed-label-stack">
          {t('prayerCard.iPrayed').split(' ').map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
        <Sparkles isTriggered={showSparkles} onComplete={() => setShowSparkles(false)} />
      </RippleButton>

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
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RipplePrayedButton;
