import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle2, Trash2, Archive, MessageCircle } from 'lucide-react';
import { EyeToggleIcon } from './ui/animated-state-icons';
import { m, AnimatePresence } from 'framer-motion';
import PrayedButton from './PrayedButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';
import Celebration from './ui/Celebration';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useAuth } from '../context/AuthContext';
import { useMarkAnswered } from '../hooks/usePrayerRequests';
import './PrayerRequestCard.css';

const PrayerRequestCard = ({
  request,
  onPrayed,
  onUpdateStatus,
  onDelete
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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`prayer-card ${isAnswered ? 'answered' : ''}`}
      aria-labelledby={`prayer-author-${request.id}`}
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
        <p className="prayer-text">{request.body}</p>
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
          <PrayedButton
            requestId={request.id}
            initialCount={request.prayedCount}
            onPrayed={onPrayed}
          />

          <button
            className="comments-toggle-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={16} />
            <span>{localCommentCount > 0 ? t('comments.title', { count: localCommentCount }) : t('prayerCard.addComment')}</span>
          </button>

          <ShareButton requestId={request.id} />

          {isAuthor && !isAnswered && !showTestimonyForm && (
            <button
              className="action-btn mark-answered"
              onClick={handleMarkAnswered}
              aria-label={t('prayerCard.markAnswered')}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{t('prayerCard.markAnswered')}</span>
            </button>
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
