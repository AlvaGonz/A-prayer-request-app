import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { User, Heart, Loader2, Send, AlertCircle } from 'lucide-react';
import { shareAPI } from '../api';
import Header from '../components/Header';
import './SharedPrayerPage.css';

const SharedPrayerPage = () => {
    const { token } = useParams();
    const [request, setRequest] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prayedCount, setPrayedCount] = useState(0);
    const [hasPrayed, setHasPrayed] = useState(false);
    const [isPraying, setIsPraying] = useState(false);

    // Guest comment form
    const [guestName, setGuestName] = useState('');
    const [commentBody, setCommentBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        const fetchShared = async () => {
            try {
                setLoading(true);
                const data = await shareAPI.getShared(token);
                setRequest(data.request);
                setComments(data.comments);
                setPrayedCount(data.request.prayedCount);
            } catch (err) {
                setError(err.statusCode === 404
                    ? 'This prayer request is no longer available.'
                    : 'Failed to load prayer request. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchShared();
    }, [token]);

    const handlePray = async () => {
        if (isPraying || hasPrayed) return;
        setIsPraying(true);
        try {
            const data = await shareAPI.prayShared(token);
            setPrayedCount(data.prayedCount);
            setHasPrayed(true);
        } catch (err) {
            console.error('Pray failed:', err);
        } finally {
            setIsPraying(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentBody.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const data = await shareAPI.commentShared(token, commentBody, guestName || 'A Friend');
            setComments(prev => [...prev, data.comment]);
            setCommentBody('');
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            alert(err.message || 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="shared-page">
                <Header />
                <div className="shared-loading">
                    <Loader2 size={32} className="spinner" />
                    <p>Loading prayer request...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shared-page">
                <Header />
                <div className="shared-error">
                    <AlertCircle size={48} />
                    <h2>Prayer request not found</h2>
                    <p>{error}</p>
                    <Link to="/" className="shared-cta-btn">Visit the Prayer Wall</Link>
                </div>
            </div>
        );
    }

    const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });

    return (
        <div className="shared-page">
            <Header />

            <main className="shared-content">
                <div className="shared-banner">
                    <p>Someone is asking for prayer</p>
                </div>

                <article className="shared-card">
                    <header className="shared-card-header">
                        <div className="shared-author">
                            {request.isAnonymous ? (
                                <>
                                    <div className="author-avatar anonymous" aria-hidden="true">
                                        <User size={16} />
                                    </div>
                                    <span className="author-name">Anonymous</span>
                                </>
                            ) : (
                                <>
                                    <div className="author-avatar" aria-hidden="true">
                                        {request.authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="author-name">{request.authorName}</span>
                                </>
                            )}
                        </div>
                        <time className="time-ago" dateTime={request.createdAt}>{timeAgo}</time>
                    </header>

                    <div className="shared-card-body">
                        <p>{request.body}</p>
                    </div>

                    <footer className="shared-card-footer">
                        <button
                            className={`shared-pray-btn ${hasPrayed ? 'prayed' : ''}`}
                            onClick={handlePray}
                            disabled={isPraying || hasPrayed}
                        >
                            <Heart size={20} fill={hasPrayed ? 'currentColor' : 'none'} />
                            <span>{hasPrayed ? 'Prayed!' : 'I Prayed for This'}</span>
                            <span className="pray-count">{prayedCount}</span>
                        </button>
                    </footer>
                </article>

                {/* Comments */}
                <section className="shared-comments" aria-label="Comments and encouragement">
                    <h3>Encouragement ({comments.length})</h3>

                    <div className="shared-comments-list">
                        {comments.length === 0 ? (
                            <p className="empty-comments">Be the first to offer encouragement</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="shared-comment">
                                    <div className="shared-comment-author">
                                        <strong>{comment.authorName}</strong>
                                        <time>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</time>
                                    </div>
                                    <p>{comment.body}</p>
                                </div>
                            ))
                        )}
                        <div ref={commentsEndRef} />
                    </div>

                    <form className="shared-comment-form" onSubmit={handleComment}>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Your name (optional)"
                            maxLength={50}
                            className="guest-name-input"
                        />
                        <div className="comment-input-row">
                            <textarea
                                value={commentBody}
                                onChange={(e) => setCommentBody(e.target.value)}
                                placeholder="Share encouragement or prayers..."
                                maxLength={500}
                                rows={2}
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!commentBody.trim() || isSubmitting}
                                className="send-comment-btn"
                                aria-label="Send comment"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </section>

                {/* CTA */}
                <div className="shared-cta">
                    <p>Want to see more prayer requests and join the community?</p>
                    <Link to="/register" className="shared-cta-btn">Create an Account</Link>
                </div>
            </main>
        </div>
    );
};

export default SharedPrayerPage;
