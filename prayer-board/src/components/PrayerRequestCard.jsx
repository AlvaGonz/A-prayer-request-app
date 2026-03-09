import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle2, Trash2, Archive, MessageCircle } from 'lucide-react';
import { EyeToggleIcon } from './ui/animated-state-icons';
import { m } from 'framer-motion';
import PrayedButton from './PrayedButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';
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
    if (window.confirm(t('prayerCard.deleteConfirm'))) {
      if (onDelete) {
        onDelete(request.id);
      }
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
          setShowTestimonyForm(false);
          setTestimonyText('');
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
      {showTestimonyForm && (
        <div className="prayer-card__testimony-form">
          <textarea
            className="prayer-card__testimony-textarea"
            placeholder={t('prayerCard.testimonyPlaceholder')}
            value={testimonyText}
            onChange={(e) => setTestimonyText(e.target.value)}
            maxLength={1000}
            rows={3}
          />
          <div className="prayer-card__testimony-actions">
            <button
              className="action-btn mark-answered"
              onClick={handleSaveTestimony}
              disabled={markAnsweredMutation.isPending}
            >
              {t('prayerCard.save')}
            </button>
            <button
              className="action-btn"
              onClick={handleCancelTestimony}
            >
              {t('prayerCard.cancel')}
            </button>
          </div>
        </div>
      )}

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
            style={{ marginTop: 0 }}
          >
            <MessageCircle size={16} />
            {localCommentCount > 0 ? t('comments.title', { count: localCommentCount }) : t('prayerCard.addComment')}
          </button>

          {isAuthenticated && (
            <ShareButton requestId={request.id} />
          )}
        </div>

        {(isAuthor || isAdmin) && (
          <div className="prayer-card-actions" role="group" aria-label="Prayer request actions">
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

            {isAdmin && (
              <>
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

                <button
                  className="action-btn delete"
                  onClick={handleDelete}
                  aria-label={t('prayerCard.delete')}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </>
            )}
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
