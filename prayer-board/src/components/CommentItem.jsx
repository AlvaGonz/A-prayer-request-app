import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Trash2, Pencil, X, Check } from 'lucide-react';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete, onEdit, canDelete, canEdit }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('es') ? es : enUS;
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale
  });

  const handleSave = () => {
    if (editBody.trim() && editBody !== comment.body) {
      onEdit(comment.id, editBody.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditBody(comment.body);
    setIsEditing(false);
  };

  return (
    <div className={`comment-item ${comment.isPending ? 'pending' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          {comment.authorId ? (
            <div className="comment-avatar">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
          ) : null}
          <span className="comment-author-name">
            {!comment.authorId ? t('comments.anonymous_author') : comment.authorName}
          </span>
        </div>
        <span className="comment-time">
          {timeAgo}
          {comment.isEdited && <span className="comment-edited-mark"> (editado)</span>}
        </span>
      </div>

      <div className="comment-body-container">
        {isEditing ? (
          <div className="comment-edit-state">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              maxLength={300}
              autoFocus
            />
            <div className="comment-edit-actions">
              <button type="button" onClick={handleCancel} className="comment-cancel-btn"><X size={14} /></button>
              <button type="button" onClick={handleSave} className="comment-save-btn"><Check size={14} /></button>
            </div>
          </div>
        ) : (
          <p className="comment-body">{comment.body}</p>
        )}
      </div>

      <div className="comment-actions">
        {canEdit && !comment.isPending && !isEditing && (
          <button
            title="Edit"
            onClick={() => setIsEditing(true)}
            className="comment-edit-btn"
          >
            <Pencil size={14} />
          </button>
        )}
        {canDelete && !comment.isPending && !isEditing && (
          <button
            title="Delete"
            className="comment-delete-btn"
            onClick={() => onDelete(comment.id)}
            aria-label={t('comments.deleteAria')}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(CommentItem);
