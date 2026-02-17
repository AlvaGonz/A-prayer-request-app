import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete, canDelete }) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

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
          aria-label="Delete comment"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default CommentItem;
