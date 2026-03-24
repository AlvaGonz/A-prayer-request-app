import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle2, Trash2, Archive, ChevronDown } from 'lucide-react';
import { EyeToggleIcon } from './ui/animated-state-icons';
import { m, AnimatePresence } from 'framer-motion';
import RipplePrayedButton from './RipplePrayedButton';
import RippleShareButton from './RippleShareButton';
import RippleCommentButton from './RippleCommentButton';
import RippleMarkAnsweredButton from './RippleMarkAnsweredButton';
import CommentSection from './CommentSection';
import Celebration from './ui/Celebration';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useAuth } from '../context/AuthContext';
import { useMarkAnswered } from '../hooks/usePrayerRequests';
import './PrayerRequestCard.css';

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.95,
    rotateX: 5
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  }
};

const PrayerRequestCard = ({
  request,
  onPrayed,
  onUpdateStatus,
  onDelete,
  index = 0
}) => {
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;
  const markAnsweredMutation = useMarkAnswered();

  const [showComments, setShowComments] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(request.commentCount || 0);
  const [showTestimonyForm, setShowTestimonyForm] = useState(false);
  const [testimonyText, setTestimonyText] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const TEXT_CLAMP_THRESHOLD = 200;

  React.useEffect(() => {
    setLocalCommentCount(request.commentCount || 0);
  }, [request.commentCount]);

  const isAuthor = isAuthenticated && request.author === user?.id;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isAnswered = request.status === 'answered';

  const timeAgo = formatDistanceToNow(new Date(request.createdAt), {
    addSuffix: true,
    locale
  });

  const handleStatusUpdate = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(request.id, newStatus);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(request.id);
    }
  };

  const handleMarkAnswered = () => {
    setShowTestimonyForm(true);
  };

  const handleSaveTestimony = () => {
    markAnsweredMutation.mutate(
      { requestId: request.id, testimony: testimonyText || null },
      {
        onSuccess: () => {
          setCelebrate(true);
          setIsSuccessState(true);
          
          // Show celebration/success for 2 seconds before closing
          setTimeout(() => {
            setShowTestimonyForm(false);
            setTestimonyText('');
            setCelebrate(false);
            setIsSuccessState(false);
          }, 2500);
        },
        onError: (err) => {
          alert(err.message || 'Failed to mark as answered');
        }
      }
    );
  };

  const handleCancelTestimony = () => {
    setShowTestimonyForm(false);
    setTestimonyText('');
  };

  return (
    <m.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ delay: index * 0.08 }}
      className={`prayer-card ${isAnswered ? 'answered' : ''}`}
      aria-labelledby={`prayer-author-${request.id}`}
      style={{ perspective: 1000 }}
    >
      <header className="prayer-card-header">
        <div className="prayer-card-author">
          {request.isAnonymous ? (
            <>
              <div className="author-avatar anonymous" aria-hidden="true">
                <User size={16} />
              </div>
              <span id={`prayer-author-${request.id}`} className="author-name">{t('prayerCard.anonymous')}</span>
            </>
          ) : (
            <>
              <div className="author-avatar" aria-hidden="true">
                {request.authorName.charAt(0).toUpperCase()}
              </div>
              <span id={`prayer-author-${request.id}`} className="author-name">{request.authorName}</span>
            </>
          )}
        </div>

        <div className="prayer-card-meta">
          {isAnswered && (
            <span className="status-badge answered" aria-label={t('prayerCard.answered')}>
              <CheckCircle2 size={14} aria-hidden="true" />
              {t('prayerCard.answered')}
            </span>
          )}
          <time className="time-ago" dateTime={request.createdAt}>
            {timeAgo}
          </time>
        </div>
      </header>

      <div className="prayer-card-body">
        <p className={`prayer-text ${!isExpanded && request.body.length > TEXT_CLAMP_THRESHOLD ? 'clamped' : ''}`}>
          {request.body}
        </p>
        {request.body.length > TEXT_CLAMP_THRESHOLD && (
          <button
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? t('prayerCard.readLess') : t('prayerCard.readMore')}</span>
            <ChevronDown
              size={14}
              className={`read-more-icon ${isExpanded ? 'rotated' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Testimony display for answered prayers */}
      {isAnswered && request.testimony && (
        <div className="prayer-card__testimony-text">
          <strong>{t('prayerCard.testimony')}:</strong>
          <p>{request.testimony}</p>
        </div>
      )}

      {/* Inline testimony form */}
      <AnimatePresence>
        {showTestimonyForm && (
          <m.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="prayer-card__testimony-form"
          >
            {isSuccessState ? (
              <m.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="testimony-success-message"
              >
                <div className="success-icon-ring">
                  <CheckCircle2 size={32} color="var(--color-accent-gold)" />
                </div>
                <p>{t('prayerCard.answeredSuccess') || 'Praise God! Testimony saved.'}</p>
                <Celebration isVisible={celebrate} />
              </m.div>
            ) : (
              <>
                <textarea
                  className="prayer-card__testimony-textarea"
                  placeholder={t('prayerCard.testimonyPlaceholder')}
                  value={testimonyText}
                  onChange={(e) => setTestimonyText(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  disabled={markAnsweredMutation.isPending}
                />
                <div className="prayer-card__testimony-actions">
                  <button
                    data-testid="save-testimony-btn"
                    className="action-btn mark-answered"
                    onClick={handleSaveTestimony}
                    disabled={markAnsweredMutation.isPending || !testimonyText.trim()}
                  >
                    {markAnsweredMutation.isPending ? (
                      <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <CheckCircle2 size={16} />
                      </m.div>
                    ) : t('prayerCard.save')}
                  </button>
                  <button
                    className="action-btn"
                    onClick={handleCancelTestimony}
                    disabled={markAnsweredMutation.isPending}
                  >
                    {t('prayerCard.cancel')}
                  </button>
                </div>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <footer className="prayer-card-footer">
        <div className="prayer-card-actions-left">
          <RipplePrayedButton
            requestId={request.id}
            initialCount={request.prayedCount}
            onPrayed={onPrayed}
          />

          <RippleCommentButton
            commentCount={localCommentCount}
            isOpen={showComments}
            onClick={() => setShowComments(!showComments)}
          />

          <RippleShareButton requestId={request.id} />

          {isAuthor && !isAnswered && !showTestimonyForm && (
            <RippleMarkAnsweredButton
              onClick={handleMarkAnswered}
            />
          )}
        </div>

        {isAdmin && (
          <div className="prayer-card-actions" role="group" aria-label="Prayer request actions">
            <button
              className="action-btn hide"
              onClick={() => handleStatusUpdate('hidden')}
              aria-label={t('prayerCard.hide')}
            >
              <EyeToggleIcon size={18} isHidden={true} />
            </button>

            <button
              className="action-btn archive"
              onClick={() => handleStatusUpdate('archived')}
              aria-label={t('prayerCard.archive')}
            >
              <Archive size={16} aria-hidden="true" />
            </button>

            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button
                  className="action-btn delete"
                  aria-label={t('prayerCard.delete')}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="alert-dialog-overlay" />
                <AlertDialog.Content className="alert-dialog-content">
                  <AlertDialog.Title className="alert-dialog-title">
                    {t('prayerCard.deleteConfirm')}
                  </AlertDialog.Title>
                  <AlertDialog.Description className="alert-dialog-description">
                    {t('prayerCard.deleteWarning') || "This action cannot be undone."}
                  </AlertDialog.Description>
                  <div className="alert-dialog-actions">
                    <AlertDialog.Cancel asChild>
                      <button className="action-btn" style={{ height: 'auto', padding: '10px 16px', width: 'auto' }}>
                        {t('prayerCard.cancel')}
                      </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button 
                        className="action-btn delete" 
                        style={{ height: 'auto', padding: '10px 16px', width: 'auto', borderColor: 'var(--color-accent-red)', color: 'var(--color-accent-red)' }} 
                        onClick={handleDelete}
                      >
                        {t('prayerCard.delete')}
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        )}
      </footer>

      <CommentSection
        requestId={request.id}
        requestAuthorId={request.author}
        initialCommentCount={request.commentCount || 0}
        isOpen={showComments}
        onToggle={() => setShowComments(!showComments)}
        onCommentCountUpdate={setLocalCommentCount}
        id={`comments-${request.id}`}
      />
    </m.article>
  );
};

export default memo(PrayerRequestCard);
