import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RippleButton } from './ui/RippleButton';
import './RippleCommentButton.css';

/**
 * RippleCommentButton - A comments toggle button with ripple effect
 * 
 * @param {Object} props
 * @param {number} props.commentCount - Number of comments to display
 * @param {boolean} props.isOpen - Whether comments section is open
 * @param {Function} props.onClick - Click handler to toggle comments
 */
const RippleCommentButton = ({ commentCount = 0, isOpen = false, onClick }) => {
  const { t } = useTranslation();

  const buttonText = commentCount > 0 
    ? t('comments.title', { count: commentCount })
    : t('prayerCard.addComment');

  return (
    <RippleButton
      onClick={onClick}
      className={`ripple-comment-button ${isOpen ? 'is-open' : ''}`}
      aria-label={isOpen ? t('comments.hide') : t('comments.show')}
      aria-expanded={isOpen}
      rippleColor="rgba(100, 149, 237, 0.3)"
    >
      <MessageCircle size={18} className="comment-icon" />
      <span className="comment-text">{buttonText}</span>
    </RippleButton>
  );
};

export default RippleCommentButton;
