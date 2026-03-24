import React, { useState } from 'react';
import { Share2, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { shareAPI } from '../api';
import { useToast } from '../context/ToastContext';
import { RippleButton } from './ui/RippleButton';
import './RippleShareButton.css';

/**
 * RippleShareButton - A share button with ripple effect and copy confirmation
 * Generates a share link via API call to get the proper shareToken
 * 
 * @param {string} props.requestId - The ID of the prayer request to share
 */
const RippleShareButton = ({ requestId }) => {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    const { showToast } = useToast();

    const handleShare = async (e) => {
        if (e) e.stopPropagation();
        setLoading(true);
        try {
            // Generate share link via API to get proper shareToken
            const data = await shareAPI.generateLink(requestId);
            const fullUrl = `${window.location.origin}${data.shareUrl}`;

            // Try native share first (mobile), fallback to clipboard
            if (navigator.share) {
                await navigator.share({
                    title: t('share.titleArg'),
                    text: t('share.text'),
                    url: fullUrl
                });
            } else {
                await navigator.clipboard.writeText(fullUrl);
                setCopied(true);
                showToast(t('share.copied'), 'success');
                setTimeout(() => setCopied(false), 2500);
            }
        } catch (error) {
            // User cancelled share or clipboard failed
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                showToast(t('share.error'), 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <RippleButton
            className={`ripple-share-button ${copied ? 'copied' : ''}`}
            onClick={handleShare}
            disabled={loading}
            aria-label={copied ? t('share.blinkCopied') || t('share.copied') : t('share.ariaLabel')}
            rippleColor="rgba(221, 179, 104, 0.3)"
        >
            <div className="share-icon">
                {loading ? (
                    <Loader2 size={16} className="spinner" aria-hidden="true" />
                ) : copied ? (
                    <Check size={16} aria-hidden="true" />
                ) : (
                    <Share2 size={16} aria-hidden="true" />
                )}
            </div>
            <span className="share-text">{copied ? t('share.copied') : t('share.button')}</span>
        </RippleButton>
    );
};

export default RippleShareButton;
