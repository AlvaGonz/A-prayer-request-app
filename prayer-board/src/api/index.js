import { safeStorage, safeSessionStorage } from '../utils/storage.js';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) 
  ? 'http://localhost:5000' 
  : 'https://prayer-board-api.onrender.com';
// Clear old cache version marker
if (typeof window !== 'undefined') {
  const cacheVersion = safeStorage.getItem('app_cache_version');
  if (cacheVersion !== '2.0') {
    safeStorage.setItem('app_cache_version', '2.0');
  }
}

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  // Token lives in sessionStorage. Falls back to localStorage
  // to maintain sessions for users who logged in before this migration.
  const token = safeSessionStorage.getItem('prayerBoard_token')
             || safeStorage.getItem('prayerBoard_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  // Ensure fresh data from server, relying on SW for cache
  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Pragma'] = 'no-cache';

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new APIError(error.error || `HTTP ${response.status}`, response.status);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'APIError') throw error;
    throw new APIError('Network error. Please check your connection.', 0);
  }
};

// Auth API
export const authAPI = {
  register: async (data) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  login: async (data) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  me: async () => apiCall('/api/auth/me'),
  updateProfile: async (data) => apiCall('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  logout: () => {
    safeStorage.removeItem('prayerBoard_user');
    safeStorage.removeItem('prayerBoard_token');
    safeSessionStorage.removeItem('prayerBoard_user');
    safeSessionStorage.removeItem('prayerBoard_token');
  }
};

// Requests API
export const requestsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/requests?${query}`);
  },

  create: async (data) => apiCall('/api/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  pray: async (requestId) => apiCall(`/api/requests/${requestId}/pray`, {
    method: 'POST'
  }),

  unpray: async (requestId) => apiCall(`/api/requests/${requestId}/unpray`, {
    method: 'POST'
  }),

  updateStatus: async (requestId, data) => apiCall(`/api/requests/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  markAnswered: async (requestId, data = {}) => apiCall(`/api/requests/${requestId}/answer`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  delete: async (requestId) => apiCall(`/api/requests/${requestId}`, {
    method: 'DELETE'
  })
};

// Comments API
export const commentsAPI = {
  getByRequest: async (requestId) => apiCall(`/api/requests/${requestId}/comments`),

  create: async (requestId, commentData) => apiCall(`/api/requests/${requestId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData)
  }),

  update: async (commentId, data) => apiCall(`/api/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  delete: async (commentId) => apiCall(`/api/comments/${commentId}`, {
    method: 'DELETE'
  })
};

// Share API
export const shareAPI = {
  generateLink: async (requestId) => apiCall(`/api/requests/${requestId}/share`, {
    method: 'POST'
  }),

  getShared: async (token) => apiCall(`/api/shared/${token}`),

  prayShared: async (token) => apiCall(`/api/shared/${token}/pray`, {
    method: 'POST'
  }),

  unprayShared: async (token) => apiCall(`/api/shared/${token}/unpray`, {
    method: 'POST'
  }),

  commentShared: async (token, body, guestName) => apiCall(`/api/shared/${token}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body, guestName })
  })
};

// Export error class for handling in components
export { APIError };

export default { authAPI, requestsAPI, commentsAPI, shareAPI, APIError };
