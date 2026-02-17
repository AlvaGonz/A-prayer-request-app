import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// Event emitter for local real-time updates (simulating Socket.IO for offline mode)
const localEventEmitter = {
  listeners: new Map(),
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  },
  
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  },
  
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error('Error in event listener:', err);
        }
      });
    }
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const activeRequests = useRef(new Set());
  const userCallbacks = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    // For now, we'll use a mock socket since there's no backend
    // In production, this would connect to: io('http://localhost:5000')
    const mockSocket = {
      on: (event, callback) => localEventEmitter.on(event, callback),
      off: (event, callback) => localEventEmitter.off(event, callback),
      emit: (event, data) => {
        // Simulate server-side handling
        if (event === 'join-request') {
          activeRequests.current.add(data);
        } else if (event === 'leave-request') {
          activeRequests.current.delete(data);
        } else if (event === 'authenticate' && user) {
          // Store user's notification callback
          if (!userCallbacks.current.has(user.id)) {
            userCallbacks.current.set(user.id, []);
          }
        }
      },
      disconnect: () => {
        activeRequests.current.clear();
        userCallbacks.current.clear();
      }
    };

    setSocket(mockSocket);
    setConnected(true);

    return () => {
      mockSocket.disconnect();
    };
  }, []);

  // Authenticate socket when user logs in
  useEffect(() => {
    if (socket && isAuthenticated && user) {
      socket.emit('authenticate', user.id);
    }
  }, [socket, isAuthenticated, user]);

  const joinRequest = useCallback((requestId) => {
    if (socket) {
      socket.emit('join-request', requestId);
      activeRequests.current.add(requestId);
    }
  }, [socket]);

  const leaveRequest = useCallback((requestId) => {
    if (socket) {
      socket.emit('leave-request', requestId);
      activeRequests.current.delete(requestId);
    }
  }, [socket]);

  // Helper to emit real-time events
  const emitToRequest = useCallback((requestId, event, data) => {
    // Emit locally for immediate UI updates
    localEventEmitter.emit(event, { ...data, requestId });
    
    // If this is a new comment, also notify the request author
    if (event === 'new-comment' && data.authorId) {
      // In a real backend, this would check if author is online and notify them
      localEventEmitter.emit('notification', {
        type: 'new-comment',
        message: `${data.authorName} commented on your prayer request`,
        requestId,
        targetUserId: data.targetUserId
      });
    }
  }, []);

  const value = {
    socket,
    connected,
    joinRequest,
    leaveRequest,
    emitToRequest,
    localEventEmitter
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
