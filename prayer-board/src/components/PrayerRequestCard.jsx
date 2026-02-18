import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle2, Trash2, EyeOff, Archive, MessageCircle } from 'lucide-react';
import PrayedButton from './PrayedButton';
import CommentSection from './CommentSection';
import ShareButton from './ShareButton';
import { useAuth } from '../context/AuthContext';
import './PrayerRequestCard.css';

const PrayerRequestCard = ({
  request,
  onPrayed,
  onUpdateStatus,
  onDelete
}) => {
  const [showComments, setShowComments] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;

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

  return (
    <article
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

      <footer className="prayer-card-footer">
        <div className="prayer-card-actions-left">
          <PrayedButton
            requestId={request.id}
            initialCount={request.prayedCount}
            onPrayed={onPrayed}
          />

          <button
            className="action-btn comments-btn"
            onClick={() => setShowComments(!showComments)}
            aria-expanded={showComments}
            aria-controls={`comments-section-${request.id}`}
            aria-label={showComments ? t('prayerCard.hideComments') : t('prayerCard.showComments', { count: request.commentCount || 0 })}
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span aria-hidden="true">{request.commentCount || 0}</span>
          </button>

          {isAuthenticated && (
            <ShareButton requestId={request.id} />
          )}
        </div>

        {(isAuthor || isAdmin) && (
          <div className="prayer-card-actions" role="group" aria-label="Prayer request actions">
            {isAuthor && !isAnswered && (
              <button
                className="action-btn mark-answered"
                onClick={() => handleStatusUpdate('answered')}
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
                  <EyeOff size={16} aria-hidden="true" />
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
        isOpen={showComments}
        onToggle={() => setShowComments(!showComments)}
        requestAuthorId={request.author}
        id={`comments-section-${request.id}`}
      />
    </article>
  );
};

export default memo(PrayerRequestCard);
