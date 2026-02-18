import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete, canDelete }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale
  });

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <div className="comment-avatar">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <span className="comment-author-name">{comment.authorName}</span>
        </div>
        <span className="comment-time">{timeAgo}</span>
      </div>

      <p className="comment-body">{comment.body}</p>

      {canDelete && (
        <button
          className="comment-delete-btn"
          onClick={() => onDelete(comment.id)}
          aria-label={t('comments.deleteAria')}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default memo(CommentItem);
