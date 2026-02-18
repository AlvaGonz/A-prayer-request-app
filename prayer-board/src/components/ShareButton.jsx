import React, { useState } from 'react';
import { Share2, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { shareAPI } from '../api';
import './ShareButton.css';

const ShareButton = ({ requestId }) => {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const handleShare = async () => {
        setLoading(true);
        try {
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
                setTimeout(() => setCopied(false), 2500);
            }
        } catch (error) {
            // User cancelled share or clipboard failed
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
                alert(t('share.error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`action-btn share-btn ${copied ? 'copied' : ''}`}
            onClick={handleShare}
            disabled={loading}
            aria-label={copied ? t('share.blinkCopied') || t('share.copied') : t('share.ariaLabel')}
        >
            {loading ? (
                <Loader2 size={16} className="spinner" aria-hidden="true" />
            ) : copied ? (
                <Check size={16} aria-hidden="true" />
            ) : (
                <Share2 size={16} aria-hidden="true" />
            )}
            <span>{copied ? t('share.copied') : t('share.button')}</span>
        </button>
    );
};

export default ShareButton;
