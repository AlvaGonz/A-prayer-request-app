import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RippleButton } from './ui/RippleButton';
import './RippleShareButton.css';

/**
 * RippleShareButton - A share button with ripple effect and copy confirmation
 * 
 * @param {Object} props
 * @param {string} props.requestId - The prayer request ID to share
 * @param {string} [props.shareUrl] - Optional custom share URL
 */
const RippleShareButton = ({ requestId, shareUrl }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = shareUrl || `${window.location.origin}/shared/${requestId}`;
    
    try {
      // Try Web Share API first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: t('share.title', 'Prayer Request'),
          text: t('share.message', 'Check out this prayer request'),
          url: url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled or error
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Try clipboard as final fallback
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
        }
      }
    }
  };

  return (
    <RippleButton
      onClick={handleShare}
      className={`ripple-share-button ${copied ? 'copied' : ''}`}
      aria-label={t('prayerCard.share')}
      rippleColor="rgba(144, 238, 144, 0.3)"
    >
      {copied ? (
        <>
          <Check size={18} className="share-icon copied" />
          <span className="share-text">{t('common.copied', 'Copied!')}</span>
        </>
      ) : (
        <>
          <Share2 size={18} className="share-icon" />
          <span className="share-text">{t('prayerCard.share', 'Share')}</span>
        </>
      )}
    </RippleButton>
  );
};

export default RippleShareButton;
