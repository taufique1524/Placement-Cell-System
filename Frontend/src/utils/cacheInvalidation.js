/**
 * Cache Invalidation Utilities
 * Provides centralized cache invalidation strategies
 */

import cacheManager, { CacheKeys } from '../services/cacheManager.js';

/**
 * Cache invalidation strategies for different data types
 */
export const CacheInvalidation = {
  /**
   * Invalidate all announcement-related cache
   */
  announcements: {
    all: () => {
      cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);
      cacheManager.invalidatePattern('announcement_');
      console.log('Invalidated all announcement cache');
    },
    
    single: (id) => {
      cacheManager.delete(CacheKeys.SINGLE_ANNOUNCEMENT(id));
     // console.log(`Invalidated cache for announcement ${id}`);
    },
    
    afterCreate: (newAnnouncement) => {
      // Invalidate list cache to force refresh
      cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);
      console.log('Invalidated announcement list cache after creation');
    },
    
    afterUpdate: (updatedAnnouncement) => {
      // Invalidate both list and single item cache
      cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);
      cacheManager.delete(CacheKeys.SINGLE_ANNOUNCEMENT(updatedAnnouncement._id));
     // console.log(`Invalidated announcement cache after update: ${updatedAnnouncement._id}`);
    },
    
    afterDelete: (deletedId) => {
      // Invalidate both list and single item cache
      cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);
      cacheManager.delete(CacheKeys.SINGLE_ANNOUNCEMENT(deletedId));
     // console.log(`Invalidated announcement cache after deletion: ${deletedId}`);
    }
  },

  /**
   * Invalidate all results-related cache
   */
  results: {
    all: () => {
      cacheManager.delete(CacheKeys.ALL_RESULTS);
      console.log('Invalidated all results cache');
    },
    
    afterCreate: () => {
      cacheManager.delete(CacheKeys.ALL_RESULTS);
      console.log('Invalidated results cache after creation');
    },
    
    afterUpdate: () => {
      cacheManager.delete(CacheKeys.ALL_RESULTS);
      console.log('Invalidated results cache after update');
    },
    
    afterDelete: () => {
      cacheManager.delete(CacheKeys.ALL_RESULTS);
      console.log('Invalidated results cache after deletion');
    }
  },

  /**
   * Invalidate all opening-related cache
   */
  openings: {
    all: () => {
      cacheManager.delete(CacheKeys.ALL_OPENINGS);
      cacheManager.invalidatePattern('opening_');
      console.log('Invalidated all opening cache');
    },
    
    single: (id) => {
      cacheManager.delete(CacheKeys.SINGLE_OPENING(id));
      // console.log(`Invalidated cache for opening ${id}`);
    },
    
    afterCreate: (newOpening) => {
      cacheManager.delete(CacheKeys.ALL_OPENINGS);
      console.log('Invalidated opening list cache after creation');
    },
    
    afterUpdate: (updatedOpening) => {
      cacheManager.delete(CacheKeys.ALL_OPENINGS);
      cacheManager.delete(CacheKeys.SINGLE_OPENING(updatedOpening._id));
     // console.log(`Invalidated opening cache after update: ${updatedOpening._id}`);
    },
    
    afterDelete: (deletedId) => {
      cacheManager.delete(CacheKeys.ALL_OPENINGS);
      cacheManager.delete(CacheKeys.SINGLE_OPENING(deletedId));
     // console.log(`Invalidated opening cache after deletion: ${deletedId}`);
    }
  },

  /**
   * Invalidate all user-related cache
   */
  users: {
    all: () => {
      cacheManager.delete(CacheKeys.ALL_USERS);
      cacheManager.invalidatePattern('user_profile_');
      cacheManager.invalidatePattern('user_details_');
      console.log('Invalidated all user cache');
    },
    
    profile: (userId) => {
      cacheManager.delete(CacheKeys.USER_PROFILE(userId));
      cacheManager.delete(CacheKeys.USER_DETAILS(userId));
     // console.log(`Invalidated cache for user profile ${userId}`);
    },
    
    loggedInUser: () => {
      cacheManager.delete(CacheKeys.LOGGED_IN_USER);
      console.log('Invalidated logged in user cache');
    },
    
    afterUpdate: (updatedUser) => {
      // Invalidate user list and specific user caches
      cacheManager.delete(CacheKeys.ALL_USERS);
      cacheManager.delete(CacheKeys.USER_PROFILE(updatedUser._id));
      cacheManager.delete(CacheKeys.USER_DETAILS(updatedUser._id));
      
      // If it's the logged in user, invalidate that too
      const loggedInUser = cacheManager.get(CacheKeys.LOGGED_IN_USER);
      if (loggedInUser && loggedInUser._id === updatedUser._id) {
        cacheManager.delete(CacheKeys.LOGGED_IN_USER);
      }
      
     // console.log(`Invalidated user cache after update: ${updatedUser._id}`);
    }
  },

  /**
   * Invalidate all selection-related cache
   */
  selections: {
    all: () => {
      cacheManager.delete(CacheKeys.ALL_SELECTIONS);
      console.log('Invalidated all selections cache');
    },
    
    afterCreate: () => {
      cacheManager.delete(CacheKeys.ALL_SELECTIONS);
      console.log('Invalidated selections cache after creation');
    },
    
    afterUpdate: () => {
      cacheManager.delete(CacheKeys.ALL_SELECTIONS);
      console.log('Invalidated selections cache after update');
    },
    
    afterDelete: () => {
      cacheManager.delete(CacheKeys.ALL_SELECTIONS);
      console.log('Invalidated selections cache after deletion');
    }
  },

  /**
   * Invalidate all comment-related cache
   */
  comments: {
    forAnnouncement: (announcementId) => {
      cacheManager.delete(CacheKeys.COMMENTS(announcementId));
     // console.log(`Invalidated comments cache for announcement ${announcementId}`);
    },
    
    all: () => {
      cacheManager.invalidatePattern('comments_');
      console.log('Invalidated all comments cache');
    },
    
    afterCreate: (announcementId) => {
      cacheManager.delete(CacheKeys.COMMENTS(announcementId));
     // console.log(`Invalidated comments cache after creation for announcement ${announcementId}`);
    },
    
    afterUpdate: (announcementId) => {
      cacheManager.delete(CacheKeys.COMMENTS(announcementId));
     // console.log(`Invalidated comments cache after update for announcement ${announcementId}`);
    },
    
    afterDelete: (announcementId) => {
      cacheManager.delete(CacheKeys.COMMENTS(announcementId));
     //  console.log(`Invalidated comments cache after deletion for announcement ${announcementId}`);
    }
  },

  /**
   * Invalidate all cache (nuclear option)
   */
  everything: () => {
    cacheManager.clear();
    console.log('Invalidated ALL cache');
  },

  /**
   * Smart invalidation based on user actions
   */
  onUserAction: {
    login: (userData) => {
      // Clear all cache on login to ensure fresh data
      cacheManager.clear();
      console.log('Cleared all cache on user login');
    },
    
    logout: () => {
      // Clear all cache on logout
      cacheManager.clear();
      console.log('Cleared all cache on user logout');
    },
    
    profileUpdate: (userId) => {
      CacheInvalidation.users.profile(userId);
      CacheInvalidation.users.loggedInUser();
    }
  },

  /**
   * Time-based invalidation
   */
  onTimeInterval: {
    // Invalidate stale cache every 10 minutes
    staleData: () => {
      const staleThreshold = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      
      // Check and invalidate stale announcements
      const announcementsCache = cacheManager.get(CacheKeys.ALL_ANNOUNCEMENTS);
      if (announcementsCache && (now - announcementsCache.timestamp) > staleThreshold) {
        CacheInvalidation.announcements.all();
      }
      
      // Check and invalidate stale openings
      const openingsCache = cacheManager.get(CacheKeys.ALL_OPENINGS);
      if (openingsCache && (now - openingsCache.timestamp) > staleThreshold) {
        CacheInvalidation.openings.all();
      }
      
      console.log('Performed time-based cache invalidation check');
    }
  }
};

