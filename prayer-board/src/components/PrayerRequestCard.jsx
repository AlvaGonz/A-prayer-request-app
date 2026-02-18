import React, { useState, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, CheckCircle2, Trash2, EyeOff, Archive, MessageCircle } from 'lucide-react';
import PrayedButton from './PrayedButton';
import CommentSection from './CommentSection';
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
  
  const isAuthor = isAuthenticated && request.author === user?.id;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isAnswered = request.status === 'answered';
  
  const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });

  const handleStatusUpdate = (newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(request.id, newStatus);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this prayer request?')) {
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
              <span id={`prayer-author-${request.id}`} className="author-name">Anonymous</span>
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
            <span className="status-badge answered" aria-label="Prayer request answered">
              <CheckCircle2 size={14} aria-hidden="true" />
              Answered
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
            aria-label={showComments ? 'Hide comments' : `Show ${request.commentCount || 0} comments`}
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span aria-hidden="true">{request.commentCount || 0}</span>
          </button>
        </div>
        
        {(isAuthor || isAdmin) && (
          <div className="prayer-card-actions" role="group" aria-label="Prayer request actions">
            {isAuthor && !isAnswered && (
              <button
                className="action-btn mark-answered"
                onClick={() => handleStatusUpdate('answered')}
                aria-label="Mark prayer request as answered"
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>Mark Answered</span>
              </button>
            )}
            
            {isAdmin && (
              <>
                <button
                  className="action-btn hide"
                  onClick={() => handleStatusUpdate('hidden')}
                  aria-label="Hide prayer request"
                >
                  <EyeOff size={16} aria-hidden="true" />
                </button>
                
                <button
                  className="action-btn archive"
                  onClick={() => handleStatusUpdate('archived')}
                  aria-label="Archive prayer request"
                >
                  <Archive size={16} aria-hidden="true" />
                </button>
                
                <button
                  className="action-btn delete"
                  onClick={handleDelete}
                  aria-label="Delete prayer request"
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
