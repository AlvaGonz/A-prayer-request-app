import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { requestsAPI } from '../api';
import Header from '../components/Header';
import PrayerRequestCard from '../components/PrayerRequestCard';
import NewPrayerRequestForm from '../components/NewPrayerRequestForm';
import NotificationBanner from '../components/NotificationBanner';
import { useAuth } from '../context/AuthContext';
import './PrayerWallPage.css';

const PrayerWallPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchRequests = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const data = await requestsAPI.getAll({ page: pageNum, limit: 20 });
      
      if (append) {
        setRequests(prev => [...prev, ...data.requests]);
      } else {
        setRequests(data.requests);
      }
      
      setHasMore(pageNum < data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to load prayer requests. Please try again.');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRequests(nextPage, true);
  };

  const handlePrayed = (requestId, newCount) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, prayedCount: newCount }
          : req
      )
    );
  };

  const handleNewRequest = (newRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await requestsAPI.updateStatus(requestId, { status }, user);
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status } : req
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await requestsAPI.delete(requestId, user);
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      alert(err.message || 'Failed to delete request');
    }
  };

  return (
    <div className="prayer-wall-page">
      <Header />
      
      <main className="wall-content">
        <div className="wall-header">
          <div className="wall-intro">
            <h1>Community Prayer Wall</h1>
            <p>Share your prayer requests and lift others up in prayer</p>
          </div>
          
          <button
            className="new-request-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            New Request
          </button>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => fetchRequests()}>Retry</button>
          </div>
        )}

        <div className="requests-container">
          {requests.length === 0 && !loading ? (
            <div className="empty-state">
              <p>No prayer requests yet.</p>
              <p>Be the first to share a request with the community.</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map(request => (
                <PrayerRequestCard
                  key={request.id}
                  request={request}
                  onPrayed={handlePrayed}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <Loader2 size={32} className="spinner" />
              <p>Loading prayer requests...</p>
            </div>
          )}

          {hasMore && !loading && requests.length > 0 && (
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </main>

      <NewPrayerRequestForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleNewRequest}
      />
      
      <NotificationBanner />
    </div>
  );
};

export default PrayerWallPage;
