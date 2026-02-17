// Mock API layer for offline development
// Replace these with real API calls when backend is ready

const STORAGE_KEYS = {
  USER: 'prayerBoard_user',
  TOKEN: 'prayerBoard_token',
  REQUESTS: 'prayerBoard_requests',
  INTERACTIONS: 'prayerBoard_interactions',
  USER_ID_COUNTER: 'prayerBoard_userIdCounter',
  REQUEST_ID_COUNTER: 'prayerBoard_requestIdCounter'
};

// Helper to generate IDs
const generateId = (prefix) => {
  const counterKey = prefix === 'user' ? STORAGE_KEYS.USER_ID_COUNTER : STORAGE_KEYS.REQUEST_ID_COUNTER;
  let counter = parseInt(localStorage.getItem(counterKey) || '0');
  counter++;
  localStorage.setItem(counterKey, counter.toString());
  return `${prefix}_${Date.now()}_${counter}`;
};

// Mock data initialization
const initMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    const sampleRequests = [
      {
        id: generateId('req'),
        body: "Please pray for my mother's surgery tomorrow. She has been battling health issues and we are trusting God for a successful outcome.",
        authorName: "Sarah M.",
        isAnonymous: false,
        prayedCount: 12,
        status: 'open',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isDeleted: false
      },
      {
        id: generateId('req'),
        body: "Going through a difficult season in my marriage. Praying for reconciliation and God's guidance.",
        authorName: "Anonymous",
        isAnonymous: true,
        prayedCount: 5,
        status: 'open',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        isDeleted: false
      },
      {
        id: generateId('req'),
        body: "Please pray for my job interview this Friday. I've been unemployed for 3 months and this opportunity would be a blessing for my family.",
        authorName: "Michael R.",
        isAnonymous: false,
        prayedCount: 8,
        status: 'open',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        isDeleted: false
      },
      {
        id: generateId('req'),
        body: "Thank you all for your prayers last month. My father's cancer treatment is working and his recent scan showed improvement! Glory to God!",
        authorName: "Anonymous",
        isAnonymous: true,
        prayedCount: 24,
        status: 'answered',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isDeleted: false
      },
      {
        id: generateId('req'),
        body: "Praying for peace and comfort for a friend who lost their child recently. The grief is overwhelming.",
        authorName: "Jennifer K.",
        isAnonymous: false,
        prayedCount: 18,
        status: 'open',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        isDeleted: false
      }
    ];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(sampleRequests));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.INTERACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify([]));
  }
};

// Initialize mock data on load
initMockData();

// Auth API
export const authAPI = {
  register: async ({ displayName, email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
    
    const users = JSON.parse(localStorage.getItem('prayerBoard_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const user = {
      id: generateId('user'),
      displayName,
      email,
      role: 'member',
      passwordHash: btoa(password), // Mock hash
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    localStorage.setItem('prayerBoard_users', JSON.stringify(users));
    
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    
    return { token, user };
  },
  
  login: async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('prayerBoard_users') || '[]');
    const user = users.find(u => u.email === email && u.passwordHash === btoa(password));
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
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

// Requests API
export const requestsAPI = {
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
    
    if (!body || body.length < 10 || body.length > 1000) {
      throw new Error('Request body must be between 10 and 1000 characters');
    }
    
    const request = {
      id: generateId('req'),
      body: body.trim(),
      authorName: isAnonymous || !user ? 'Anonymous' : user.displayName,
      isAnonymous: isAnonymous || !user,
      author: user ? user.id : null,
      prayedCount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    requests.unshift(request);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { request };
  },
  
  pray: async (requestId, user = null) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request || request.isDeleted) {
      throw new Error('Request not found');
    }
    
    const interactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERACTIONS) || '[]');
    
    // Check for duplicate prayers from registered users
    if (user) {
      const alreadyPrayed = interactions.find(
        i => i.request === requestId && i.user === user.id
      );
      if (alreadyPrayed) {
        throw new Error('You have already prayed for this request');
      }
    }
    
    // Record interaction
    interactions.push({
      id: generateId('int'),
      request: requestId,
      user: user ? user.id : null,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
    
    // Increment count
    request.prayedCount++;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return {
      prayedCount: request.prayedCount,
      message: 'Your prayer has been noted. Thank you for lifting this up.'
    };
  },
  
  updateStatus: async (requestId, { status }, user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user) throw new Error('Authentication required');
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request || request.isDeleted) {
      throw new Error('Request not found');
    }
    
    // Check permissions
    const isAuthor = request.author === user.id;
    const isAdmin = user.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      throw new Error('Not authorized');
    }
    
    // Validate transitions
    if (status === 'answered' && !isAuthor) {
      throw new Error('Only the author can mark as answered');
    }
    
    if (['hidden', 'archived'].includes(status) && !isAdmin) {
      throw new Error('Only admins can hide or archive');
    }
    
    request.status = status;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { request };
  },
  
  delete: async (requestId, user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Request not found');
    }
    
    request.isDeleted = true;
    request.deletedBy = user.id;
    request.deletedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    return { message: 'Request removed.' };
  }
};

// Notifications API (high-level wiring)
export const notificationsAPI = {
  subscribe: async (subscription, user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user) throw new Error('Authentication required');
    
    // In real implementation, send to backend
    // For now, just store in user object
    const users = JSON.parse(localStorage.getItem('prayerBoard_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex].pushSubscription = subscription;
      localStorage.setItem('prayerBoard_users', JSON.stringify(users));
    }
    
    return { success: true };
  }
};

// Comments API
const COMMENTS_KEY = 'prayerBoard_comments';

export const commentsAPI = {
  getByRequest: async (requestId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    const comments = allComments
      .filter(c => c.prayerRequest === requestId && !c.isDeleted)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return {
      comments: comments.map(c => ({
        id: c.id,
        body: c.body,
        authorName: c.authorName,
        authorId: c.author,
        createdAt: c.createdAt,
        canDelete: true // In real app, check auth
      })),
      count: comments.length
    };
  },
  
  create: async (requestId, body, user) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!user) throw new Error('Authentication required');
    
    if (!body || body.trim().length < 1 || body.trim().length > 500) {
      throw new Error('Comment must be between 1 and 500 characters');
    }
    
    const comment = {
      id: generateId('comment'),
      prayerRequest: requestId,
      author: user.id,
      authorName: user.displayName,
      body: body.trim(),
      isDeleted: false,
      createdAt: new Date().toISOString()
    };
    
    const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    allComments.push(comment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    // Update comment count on request
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
      },
      message: 'Comment added successfully'
    };
  },
  
  delete: async (commentId, user) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!user) throw new Error('Authentication required');
    
    const allComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    const comment = allComments.find(c => c.id === commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    // Check permissions
    const isAuthor = comment.author === user.id;
    const isAdmin = user.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      throw new Error('Not authorized to delete this comment');
    }
    
    // Soft delete
    comment.isDeleted = true;
    comment.deletedBy = user.id;
    comment.deletedAt = new Date().toISOString();
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    // Update comment count on request
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const request = requests.find(r => r.id === comment.prayerRequest);
    if (request && request.commentCount > 0) {
      request.commentCount--;
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    }
    
    return { message: 'Comment removed' };
  }
};

export default { authAPI, requestsAPI, notificationsAPI, commentsAPI };
