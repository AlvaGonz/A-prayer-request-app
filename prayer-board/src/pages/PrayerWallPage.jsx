import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { m } from 'framer-motion';
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
  const [columnCount, setColumnCount] = useState(3);
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

  // --- Virtualization Layout Logic ---
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setColumnCount(1);
      else if (width < 1100) setColumnCount(2);
      else setColumnCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rows = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < requests.length; i += columnCount) {
      chunks.push(requests.slice(i, i + columnCount));
    }
    return chunks;
  }, [requests, columnCount]);

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage || isFetchingNextPage ? rows.length + 1 : rows.length,
    estimateSize: () => 280, // Approximate row height
    overscan: 3,
  });

  // Auto Infinite Scroll Trigger
  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem.index >= rows.length && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, rows.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  // --- Custom Mutation Handlers ---
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

  const handleNewRequest = () => {
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
    <m.div
      className="prayer-wall-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
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
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > rows.length - 1;
                const rowItems = rows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div
                      className="virtual-row-grid"
                      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
                    >
                      {isLoaderRow || (!rowItems && loading) ? (
                        Array.from({ length: columnCount }).map((_, index) => (
                          <PrayerRequestSkeleton key={`skel-${index}`} />
                        ))
                      ) : (
                        rowItems && rowItems.map(request => (
                          <PrayerRequestCard
                            key={request.id}
                            request={request}
                            onPrayed={handlePrayed}
                            onUpdateStatus={handleUpdateStatus}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <NewPrayerRequestForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleNewRequest}
      />

      <NotificationBanner />
    </m.div>
  );
};

export default PrayerWallPage;
