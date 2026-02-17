// API Configuration v2.0 - Production Only
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prayer-board-api.onrender.com';

// Clear old cache version marker
if (typeof window !== 'undefined') {
  const cacheVersion = localStorage.getItem('app_cache_version');
  if (cacheVersion !== '2.0') {
    console.log('Clearing old cache (v2.0)...');
    localStorage.setItem('app_cache_version', '2.0');
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
  const token = localStorage.getItem('prayerBoard_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

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
  
  logout: () => {
    localStorage.removeItem('prayerBoard_user');
    localStorage.removeItem('prayerBoard_token');
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
  
  updateStatus: async (requestId, data) => apiCall(`/api/requests/${requestId}/status`, {
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
  
  create: async (requestId, body) => apiCall(`/api/requests/${requestId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body })
  }),
  
  delete: async (commentId) => apiCall(`/api/comments/${commentId}`, {
    method: 'DELETE'
  })
};

// Export error class for handling in components
export { APIError };

export default { authAPI, requestsAPI, commentsAPI, APIError };
