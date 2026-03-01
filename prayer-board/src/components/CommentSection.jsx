import React, { useState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { MessageCircle, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import CommentItem from './CommentItem';
import { commentsAPI } from '../api';
import './CommentSection.css';

const CommentSection = ({ requestId, isOpen, onToggle, requestAuthorId, id, initialCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { socket, joinRequest, leaveRequest, emitToRequest, localEventEmitter } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const commentsEndRef = useRef(null);
  const notificationTimeoutsRef = useRef([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isValid }
  } = useForm({
    defaultValues: { newComment: '' },
    mode: 'onChange'
  });

  const newCommentContent = useWatch({ control, name: 'newComment', defaultValue: '' });

  // Generate guestId mirroring PrayedButton logic
  const guestId = React.useMemo(() => {
    let id;
    try {
      id = localStorage.getItem('prayer_guest_comment_id');
    } catch (e) { }
    return id || Date.now().toString(36);
  }, []);

  useEffect(() => {
    import('../utils/storage').then(({ safeStorage }) => {
      let id = safeStorage.getItem('prayer_guest_comment_id');
      if (!id) {
        id = window.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
        safeStorage.setItem('prayer_guest_comment_id', id);
      }
    });
  }, []);

  // Quick comment options
  const quickOptions = [
    { text: t('comments.quick.praying') },
    { text: t('comments.quick.strength') },
    { text: t('comments.quick.not_alone') }
  ];

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
        setComments(prev => {
          // Prevenir duplicados checkeando si el ID ya existe en nuestra lista
          if (prev.some(c => c.id === data.id)) return prev;

          return [...prev, {
            id: data.id,
            body: data.body,
            authorName: data.authorName,
            authorId: data.authorId,
            createdAt: data.createdAt,
            canDelete: data.authorId === user?.id || user?.role === 'admin'
          }];
        });
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

  const handleQuickOption = async (optionText) => {
    // Quick options submit directly, bypassing the form hook validation since they are pre-canned
    await submitComment(optionText);
  };

  const onFormSubmit = async (data) => {
    const text = data.newComment.trim();
    if (!text || text.length > 300) return;

    // We await submitComment intentionally here so the form stays submitting until done
    const success = await submitComment(text);
    if (success) {
      reset();
    }
  };

  const submitComment = async (text) => {
    let safeStorageModule;
    try {
      safeStorageModule = await import('../utils/storage');
    } catch (e) { }

    // 1. Rate verify visually
    const storeKey = `prayer_comments_${requestId}`;
    let userComments = 0;
    try {
      if (safeStorageModule) {
        const stored = safeStorageModule.safeStorage.getItem(storeKey);
        if (stored) userComments = parseInt(stored, 10);
      }
    } catch (e) { }

    if (userComments >= 3) {
      setNotifications(prev => [...prev, { message: t('comments.rate_limit') }]);
      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      notificationTimeoutsRef.current.push(timeoutId);
      return false;
    }

    const tempId = `temp-${Date.now()}`;
    const newCommentObj = {
      id: tempId,
      body: text,
      authorName: isAuthenticated ? user.displayName : t('comments.anonymous_author'),
      authorId: isAuthenticated ? user.id : null,
      createdAt: new Date().toISOString(),
      isPending: true,
      canDelete: false
    };

    // Optimistic UI
    setComments(prev => [...prev, newCommentObj]);

    try {
      // Backend POST
      const commentData = {
        body: text,
        authorName: isAuthenticated ? user.displayName : t('comments.anonymous_author'),
        isAnonymous: !isAuthenticated,
        guestId
      };

      const result = await commentsAPI.create(requestId, commentData);

      try {
        if (safeStorageModule) {
          safeStorageModule.safeStorage.setItem(storeKey, (userComments + 1).toString());
        }
      } catch (e) { }

      // Replace temp with real
      setComments(prev => prev.map(c =>
        c.id === tempId ? {
          ...result.comment,
          canDelete: result.comment.authorId === user?.id || user?.role === 'admin'
        } : c
      ));

      emitToRequest(requestId, 'new-comment', {
        id: result.comment.id,
        body: result.comment.body,
        authorName: result.comment.authorName,
        authorId: result.comment.authorId,
        createdAt: result.comment.createdAt,
        targetUserId: requestAuthorId
      });

      return true;
    } catch (error) {
      setComments(prev => prev.filter(c => c.id !== tempId));
      setNotifications(prev => [...prev, { message: t('comments.error_send') }]);
      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      notificationTimeoutsRef.current.push(timeoutId);
      return false;
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const result = await commentsAPI.update(commentId, { body: newText, guestId });
      setComments(prev => prev.map(c =>
        c.id === commentId ? {
          ...c,
          body: result.comment.body,
          isEdited: true
        } : c
      ));
    } catch (error) {
      setNotifications(prev => [...prev, { message: t('comments.error_send') }]);
      const timeoutId = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
      notificationTimeoutsRef.current.push(timeoutId);
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

  const displayCount = (comments.length > 0 || isOpen) ? comments.length : initialCommentCount;

  if (!isOpen) {
    return (
      <button className="comments-toggle-btn" onClick={onToggle}>
        <MessageCircle size={16} />
        {displayCount > 0 ? t('comments.title', { count: displayCount }) : t('prayerCard.addComment')}
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
              onEdit={handleEdit}
              canDelete={comment.authorId === user?.id || user?.role === 'admin'}
              canEdit={
                (comment.authorId && comment.authorId === user?.id) ||
                (!comment.authorId && comment.guestId === guestId)
              }
            />
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Comment Form - Now available for everyone */}
      <form className="comment-form" onSubmit={handleSubmit(onFormSubmit)}>
        {/* Quick Options chips */}
        <div className="comment-section__quick-replies">
          {quickOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className="comment-section__chip"
              onClick={() => handleQuickOption(option.text)}
              disabled={isSubmitting}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="comment-section__input-area">
          <div className="comment-input-row">
            <textarea
              {...register('newComment', { required: true, maxLength: 300 })}
              placeholder={t('comments.placeholder')}
              rows={2}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newCommentContent?.trim() || isSubmitting || !isValid}
              className="submit-comment-btn"
              aria-label={t('comments.send')}
            >
              <Send size={16} />
            </button>
          </div>
          <div className={`comment-section__char-count ${newCommentContent?.length >= 300 ? 'comment-section__char-count--warning' : ''}`}>
            {newCommentContent?.length || 0} / 300
          </div>
        </div>
      </form>
    </section>
  );
};

export default CommentSection;
