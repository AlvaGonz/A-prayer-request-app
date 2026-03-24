import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { m, AnimatePresence } from 'framer-motion';
import { Flame, X, CheckCircle2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './PrayerDetailModal.css';

/**
 * PrayerDetailModal - Full screen / bottom sheet view for prayer requests
 * Premium glassmorphism and spring animations optimized for mobile.
 */
const PrayerDetailModal = ({
  isOpen,
  onOpenChange,
  request,
  timeAgo,
  isAnswered,
  children
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 640px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (!request) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <m.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <m.div
                className="modal-content"
                style={{ pointerEvents: 'auto' }}
                initial={isMobile ? { y: '100%', opacity: 1 } : { y: '-45%', x: '-50%', opacity: 0, scale: 0.95 }}
                animate={isMobile ? { y: 0, opacity: 1 } : { y: '-50%', x: '-50%', opacity: 1, scale: 1 }}
                exit={isMobile ? { y: '100%', opacity: 1 } : { y: '-45%', x: '-50%', opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 1 }}
                aria-describedby="prayer-detail-description"
              >
                <Dialog.Title className="sr-only">
                    {t('prayerCard.fullPrayer')}
                  </Dialog.Title>

                  <div className="modal-header">
                    <div className="modal-author-info">
                      {request.isAnonymous ? (
                        <div className="modal-avatar anonymous">
                          <User size={20} className="user-icon" strokeWidth={2.5} />
                        </div>
                      ) : (
                        <div className="modal-avatar">
                          {request.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="modal-author-name">
                          {request.isAnonymous ? t('prayerCard.anonymous') : request.authorName}
                        </div>
                        <div className="modal-time-ago">
                          {isAnswered && (
                            <CheckCircle2 size={14} color="var(--color-accent-gold)" />
                          )}
                          <span id="prayer-detail-description">{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Dialog.Close asChild>
                      <button className="modal-close-btn" aria-label={t('common.close') || 'Close'}>
                        <X size={20} strokeWidth={2.5} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="modal-scroll-area">
                    <p className="modal-prayer-text">{request.body}</p>
                    
                    {isAnswered && request.testimony && (
                      <div className="modal-testimony-area">
                        <div className="modal-testimony-header">
                          <Flame size={18} className="flame-icon" strokeWidth={2.5} />
                          {t('prayerCard.testimony')}
                        </div>
                        <div className="modal-testimony-text">
                          "{request.testimony}"
                        </div>
                      </div>
                    )}
                  </div>

                  {children && (
                    <div className="modal-footer">
                      <div className="modal-actions">
                        {children}
                      </div>
                    </div>
                  )}
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default React.memo(PrayerDetailModal);
