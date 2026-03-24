import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { safeStorage } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import './NotificationBanner.css';

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if notifications are already enabled or dismissed
    const hasDismissed = safeStorage.getItem('prayerBoard_notificationDismissed');
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';

    // Show banner if user is authenticated and hasn't dismissed it or enabled notifications
    if (isAuthenticated && !hasDismissed && !hasPermission) {
      // Delay showing to not be intrusive
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleDismiss = () => {
    safeStorage.setItem('prayerBoard_notificationDismissed', 'true');
    setIsVisible(false);
  };

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      showToast('This browser does not support notifications', 'error');
      return;
    }

    // CRITICAL: Hide the fixed banner BEFORE requesting permission.
    // Android Chrome blocks Notification.requestPermission() when
    // called from inside a position:fixed overlay element.
    setIsVisible(false);

    // Wait one animation frame to ensure the banner is removed from DOM
    await new Promise(resolve => requestAnimationFrame(resolve));
    // Extra buffer for Chrome's overlay detection heuristic
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Get push subscription (in real implementation with backend)
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.ready;

          // This would normally use the backend's VAPID public key
          // For high-level wiring, we'll just log it

          // Store that user has enabled notifications
          safeStorage.setItem('prayerBoard_notificationsEnabled', 'true');
        }
        // Banner stays hidden (already dismissed by flow)
      } else if (permission === 'denied') {
        // Re-show banner with a "blocked" message variant
        // so user knows they can enable from browser settings
        safeStorage.setItem('prayerBoard_notificationDismissed', 'true');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      // Do not re-show banner on error to avoid loop
    }
  };

  if (!isVisible) return null;

  return (
    <section 
      className="notification-banner"
      role="status"
      aria-label={t('notifications.bannerTitle') || "Stay Connected"}
    >
      <div className="notification-content">
        <div className="notification-icon-container" aria-hidden="true">
          <Bell size={20} />
        </div>
        <div className="notification-text">
          <h2 className="notification-title">Stay Connected in Prayer</h2>
          <p className="notification-desc">
            Enable notifications to know when someone prays for your requests.
          </p>
        </div>
      </div>
      <div className="notification-actions">
        <button
          className="btn-dismiss"
          onClick={handleDismiss}
          aria-label={t('notifications.dismissAria') || "Dismiss notification prompt"}
        >
          Not now
        </button>
        <button
          className="btn-enable"
          onClick={handleEnableNotifications}
          aria-label={t('notifications.enableAria') || "Enable browser notifications"}
        >
          Enable
        </button>
      </div>
    </section>
  );
};

export default NotificationBanner;
