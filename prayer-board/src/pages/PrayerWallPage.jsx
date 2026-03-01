import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';
import PrayerRequestCard from '../components/PrayerRequestCard';
import PrayerRequestSkeleton from '../components/PrayerRequestSkeleton';
import NewPrayerRequestForm from '../components/NewPrayerRequestForm';
import NotificationBanner from '../components/NotificationBanner';
import { useAuth } from '../context/AuthContext';
import { usePrayerRequests, useUpdatePrayerStatus, useDeletePrayerRequest } from '../hooks/usePrayerRequests';
import './PrayerWallPage.css';

const PrayerWallPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = usePrayerRequests();

  const updateMutation = useUpdatePrayerStatus();
  const deleteMutation = useDeletePrayerRequest();

  const requests = data ? data.pages.flatMap((page) => page.requests) : [];
  const loading = status === 'pending';

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handlePrayed = (requestId, newCount) => {
    queryClient.setQueryData(['prayerRequests'], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          requests: page.requests.map((req) =>
            req.id === requestId ? { ...req, prayedCount: newCount } : req
          ),
        })),
      };
    });
  };

  const handleNewRequest = (newRequest) => {
    queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
  };

  const handleUpdateStatus = async (requestId, reqStatus) => {
    updateMutation.mutate({ requestId, data: { status: reqStatus }, user }, {
      onError: (err) => {
        alert(err.message || 'Failed to update request');
      }
    });
  };

  const handleDelete = async (requestId) => {
    deleteMutation.mutate({ requestId, user }, {
      onError: (err) => {
        alert(err.message || 'Failed to delete request');
      }
    });
  };

  return (
    <div className="prayer-wall-page">
      <Header />

      <main className="wall-content">
        <div className="wall-header">
          <div className="wall-intro">
            <h1>{t('prayerWall.title')}</h1>
            <p>{t('prayerWall.subtitle')}</p>
          </div>

          <button
            className="new-request-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            {t('prayerWall.newRequest')}
          </button>
        </div>

        {status === 'error' && (
          <div className="error-banner">
            {error?.message || t('errors.loading')}
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['prayerRequests'] })}>
              Retry
            </button>
          </div>
        )}

        <div className="requests-container">
          {requests.length === 0 && !loading ? (
            <div className="empty-state">
              <p>{t('prayerWall.empty')}</p>
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

              {loading && requests.length === 0 && (
                Array.from({ length: 4 }).map((_, index) => (
                  <PrayerRequestSkeleton key={index} />
                ))
              )}
            </div>
          )}

          {isFetchingNextPage && requests.length > 0 && (
            <div className="loading-state">
              <Loader2 size={32} className="spinner" />
              <p>{t('prayerWall.loading')}</p>
            </div>
          )}

          {hasNextPage && !loading && !isFetchingNextPage && requests.length > 0 && (
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              {t('prayerWall.loadMore')}
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
