import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { HeartIcon } from './ui/animated-state-icons';
import { useTranslation } from 'react-i18next';
import { usePrayMutation } from '../hooks/usePrayMutation';
import { safeStorage } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import Sparkles from './Sparkles';
import { InteractiveHoverButton } from './ui/InteractiveHoverButton';
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

  const prayMutation = usePrayMutation(requestId);

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

  const [showSparkles, setShowSparkles] = useState(false);
  const { t } = useTranslation();
  const { showToast } = useToast();

  // Sync prop updates if they change externally (e.g. from cache invalidate)
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
        const result = await prayMutation.mutateAsync({ isPraying: true });

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
        const result = await prayMutation.mutateAsync({ isPraying: false });
        showToast(t('notifications.prayed'), 'success');
        setShowSparkles(true);

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
        showToast(t('auth.errors.rateLimit'), 'warning');
      } else {
        showToast(error.message || t('errors.pray'), 'error');
      }
    }
  };

  // Build button text with count
  const buttonText = `${isPrayed ? t('prayerCard.prayed') : t('prayerCard.iPrayed')} ${count}`;

  return (
    <div className="prayed-button-container">
      <div className="prayed-button-wrapper">
        <HeartIcon
          size={22}
          className={`prayed-button-heart-icon ${isPrayed ? 'animate' : ''}`}
          isFilled={isPrayed}
        />
        <InteractiveHoverButton
          text={buttonText}
          onClick={handlePray}
          disabled={prayMutation.isPending}
          aria-label={isPrayed ? t('prayerCard.youPrayedAria') : t('prayerCard.prayAria')}
          className={`prayed-btn-interactive ${isPrayed ? 'is-prayed' : ''}`}
        />
        <Sparkles isTriggered={showSparkles} onComplete={() => setShowSparkles(false)} />
      </div>
    </div>
  );
};

export default PrayedButton;
