import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
import { SendIcon } from './ui/animated-state-icons';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { m, AnimatePresence } from 'framer-motion';
import CommentItem from './CommentItem';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/useComments';
import { safeStorage } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import './CommentSection.css';

const CommentSection = ({ requestId, isOpen, onToggle, requestAuthorId, id, onCommentCountUpdate }) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  const { socket, joinRequest, leaveRequest, emitToRequest } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const commentsEndRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: comments = [], isLoading: loading } = useComments(requestId, isOpen);

  // Generate guestId mirroring PrayedButton logic
  const guestId = React.useMemo(() => {
    let id;
    try {
      id = localStorage.getItem('prayer_guest_comment_id');
    } catch { /* empty */ }
    // eslint-disable-next-line react-hooks/purity
    return id || Date.now().toString(36);
  }, []);

  const createMutation = useCreateComment(requestId);
  const updateMutation = useUpdateComment(requestId, guestId);
  const deleteMutation = useDeleteComment(requestId, user);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isSubmitting, isValid }
  } = useForm({
    defaultValues: { newComment: '' },
    mode: 'onChange'
  });

  const newCommentContent = useWatch({ control, name: 'newComment', defaultValue: '' });

  useEffect(() => {
    let id = safeStorage.getItem('prayer_guest_comment_id');
    if (!id) {
      id = window.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
      safeStorage.setItem('prayer_guest_comment_id', id);
    }
  }, []);

  // Quick comment options
  const quickOptions = [
    { text: t('comments.quick.praying') },
    { text: t('comments.quick.strength') },
    { text: t('comments.quick.not_alone') }
  ];

  // Join/leave rooms based on open state
  useEffect(() => {
    if (isOpen) {
      joinRequest(requestId);
      setHasLoaded(true);
    } else {
      leaveRequest(requestId);
    }

    return () => {
      leaveRequest(requestId);
    };
  }, [isOpen, requestId, joinRequest, leaveRequest]);

  // Listen for real-time events, update React Query cache
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (data) => {
      if (data.requestId === requestId) {
        queryClient.setQueryData(['comments', requestId], (prev = []) => {
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
        queryClient.setQueryData(['comments', requestId], (prev = []) => prev.filter(c => c.id !== data.commentId));
      }
    };

    const handleNotification = (notification) => {
      if (notification.targetUserId === user?.id && notification.requestId === requestId) {
        showToast(notification.message || t('notifications.newComment', { name: notification.authorName }), 'info');
      }
    };

    socket.on('new-comment', handleNewComment);
    socket.on('comment-deleted', handleCommentDeleted);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('new-comment', handleNewComment);
      socket.off('comment-deleted', handleCommentDeleted);
      socket.off('notification', handleNotification);
    };
  }, [socket, requestId, user, queryClient, showToast, t]);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (commentsEndRef.current && isOpen) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, isOpen]);

  useEffect(() => {
    if (hasLoaded && onCommentCountUpdate && !loading) {
      onCommentCountUpdate(comments.length);
    }
  }, [comments.length, hasLoaded, onCommentCountUpdate, loading]);

  const handleQuickOption = (optionText) => {
    const currentText = newCommentContent || '';
    const updatedText = currentText ? `${currentText} ${optionText}`.trim() : optionText;
    setValue('newComment', updatedText, { shouldValidate: true, shouldDirty: true });
  };

  const onFormSubmit = async (data) => {
    const text = data.newComment.trim();
    if (!text || text.length > 300) return;

    // Clear input immediately for optimal UX during optimistic update
    reset();
    await submitComment(text);
  };

  const submitComment = async (text) => {
    const storeKey = `prayer_comments_${requestId}`;
    let userComments = 0;
    try {
      const stored = safeStorage.getItem(storeKey);
      if (stored) userComments = parseInt(stored, 10);
    } catch { /* empty */ }

    if (userComments >= 3) {
      showToast(t('comments.rate_limit'), 'warning');
      return false;
    }

    try {
      // Optimistic update handled in useCreateComment via onMutate
      const result = await createMutation.mutateAsync({
        text,
        authorName: isAuthenticated ? user.displayName : t('comments.anonymous_author'),
        isAnonymous: !isAuthenticated,
        guestId
      });

      try {
        safeStorage.setItem(storeKey, (userComments + 1).toString());
      } catch { /* empty */ }

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
      if (error.statusCode === 429) {
        showToast(t('comments.rate_limit'), 'warning');
      } else {
        showToast(t('comments.error_send'), 'error');
      }
      return false;
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const result = await updateMutation.mutateAsync({ commentId, newText });
      queryClient.setQueryData(['comments', requestId], (prev = []) => prev.map(c =>
        c.id === commentId ? {
          ...c,
          body: result.comment.body,
          isEdited: true
        } : c
      ));
    } catch {
      showToast(t('comments.error_send'), 'error');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(t('comments.deleteConfirm'))) return;

    try {
      await deleteMutation.mutateAsync(commentId);
      emitToRequest(requestId, 'comment-deleted', { commentId });
      showToast(t('comments.deletedLabel', { defaultValue: 'Comment deleted' }), 'success');
    } catch {
      showToast(t('comments.deleteError'), 'error');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <m.section
            className="comment-section"
            id={id}
            aria-label={t('comments.sectionAria', { count: comments.length })}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
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

            <form className="comment-form" onSubmit={handleSubmit(onFormSubmit)}>
              <div className="comment-section__quick-replies">
                {quickOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    className="comment-section__chip"
                    onClick={() => handleQuickOption(option.text)}
                    disabled={isSubmitting || createMutation.isPending}
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
                    disabled={isSubmitting || createMutation.isPending}
                  />
                  <button
                    type="submit"
                    disabled={!newCommentContent?.trim() || isSubmitting || !isValid || createMutation.isPending}
                    className="submit-comment-btn"
                    aria-label={t('comments.send')}
                  >
                    <SendIcon size={18} isSent={createMutation.isPending} />
                  </button>
                </div>
                <div className={`comment-section__char-count ${newCommentContent?.length >= 300 ? 'comment-section__char-count--warning' : ''}`}>
                  {newCommentContent?.length || 0} / 300
                </div>
              </div>
            </form>
          </m.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommentSection;
