import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, CheckCircle2, Trash2, EyeOff, Archive } from 'lucide-react';
import PrayedButton from './PrayedButton';
import { useAuth } from '../context/AuthContext';
import './PrayerRequestCard.css';

const PrayerRequestCard = ({ 
  request, 
  onPrayed, 
  onUpdateStatus, 
  onDelete 
}) => {
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
    <div className={`prayer-card ${isAnswered ? 'answered' : ''}`}>
      <div className="prayer-card-header">
        <div className="prayer-card-author">
          {request.isAnonymous ? (
            <>
              <div className="author-avatar anonymous">
                <User size={16} />
              </div>
              <span className="author-name">Anonymous</span>
            </>
          ) : (
            <>
              <div className="author-avatar">
                {request.authorName.charAt(0).toUpperCase()}
              </div>
              <span className="author-name">{request.authorName}</span>
            </>
          )}
        </div>
        
        <div className="prayer-card-meta">
          {isAnswered && (
            <span className="status-badge answered">
              <CheckCircle2 size={14} />
              Answered
            </span>
          )}
          <span className="time-ago">{timeAgo}</span>
        </div>
      </div>
      
      <div className="prayer-card-body">
        <p className="prayer-text">{request.body}</p>
      </div>
      
      <div className="prayer-card-footer">
        <PrayedButton 
          requestId={request.id} 
          initialCount={request.prayedCount}
          onPrayed={onPrayed}
        />
        
        {(isAuthor || isAdmin) && (
          <div className="prayer-card-actions">
            {isAuthor && !isAnswered && (
              <button
                className="action-btn mark-answered"
                onClick={() => handleStatusUpdate('answered')}
                title="Mark as answered"
              >
                <CheckCircle2 size={16} />
                <span>Mark Answered</span>
              </button>
            )}
            
            {isAdmin && (
              <>
                <button
                  className="action-btn hide"
                  onClick={() => handleStatusUpdate('hidden')}
                  title="Hide request"
                >
                  <EyeOff size={16} />
                </button>
                
                <button
                  className="action-btn archive"
                  onClick={() => handleStatusUpdate('archived')}
                  title="Archive request"
                >
                  <Archive size={16} />
                </button>
                
                <button
                  className="action-btn delete"
                  onClick={handleDelete}
                  title="Delete request"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestCard;
