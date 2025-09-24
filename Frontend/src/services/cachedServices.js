/**
 * Cached Services Layer
 * Wraps existing services with caching functionality
 */

import cacheManager, { CacheKeys } from './cacheManager.js';

// Import original services
import { getAllAnnouncements } from './getAllAnnouncements.services.js';
import { getAllResults } from './getAllResults.services.js';
import { getAllOpenings } from './getAllOpenings.services.js';
import { getAllUsers } from './getAllUsers.services.js';
import { getAllSelections } from './getAllSelections.services.js';
import getSingleAnnouncementData from './getSingleAnnouncementData.services.js';
import { getSingleOpening } from './getSingleOpening.services.js';
import { getAllComments } from './getAllComments.services.js';
import { getUserData } from './getUserData.services.js';
import { getLoggedInUserDetails } from '../utils/getLoggedInUserDetails.js';
import { postAnnouncement } from './postAnnouncements.services.js';
import { postResult } from './postResult.services.js';
import { deleteAnnouncement } from './deleteAnnouncement.services.js';
import { addComment } from './addComment.services.js';

/**
 * Cached version of getAllAnnouncements
 */
export const getCachedAnnouncements = async (force = false) => {
  const cacheKey = CacheKeys.ALL_ANNOUNCEMENTS;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached announcements');
      return cached;
    }
  }
  
  console.log('Fetching fresh announcements');
  const data = await getAllAnnouncements();
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getAllResults
 */
export const getCachedResults = async (force = false) => {
  const cacheKey = CacheKeys.ALL_RESULTS;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached results');
      return cached;
    }
  }
  
  console.log('Fetching fresh results');
  const data = await getAllResults();
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getAllOpenings
 */
export const getCachedOpenings = async (force = false) => {
  const cacheKey = CacheKeys.ALL_OPENINGS;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached openings');
      return cached;
    }
  }
  
  console.log('Fetching fresh openings');
  const data = await getAllOpenings();
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getAllUsers
 */
export const getCachedUsers = async (force = false) => {
  const cacheKey = CacheKeys.ALL_USERS;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached users');
      return cached;
    }
  }
  
  console.log('Fetching fresh users');
  const data = await getAllUsers();
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getAllSelections
 */
export const getCachedSelections = async (force = false) => {
  const cacheKey = CacheKeys.ALL_SELECTIONS;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached selections');
      return cached;
    }
  }
  
  console.log('Fetching fresh selections');
  const data = await getAllSelections();
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getLoggedInUserDetails
 */
export const getCachedUserDetails = async (force = false) => {
  const cacheKey = CacheKeys.LOGGED_IN_USER;
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      console.log('Using cached user details');
      return cached;
    }
  }
  
  console.log('Fetching fresh user details');
  const data = await getLoggedInUserDetails();
  if (data && data.success !== 0) {
    cacheManager.set(cacheKey, data);
  }
  return data;
};

/**
 * Cached version of getSingleAnnouncementData
 */
export const getCachedSingleAnnouncement = async (id, force = false) => {
  const cacheKey = CacheKeys.SINGLE_ANNOUNCEMENT(id);
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
     // console.log(`Using cached announcement ${id}`);
      return cached;
    }
  }
  
  //console.log(`Fetching fresh announcement ${id}`);
  const data = await getSingleAnnouncementData(id);
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getSingleOpening
 */
export const getCachedSingleOpening = async (id, force = false) => {
  const cacheKey = CacheKeys.SINGLE_OPENING(id);
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
     // console.log(`Using cached opening ${id}`);
      return cached;
    }
  }
  
 // console.log(`Fetching fresh opening ${id}`);
  const data = await getSingleOpening(id);
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cached version of getAllComments
 */
export const getCachedComments = async (announcementId, force = false) => {
  const cacheKey = CacheKeys.COMMENTS(announcementId);
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
    //  console.log(`Using cached comments for ${announcementId}`);
      return cached;
    }
  }
  
 // console.log(`Fetching fresh comments for ${announcementId}`);
  const data = await getAllComments(announcementId);
  // Cache comments for shorter time (1 minute)
  cacheManager.set(cacheKey, data, 60 * 1000);
  return data;
};

/**
 * Cached version of getUserData
 */
export const getCachedUserProfile = async (userId, force = false) => {
  const cacheKey = CacheKeys.USER_PROFILE(userId);
  
  if (!force) {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
     // console.log(`Using cached user profile ${userId}`);
      return cached;
    }
  }
  
 // console.log(`Fetching fresh user profile ${userId}`);
  const data = await getUserData(userId);
  cacheManager.set(cacheKey, data);
  return data;
};

/**
 * Cache invalidation helpers
 */
export const invalidateCache = {
  announcements: () => {
    cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);
    cacheManager.invalidatePattern('announcement_');
  },
  
  results: () => {
    cacheManager.delete(CacheKeys.ALL_RESULTS);
  },
  
  openings: () => {
    cacheManager.delete(CacheKeys.ALL_OPENINGS);
    cacheManager.invalidatePattern('opening_');
  },
  
  users: () => {
    cacheManager.delete(CacheKeys.ALL_USERS);
    cacheManager.invalidatePattern('user_profile_');
  },
  
  selections: () => {
    cacheManager.delete(CacheKeys.ALL_SELECTIONS);
  },
  
  userDetails: () => {
    cacheManager.delete(CacheKeys.LOGGED_IN_USER);
  },
  
  comments: (announcementId) => {
    if (announcementId) {
      cacheManager.delete(CacheKeys.COMMENTS(announcementId));
    } else {
      cacheManager.invalidatePattern('comments_');
    }
  },
  
  all: () => {
    cacheManager.clear();
  }
};

/**
 * Enhanced service functions with cache invalidation
 */
export const cachedPostAnnouncement = async (e, setValue, value, setAllAnnouncements) => {
  const result = await postAnnouncement(e, setValue, value, setAllAnnouncements);
  // Invalidate announcements cache after posting
  invalidateCache.announcements();
  return result;
};

export const cachedPostResult = async (e, setValue, value, setAllAnnouncements) => {
  const result = await postResult(e, setValue, value, setAllAnnouncements);
  // Invalidate results cache after posting
  invalidateCache.results();
  return result;
};

export const cachedDeleteAnnouncement = async (...args) => {
  const result = await deleteAnnouncement(...args);
  // Invalidate announcements cache after deletion
  invalidateCache.announcements();
  return result;
};

export const cachedAddComment = async (commentMessage, announcementId) => {
  const result = await addComment(commentMessage, announcementId);
  // Invalidate comments cache for this announcement
  invalidateCache.comments(announcementId);
  return result;
};

/**
 * Utility function to refresh all cached data
 */
export const refreshAllCache = async () => {
  console.log('Refreshing all cached data...');
  
  const promises = [
    getCachedUserDetails(true),
    getCachedAnnouncements(true),
    getCachedResults(true),
    getCachedOpenings(true),
    getCachedUsers(true),
    getCachedSelections(true)
  ];
  
  try {
    await Promise.allSettled(promises);
    console.log('Cache refresh completed');
  } catch (error) {
    console.error('Error refreshing cache:', error);
  }
};

/**
 * Utility function to preload essential data
 */
export const preloadEssentialData = async () => {
  console.log('Preloading essential data...');
  
  try {
    // Load user details first
    await getCachedUserDetails();
    
    // Then load other essential data in parallel
    await Promise.allSettled([
      getCachedAnnouncements(),
      getCachedOpenings()
    ]);
    
    console.log('Essential data preloaded');
  } catch (error) {
    console.error('Error preloading data:', error);
  }
};
