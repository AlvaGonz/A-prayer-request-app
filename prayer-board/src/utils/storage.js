/**
 * Safely wraps localStorage to prevent quota errors or access exceptions
 * heavily occurring in iOS/Safari Private Mode from crashing the application.
 */

const getStorage = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
    } catch (e) {
        // Access denied (e.g., Safari Private Mode)
        console.warn('localStorage is not accessible:', e);
    }
    return null;
};

// In-memory fallback if storage is completely inaccessible
const memStore = {};

export const safeStorage = {
    getItem: (key) => {
        const storage = getStorage();
        if (storage) {
            try {
                return storage.getItem(key);
            } catch (e) {
                console.warn(`Error reading ${key} from localStorage`, e);
            }
        }
        return memStore[key] || null;
    },

    setItem: (key, value) => {
        const storage = getStorage();
        if (storage) {
            try {
                storage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn(`Error setting ${key} in localStorage. Possibly quota exceeded or private mode.`, e);
            }
        }
        memStore[key] = value;
        return false;
    },

    removeItem: (key) => {
        const storage = getStorage();
        if (storage) {
            try {
                storage.removeItem(key);
                return true;
            } catch (e) {
                console.warn(`Error removing ${key} from localStorage`, e);
            }
        }
        delete memStore[key];
        return false;
    },

    clear: () => {
        const storage = getStorage();
        if (storage) {
            try {
                storage.clear();
                return true;
            } catch (e) {
                console.warn('Error clearing localStorage', e);
            }
        }
        Object.keys(memStore).forEach(key => delete memStore[key]);
        return false;
    }
};

export default safeStorage;

// ============================================================================
// SESSION STORAGE - For auth tokens (dies when tab closes, reduces XSS surface)
// ============================================================================

const getSessionStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
  } catch (e) {
    console.warn('sessionStorage is not accessible:', e);
  }
  return null;
};

// Separate in-memory fallback for session storage
const sessionMemStore = {};

export const safeSessionStorage = {
  getItem: (key) => {
    const storage = getSessionStorage();
    if (storage) {
      try { return storage.getItem(key); }
      catch (e) { console.warn(`Error reading ${key} from sessionStorage`, e); }
    }
    return sessionMemStore[key] || null;
  },

  setItem: (key, value) => {
    const storage = getSessionStorage();
    if (storage) {
      try { storage.setItem(key, value); return true; }
      catch (e) { console.warn(`Error setting ${key} in sessionStorage`, e); }
    }
    sessionMemStore[key] = value;
    return false;
  },

  removeItem: (key) => {
    const storage = getSessionStorage();
    if (storage) {
      try { storage.removeItem(key); return true; }
      catch (e) { console.warn(`Error removing ${key} from sessionStorage`, e); }
    }
    delete sessionMemStore[key];
    return false;
  },

  clear: () => {
    const storage = getSessionStorage();
    if (storage) {
      try { storage.clear(); return true; }
      catch (e) { console.warn('Error clearing sessionStorage', e); }
    }
    Object.keys(sessionMemStore).forEach(k => delete sessionMemStore[k]);
    return false;
  }
};