/**
 * Auto-setup cache invalidation intervals
 */
export const setupCacheInvalidation = () => {
  // Set up periodic stale data cleanup (every 5 minutes)
  setInterval(() => {
    cacheManager.clearExpired();
    CacheInvalidation.onTimeInterval.staleData();
  }, 5 * 60 * 1000);
  
  console.log('Cache invalidation intervals set up');
};

/**
 * Utility to invalidate cache based on API response patterns
 */
export const invalidateOnApiResponse = (apiEndpoint, method, data) => {
  const endpoint = apiEndpoint.toLowerCase();
  const httpMethod = method.toLowerCase();
  
  // Announcements
  if (endpoint.includes('announcements')) {
    if (httpMethod === 'post') {
      CacheInvalidation.announcements.afterCreate(data);
    } else if (httpMethod === 'put' || httpMethod === 'patch') {
      CacheInvalidation.announcements.afterUpdate(data);
    } else if (httpMethod === 'delete') {
      CacheInvalidation.announcements.afterDelete(data.id || data._id);
    }
  }
  
  // Openings
  if (endpoint.includes('opening')) {
    if (httpMethod === 'post') {
      CacheInvalidation.openings.afterCreate(data);
    } else if (httpMethod === 'put' || httpMethod === 'patch') {
      CacheInvalidation.openings.afterUpdate(data);
    } else if (httpMethod === 'delete') {
      CacheInvalidation.openings.afterDelete(data.id || data._id);
    }
  }
  
  // Comments
  if (endpoint.includes('comments')) {
    const announcementId = data.announcementId || data.announcement_id;
    if (httpMethod === 'post') {
      CacheInvalidation.comments.afterCreate(announcementId);
    } else if (httpMethod === 'put' || httpMethod === 'patch') {
      CacheInvalidation.comments.afterUpdate(announcementId);
    } else if (httpMethod === 'delete') {
      CacheInvalidation.comments.afterDelete(announcementId);
    }
  }
  
  // Users
  if (endpoint.includes('user')) {
    if (httpMethod === 'put' || httpMethod === 'patch') {
      CacheInvalidation.users.afterUpdate(data);
    }
  }
  
  // Selections
  if (endpoint.includes('selection')) {
    if (httpMethod === 'post') {
      CacheInvalidation.selections.afterCreate();
    } else if (httpMethod === 'put' || httpMethod === 'patch') {
      CacheInvalidation.selections.afterUpdate();
    } else if (httpMethod === 'delete') {
      CacheInvalidation.selections.afterDelete();
    }
  }
};

export default CacheInvalidation;
