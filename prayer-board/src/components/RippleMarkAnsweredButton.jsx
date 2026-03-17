import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RippleButton } from './ui/RippleButton';
import './RippleMarkAnsweredButton.css';

/**
 * RippleMarkAnsweredButton - A button to mark prayers as answered with ripple effect
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler to open testimony form
 * @param {boolean} [props.disabled] - Whether the button is disabled
 */
const RippleMarkAnsweredButton = ({ onClick, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <RippleButton
      data-testid="mark-answered-btn"
      onClick={onClick}
      disabled={disabled}
      className="ripple-mark-answered-button"
      aria-label={t('prayerCard.markAnswered')}
      rippleColor="rgba(74, 222, 128, 0.3)"
    >
      <CheckCircle2 size={18} className="mark-answered-icon" />
      <span className="mark-answered-text">{t('prayerCard.markAnswered')}</span>
    </RippleButton>
  );
};

export default RippleMarkAnsweredButton;
