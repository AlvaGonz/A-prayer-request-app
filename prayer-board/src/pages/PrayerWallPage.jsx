import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { m } from 'framer-motion';
import Header from '../components/Header';
import PrayerRequestCard from '../components/PrayerRequestCard';
import PrayerRequestSkeleton from '../components/PrayerRequestSkeleton';
import NewPrayerRequestForm from '../components/NewPrayerRequestForm';
import NotificationBanner from '../components/NotificationBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePrayerRequests, useUpdatePrayerStatus, useDeletePrayerRequest } from '../hooks/usePrayerRequests';
import { TextLoop } from '../components/ui/text-loop';
import './PrayerWallPage.css';

// Row container animation variants for staggered card reveals
const rowContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const PrayerWallPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [statusFilter, setStatusFilter] = useState('open');
  const { user } = useAuth();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = usePrayerRequests(statusFilter);

  const updateMutation = useUpdatePrayerStatus();
  const deleteMutation = useDeletePrayerRequest();

  const requests = useMemo(() => {
    return data ? data.pages.flatMap((page) => page.requests) : [];
  }, [data]);

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

  // --- Robust Infinite Scroll via IntersectionObserver ---
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        showToast(err.message || 'Failed to update request', 'error');
      }
    });
  };

  const handleDelete = async (requestId) => {
    deleteMutation.mutate({ requestId, user }, {
      onError: (err) => {
        showToast(err.message || 'Failed to delete request', 'error');
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
            <h1>
              {t('prayerWall.loopPrefix')}
              <TextLoop interval={3}>
                <span>{t('prayerWall.loopItems.enemies')}</span>
                <span>{t('prayerWall.loopItems.friends')}</span>
                <span>{t('prayerWall.loopItems.family')}</span>
                <span>{t('prayerWall.loopItems.brothers')}</span>
                <span>{t('prayerWall.loopItems.inlaws')}</span>
                <span>{t('prayerWall.loopItems.change')}</span>
                <span>{t('prayerWall.loopItems.stray')}</span>
                <span>{t('prayerWall.loopItems.stranger')}</span>
                <span>{t('prayerWall.loopItems.forgiveness')}</span>
                <span>{t('prayerWall.loopItems.yourself')}</span>
                <span>{t('prayerWall.loopItems.healing')}</span>
                <span>{t('prayerWall.loopItems.guidance')}</span>
                <span>{t('prayerWall.loopItems.provision')}</span>
                <span>{t('prayerWall.loopItems.protection')}</span>
                <span>{t('prayerWall.loopItems.strength')}</span>
                <span>{t('prayerWall.loopItems.baptism')}</span>
                <span>{t('prayerWall.loopItems.wisdom')}</span>
                <span>{t('prayerWall.loopItems.todie')}</span>
                <span>{t('prayerWall.loopItems.obidience')}</span>
                <span>{t('prayerWall.loopItems.will')}</span>
                <span>{t('prayerWall.loopItems.desire')}</span>
                <span>{t('prayerWall.loopItems.leaders')}</span>
                <span>{t('prayerWall.loopItems.widows')}</span>
                <span>{t('prayerWall.loopItems.lost')}</span>
                <span>{t('prayerWall.loopItems.sick')}</span>
                <span>{t('prayerWall.loopItems.persecuted')}</span>
                <span>{t('prayerWall.loopItems.workers')}</span>
                <span>{t('prayerWall.loopItems.neighbors')}</span>
                <span>{t('prayerWall.loopItems.church')}</span>
                <span>{t('prayerWall.loopItems.israel')}</span>
                <span>{t('prayerWall.loopItems.thanksgiving')}</span>
                <span>{t('prayerWall.loopItems.praise')}</span>
                <span>{t('prayerWall.loopItems.confession')}</span>
                <span>{t('prayerWall.loopItems.revival')}</span>
                <span>{t('prayerWall.loopItems.salvation')}</span>
                <span>{t('prayerWall.loopItems.deliverance')}</span>
                <span>{t('prayerWall.loopItems.unity')}</span>
                <span>{t('prayerWall.loopItems.fasting')}</span>
                <span>{t('prayerWall.loopItems.nation')}</span>
                <span>{t('prayerWall.loopItems.warfare')}</span>
                <span>{t('prayerWall.loopItems.sanctification')}</span>
                <span>{t('prayerWall.loopItems.renewal')}</span>
                <span>{t('prayerWall.loopItems.humility')}</span>
                <span>{t('prayerWall.loopItems.faith')}</span>
                <span>{t('prayerWall.loopItems.love')}</span>
                <span>{t('prayerWall.loopItems.kingdom')}</span>
                <span>{t('prayerWall.loopItems.peace')}</span>
                <span>{t('prayerWall.loopItems.repentance')}</span>
                <span>{t('prayerWall.loopItems.mission')}</span>
                <span>{t('prayerWall.loopItems.all')}</span>
              </TextLoop>
            </h1>
            <p>{t('prayerWall.subtitle')}</p>
          </div>

          <button
            className="new-request-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={24} />
            {t('prayerWall.newRequest')}
          </button>
        </div>

        {status === 'error' && (
          <div className="error-banner">
            {error?.message || t('errors.loading')}
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['prayerRequests'] })}>
              {t('prayerWall.retry')}
            </button>
          </div>
        )}

        <div className="wall-filters" role="tablist">
          <button
            className={`filter-tab ${statusFilter === 'open' ? 'active' : ''}`}
            onClick={() => setStatusFilter('open')}
            role="tab"
            aria-selected={statusFilter === 'open'}
          >
            {t('prayerWall.filterPending')}
          </button>
          <button
            className={`filter-tab ${statusFilter === 'answered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('answered')}
            role="tab"
            aria-selected={statusFilter === 'answered'}
          >
            {t('prayerWall.filterAnswered')}
          </button>
        </div>

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
                    <m.div
                      className="virtual-row-grid"
                      style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
                      variants={rowContainerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {isLoaderRow || (!rowItems && loading) ? (
                        Array.from({ length: columnCount }).map((_, index) => (
                          <PrayerRequestSkeleton key={`skel-${index}`} />
                        ))
                      ) : (
                        rowItems && rowItems.map((request, itemIndex) => {
                          return (
                            <PrayerRequestCard
                              key={request.id}
                              request={request}
                              onPrayed={handlePrayed}
                              onUpdateStatus={handleUpdateStatus}
                              onDelete={handleDelete}
                              index={itemIndex}
                            />
                          );
                        })
                      )}
                    </m.div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sentinel for IntersectionObserver-based infinite scroll */}
          <div
            ref={sentinelRef}
            aria-hidden="true"
            style={{ height: 1, width: '100%' }}
          />

          {/* Loading indicator while fetching next page */}
          {isFetchingNextPage && (
            <div className="loading-more">
              <div className="loading-more-dots">
                <span /><span /><span />
              </div>
              <p>{t('prayerWall.loading')}</p>
            </div>
          )}

          {/* Feed end message */}
          {!hasNextPage && requests.length > 0 && !loading && (
            <div className="feed-end-message">
              <span className="feed-end-divider" />
              <p>{t('feed.allPrayersLoaded')}</p>
              <span className="feed-end-divider" />
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
