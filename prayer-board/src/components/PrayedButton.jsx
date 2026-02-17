import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import './PrayedButton.css';

const PrayedButton = ({ requestId, initialCount, onPrayed }) => {
  const [count, setCount] = useState(initialCount);
  const [isPrayed, setIsPrayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handlePray = async () => {
    if (isLoading) return;
    
    // For registered users, prevent duplicate prayers
    if (isAuthenticated && isPrayed) {
      return;
    }
    
    setIsLoading(true);
    
    // Optimistic update
    const newCount = count + 1;
    setCount(newCount);
    
    try {
      const result = await requestsAPI.pray(requestId, user);
      setIsPrayed(true);
      setShowMessage(true);
      
      // Hide message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
      
      if (onPrayed) {
        onPrayed(requestId, result.prayedCount);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCount(initialCount);
      console.error('Error praying:', error);
      alert(error.message || 'Unable to record your prayer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prayed-button-container">
      <button
        className={`prayed-button ${isPrayed ? 'prayed' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handlePray}
        disabled={isLoading || (isAuthenticated && isPrayed)}
        aria-label={isPrayed ? 'You have prayed for this request' : 'Pray for this request'}
      >
        <Heart 
          size={18} 
          className={`prayed-icon ${isPrayed ? 'animate' : ''}`}
        />
        <span className="prayed-count">{count}</span>
        <span className="prayed-text">
          {isPrayed ? 'Prayed' : 'I Prayed'}
        </span>
      </button>
      
      {showMessage && (
        <div className="prayed-message animate-in">
          Your prayer has been noted. Thank you for lifting this up.
        </div>
      )}
    </div>
  );
};

export default PrayedButton;
