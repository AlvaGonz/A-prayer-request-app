import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import './NotificationBanner.css';

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Check if notifications are already enabled or dismissed
    const hasDismissed = localStorage.getItem('prayerBoard_notificationDismissed');
    const hasPermission = Notification.permission === 'granted';

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
    localStorage.setItem('prayerBoard_notificationDismissed', 'true');
    setIsVisible(false);
  };

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Get push subscription (in real implementation with backend)
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;

          // This would normally use the backend's VAPID public key
          // For high-level wiring, we'll just log it
          console.log('Push notifications enabled');

          // Store that user has enabled notifications
          localStorage.setItem('prayerBoard_notificationsEnabled', 'true');
        }

        setIsVisible(false);
      } else if (permission === 'denied') {
        alert('Notifications are blocked. You can enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="notification-banner">
      <div className="notification-content">
        <Bell size={20} className="notification-icon" />
        <div className="notification-text">
          <p className="notification-title">Stay Connected in Prayer</p>
          <p className="notification-desc">
            Enable notifications to know when someone prays for your requests
          </p>
        </div>
      </div>
      <div className="notification-actions">
        <button
          className="btn-enable"
          onClick={handleEnableNotifications}
          disabled={isLoading}
        >
          {isLoading ? 'Enabling...' : 'Enable'}
        </button>
        <button
          className="btn-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
