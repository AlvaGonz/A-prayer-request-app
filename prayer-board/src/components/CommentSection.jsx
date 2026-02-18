import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import CommentItem from './CommentItem';
import { commentsAPI } from '../api';
import './CommentSection.css';

const CommentSection = ({ requestId, isOpen, onToggle, requestAuthorId, id }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { socket, joinRequest, leaveRequest, emitToRequest, localEventEmitter } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const commentsEndRef = useRef(null);
  const notificationTimeoutsRef = useRef([]);

  // Load comments when opened
  useEffect(() => {
    if (isOpen) {
      loadComments();
      joinRequest(requestId);
    } else {
      leaveRequest(requestId);
    }

    return () => {
      leaveRequest(requestId);
    };
  }, [isOpen, requestId, joinRequest, leaveRequest]);

  // Listen for real-time events
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (data) => {
      if (data.requestId === requestId) {
        setComments(prev => [...prev, {
          id: data.id,
          body: data.body,
          authorName: data.authorName,
          authorId: data.authorId,
          createdAt: data.createdAt,
          canDelete: data.authorId === user?.id || user?.role === 'admin'
        }]);
      }
    };

    const handleCommentDeleted = (data) => {
      if (data.requestId === requestId) {
        setComments(prev => prev.filter(c => c.id !== data.commentId));
      }
    };

    const handleNotification = (notification) => {
      // Only show notifications for the current user
      if (notification.targetUserId === user?.id && notification.requestId === requestId) {
        setNotifications(prev => [...prev, notification]);
        const timeoutId = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n !== notification));
        }, 5000);
        notificationTimeoutsRef.current.push(timeoutId);
      }
    };

    socket.on('new-comment', handleNewComment);
    socket.on('comment-deleted', handleCommentDeleted);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('new-comment', handleNewComment);
      socket.off('comment-deleted', handleCommentDeleted);
      socket.off('notification', handleNotification);
      // Clear notification timeouts
      notificationTimeoutsRef.current.forEach(id => clearTimeout(id));
      notificationTimeoutsRef.current = [];
    };
  }, [socket, requestId, user]);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (commentsEndRef.current && isOpen) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, isOpen]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await commentsAPI.getByRequest(requestId);
      setComments(data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const result = await commentsAPI.create(requestId, newComment, user);
      setNewComment('');

      // Emit real-time event
      emitToRequest(requestId, 'new-comment', {
        id: result.comment.id,
        body: result.comment.body,
        authorName: result.comment.authorName,
        authorId: result.comment.authorId,
        createdAt: result.comment.createdAt,
        targetUserId: requestAuthorId // For notification
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(t('comments.deleteConfirm'))) return;

    try {
      await commentsAPI.delete(commentId, user);

      // Emit real-time event
      emitToRequest(requestId, 'comment-deleted', { commentId });
    } catch (error) {
      alert(t('comments.deleteError'));
    }
  };

  if (!isOpen) {
    return (
      <button className="comments-toggle-btn" onClick={onToggle}>
        <MessageCircle size={16} />
        {comments.length > 0 ? t('comments.title', { count: comments.length }) : t('prayerCard.addComment')}
      </button>
    );
  }

  return (
    <section
      className="comment-section"
      id={id}
      aria-label={`Comments section for prayer request. ${comments.length} comments.`}
    >
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map((notif, idx) => (
            <div key={idx} className="notification-toast">
              {notif.message}
            </div>
          ))}
        </div>
      )}

      <div className="comment-section-header">
        <h4>{t('comments.title', { count: comments.length })}</h4>
        <button className="close-comments" onClick={onToggle} aria-label={t('comments.close')}>
          <X size={18} />
        </button>
      </div>

      <div className="comments-list">
        {loading ? (
          <p className="loading-text">{t('comments.loading')}</p>
        ) : comments.length === 0 ? (
          <p className="empty-comments">
            {t('comments.empty')}
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              canDelete={comment.authorId === user?.id || user?.role === 'admin'}
            />
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comments.placeholder')}
            maxLength={500}
            rows={2}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="submit-comment-btn"
            aria-label={t('comments.send')}
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">{t('header.login')}</a> {t('comments.loginToCommentSuffix') || 'to add a comment'}
        </p>
      )}
    </section>
  );
};

export default CommentSection;
