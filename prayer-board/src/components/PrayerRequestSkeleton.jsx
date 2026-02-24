import React from 'react';
import './PrayerRequestSkeleton.css';

const PrayerRequestSkeleton = () => {
    return (
        <div className="skeleton-card" aria-hidden="true">
            <div className="skeleton-header">
                <div className="skeleton-author">
                    <div className="skeleton-pulse skeleton-avatar"></div>
                    <div className="skeleton-pulse skeleton-name"></div>
                </div>
                <div className="skeleton-pulse skeleton-time"></div>
            </div>

            <div className="skeleton-body">
                <div className="skeleton-pulse skeleton-line"></div>
                <div className="skeleton-pulse skeleton-line"></div>
                <div className="skeleton-pulse skeleton-line short"></div>
            </div>

            <div className="skeleton-footer">
                <div className="skeleton-actions">
                    <div className="skeleton-pulse skeleton-btn"></div>
                    <div className="skeleton-pulse skeleton-btn sm"></div>
                </div>
            </div>
        </div>
    );
};

export default PrayerRequestSkeleton;
