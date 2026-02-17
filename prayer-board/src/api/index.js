// API Configuration - v1.0.1
// Force cache refresh: Updated to production backend
const USE_MOCK_API = false;
const API_BASE_URL = 'https://prayer-board-api.onrender.com';

// Clear any old cached data on load
if (typeof window !== 'undefined') {
  const cacheVersion = localStorage.getItem('app_cache_version');
  if (cacheVersion !== '1.0.1') {
    console.log('Clearing old cache...');
    localStorage.setItem('app_cache_version', '1.0.1');
    // Optional: Clear specific cached items if needed
    // localStorage.removeItem('cached_requests');
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
      'Pragma': 'no-cache',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// Mock API Helpers
const STORAGE_KEYS = {
  USER: 'prayerBoard_user',
  TOKEN: 'prayerBoard_token',
  REQUESTS: 'prayerBoard_requests',
  INTERACTIONS: 'prayerBoard_interactions',
  COMMENTS: 'prayerBoard_comments',
  USER_ID_COUNTER: 'prayerBoard_userIdCounter',
  REQUEST_ID_COUNTER: 'prayerBoard_requestIdCounter'
};

const generateId = (prefix) => {
  const counterKey = prefix === 'user' ? STORAGE_KEYS.USER_ID_COUNTER : STORAGE_KEYS.REQUEST_ID_COUNTER;
  let counter = parseInt(localStorage.getItem(counterKey) || '0');
  counter++;
  localStorage.setItem(counterKey, counter.toString());
  return `${prefix}_${Date.now()}_${counter}`;
};

// Mock Auth API
const mockAuthAPI = {
  register: async ({ displayName, email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('prayerBoard_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const user = {
      id: generateId('user'),
      displayName,
      email,
      role: 'member',
      createdAt: new Date().toISOString()
    };
    
    users.push({ ...user, passwordHash: btoa(password) });
    localStorage.setItem('prayerBoard_users', JSON.stringify(users));
    
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    
    return { token, user };
  },
  
  login: async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('prayerBoard_users') || '[]');
    const userData = users.find(u => u.email === email && u.passwordHash === btoa(password));
    
    if (!userData) {
      throw new Error('Invalid email or password');
    }
    
    const { passwordHash, ...user } = userData;
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    
    return { token, user };
  },
  
  me: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) throw new Error('Not authenticated');
    
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    if (!user) throw new Error('User not found');
    
    return { user };
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

// Real Auth API
const realAuthAPI = {
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
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

// Mock Requests API
const mockRequestsAPI = {
  getAll: async ({ page = 1, limit = 20, status = 'open' } = {}) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const allRequests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const filtered = allRequests
      .filter(r => !r.isDeleted && (status === 'all' || r.status === status))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return {
      requests: paginated,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        totalCount: filtered.length
      }
    };
  },
  
  create: async ({ body, isAnonymous = true }, user = null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const request = {
      id: generateId('req'),
      body: body.trim(),
      authorName: isAnonymous || !user ? 'Anonymous' : user.displayName,
      isAnonymous: isAnonymous || !user,
      author: user ? user.id : null,
      prayedCount: 0,
      commentCount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    requests.unshift(request);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { request };
  },
  
  pray: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request || request.isDeleted) {
      throw new Error('Request not found');
    }
    
    request.prayedCount++;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return {
      prayedCount: request.prayedCount,
      message: 'Your prayer has been noted. Thank you for lifting this up.'
    };
  },
  
  updateStatus: async (requestId, { status }, user) => {
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request) throw new Error('Request not found');
    
    request.status = status;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { request };
  },
  
  delete: async (requestId) => {
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request) throw new Error('Request not found');
    
    request.isDeleted = true;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { message: 'Request removed.' };
  }
};

// Real Requests API
const realRequestsAPI = {
  getAll: async (params) => {
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

// Mock Comments API
const mockCommentsAPI = {
  getByRequest: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
    const comments = allComments
      .filter(c => c.prayerRequest === requestId && !c.isDeleted)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return {
      comments: comments.map(c => ({
        id: c.id,
        body: c.body,
        authorName: c.authorName,
        authorId: c.author,
        createdAt: c.createdAt
      })),
      count: comments.length
    };
  },
  
  create: async (requestId, body, user) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const comment = {
      id: generateId('comment'),
      prayerRequest: requestId,
      author: user.id,
      authorName: user.displayName,
      body: body.trim(),
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
    
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
    allComments.push(comment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    
    // Update comment count
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.commentCount = (request.commentCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    }
    
    return {
      comment: {
        id: comment.id,
        body: comment.body,
        authorName: comment.authorName,
        authorId: comment.author,
        createdAt: comment.createdAt
      }
    };
  },
  
  delete: async (commentId, user) => {
    const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
    const comment = allComments.find(c => c.id === commentId);
    
    if (!comment) throw new Error('Comment not found');
    
    comment.isDeleted = true;
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    
    return { message: 'Comment removed' };
  }
};

// Real Comments API
const realCommentsAPI = {
  getByRequest: async (requestId) => apiCall(`/api/requests/${requestId}/comments`),
  
  create: async (requestId, body) => apiCall(`/api/requests/${requestId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body })
  }),
  
  delete: async (commentId) => apiCall(`/api/comments/${commentId}`, {
    method: 'DELETE'
  })
};

// Export APIs (switch between mock and real)
export const authAPI = USE_MOCK_API ? mockAuthAPI : realAuthAPI;
export const requestsAPI = USE_MOCK_API ? mockRequestsAPI : realRequestsAPI;
export const commentsAPI = USE_MOCK_API ? mockCommentsAPI : realCommentsAPI;

export default { authAPI, requestsAPI, commentsAPI };
