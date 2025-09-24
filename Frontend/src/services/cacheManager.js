/**
 * Cache Manager Service
 * Handles client-side caching with localStorage persistence
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
    this.storageKey = 'pcell_cache';
    this.loadFromStorage();
  }

  /**
   * Load cache from localStorage on initialization
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Convert back to Map and check expiration
        Object.entries(parsedData).forEach(([key, value]) => {
          if (value.expiresAt > Date.now()) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      this.clearStorage();
    }
  }

  /**
   * Save cache to localStorage
   */
  saveToStorage() {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      localStorage.setItem(this.storageKey, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
      // If storage is full, clear old entries and try again
      this.clearExpired();
      try {
        const cacheObject = Object.fromEntries(this.cache);
        localStorage.setItem(this.storageKey, JSON.stringify(cacheObject));
      } catch (retryError) {
        console.error('Failed to save cache after cleanup:', retryError);
      }
    }
  }

  /**
   * Set data in cache with optional TTL
   */
  set(key, data, ttl = this.defaultTTL) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      ttl
    };
    
    this.cache.set(key, cacheEntry);
    this.saveToStorage();
  }

  /**
   * Get data from cache
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return entry.data;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key from cache
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.clearStorage();
  }

  /**
   * Clear localStorage
   */
  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear cache storage:', error);
    }
  }

  /**
   * Remove expired entries
   */
  clearExpired() {
    const now = Date.now();
    let hasExpired = false;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        hasExpired = true;
      }
    }
    
    if (hasExpired) {
      this.saveToStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;
    
    for (const entry of this.cache.values()) {
      if (entry.expiresAt <= now) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
      storageSize: this.getStorageSize()
    };
  }

  /**
   * Get approximate storage size
   */
  getStorageSize() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? stored.length : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    let invalidated = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    
    if (invalidated > 0) {
      this.saveToStorage();
    }
    
    return invalidated;
  }

  /**
   * Update cache entry without changing expiration
   */
  update(key, data) {
    const entry = this.cache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      entry.data = data;
      this.cache.set(key, entry);
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Cache key generators
export const CacheKeys = {
  USER_DETAILS: (userId) => `user_details_${userId}`,
  LOGGED_IN_USER: 'logged_in_user',
  ALL_ANNOUNCEMENTS: 'all_announcements',
  ALL_RESULTS: 'all_results',
  ALL_OPENINGS: 'all_openings',
  ALL_USERS: 'all_users',
  ALL_SELECTIONS: 'all_selections',
  SINGLE_ANNOUNCEMENT: (id) => `announcement_${id}`,
  SINGLE_OPENING: (id) => `opening_${id}`,
  COMMENTS: (announcementId) => `comments_${announcementId}`,
  USER_PROFILE: (userId) => `user_profile_${userId}`
};

export default cacheManager;
