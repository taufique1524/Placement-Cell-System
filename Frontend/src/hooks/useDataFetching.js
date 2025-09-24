import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import cacheManager, { CacheKeys } from '../services/cacheManager.js';

// Import existing services
import { getLoggedInUserDetails } from '../utils/getLoggedInUserDetails.js';
import { getAllAnnouncements } from '../services/getAllAnnouncements.services.js';
import { getAllResults } from '../services/getAllResults.services.js';
import { getAllOpenings } from '../services/getAllOpenings.services.js';
import { getAllUsers } from '../services/getAllUsers.services.js';
import { getAllSelections } from '../services/getAllSelections.services.js';
import getSingleAnnouncementData from '../services/getSingleAnnouncementData.services.js';
import { getSingleOpening } from '../services/getSingleOpening.services.js';
import { getAllComments } from '../services/getAllComments.services.js';
import { getUserData } from '../services/getUserData.services.js';

/**
 * Hook for fetching user details with caching
 */
export function useUserDetails() {
  const { user, loading, errors, actions } = useData();
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async (force = false) => {
    // Check cache first unless forced
    if (!force && user && !loading.user) {
      return user;
    }

    actions.setLoading('user', true);
    actions.setError('user', null);

    try {
      const userData = await getLoggedInUserDetails();
      
      if (!userData || userData?.success === 0) {
        if (userData?.message === "Server error. Please try again later.") {
          actions.setUser({ isAdmin: false, _id: null });
          return { isAdmin: false, _id: null };
        }
        localStorage.removeItem('token');
        navigate('/login');
        return null;
      }
      
      actions.setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      const token = localStorage.getItem('token');
      if (token) {
        actions.setUser({ isAdmin: false, _id: null });
        return { isAdmin: false, _id: null };
      }
      localStorage.removeItem('token');
      navigate('/login');
      return null;
    } finally {
      actions.setLoading('user', false);
    }
  }, [user, loading.user, actions, navigate]);

  return {
    user,
    loading: loading.user,
    error: errors.user,
    fetchUserDetails,
    refetch: () => fetchUserDetails(true)
  };
}

/**
 * Hook for fetching announcements with caching
 */
export function useAnnouncements() {
  const { announcements, loading, errors, actions, lastFetch } = useData();
  const navigate = useNavigate();

  const fetchAnnouncements = useCallback(async (force = false) => {
    // Check if we should use cached data
    const cacheAge = Date.now() - (lastFetch.announcements || 0);
    const shouldFetch = force || !announcements.length || cacheAge > 2 * 60 * 1000; // 2 minutes

    if (!shouldFetch && !loading.announcements) {
      return announcements;
    }

    actions.setLoading('announcements', true);
    actions.setError('announcements', null);

    try {
      const data = await getAllAnnouncements();
      
      if (data?.success === 0) {
        navigate(`/errorPage/${data?.message}`);
        return [];
      }
      
      actions.setAnnouncements(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      actions.setError('announcements', 'Failed to load announcements');
      navigate('/errorPage/internal server error');
      return [];
    } finally {
      actions.setLoading('announcements', false);
    }
  }, [announcements, loading.announcements, lastFetch.announcements, actions, navigate]);

  return {
    announcements,
    loading: loading.announcements,
    error: errors.announcements,
    fetchAnnouncements,
    refetch: () => fetchAnnouncements(true)
  };
}

/**
 * Hook for fetching results with caching
 */
export function useResults() {
  const { results, loading, errors, actions, lastFetch } = useData();
  const navigate = useNavigate();

  const fetchResults = useCallback(async (force = false) => {
    const cacheAge = Date.now() - (lastFetch.results || 0);
    const shouldFetch = force || !results.length || cacheAge > 2 * 60 * 1000;

    if (!shouldFetch && !loading.results) {
      return results;
    }

    actions.setLoading('results', true);
    actions.setError('results', null);

    try {
      const data = await getAllResults();
      actions.setResults(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching results:', error);
      actions.setError('results', 'Failed to load results');
      navigate('/errorPage/Internal Error');
      return [];
    } finally {
      actions.setLoading('results', false);
    }
  }, [results, loading.results, lastFetch.results, actions, navigate]);

  return {
    results,
    loading: loading.results,
    error: errors.results,
    fetchResults,
    refetch: () => fetchResults(true)
  };
}

/**
 * Hook for fetching openings with caching
 */
export function useOpenings() {
  const { openings, loading, errors, actions, lastFetch } = useData();
  const navigate = useNavigate();

  const fetchOpenings = useCallback(async (force = false) => {
    const cacheAge = Date.now() - (lastFetch.openings || 0);
    const shouldFetch = force || !openings.length || cacheAge > 2 * 60 * 1000;

    if (!shouldFetch && !loading.openings) {
      return openings;
    }

    actions.setLoading('openings', true);
    actions.setError('openings', null);

    try {
      const data = await getAllOpenings();
      actions.setOpenings(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching openings:', error);
      actions.setError('openings', 'Failed to load openings');
      navigate('/errorPage/Internal Error');
      return [];
    } finally {
      actions.setLoading('openings', false);
    }
  }, [openings, loading.openings, lastFetch.openings, actions, navigate]);

  return {
    openings,
    loading: loading.openings,
    error: errors.openings,
    fetchOpenings,
    refetch: () => fetchOpenings(true)
  };
}

/**
 * Hook for fetching users with caching
 */
export function useUsers() {
  const { users, loading, errors, actions, lastFetch } = useData();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async (force = false) => {
    const cacheAge = Date.now() - (lastFetch.users || 0);
    const shouldFetch = force || !users.length || cacheAge > 5 * 60 * 1000; // 5 minutes for users

    if (!shouldFetch && !loading.users) {
      return users;
    }

    actions.setLoading('users', true);
    actions.setError('users', null);

    try {
      const data = await getAllUsers();
      actions.setUsers(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      actions.setError('users', 'Failed to load users');
      navigate('/errorPage/Internal Error');
      return [];
    } finally {
      actions.setLoading('users', false);
    }
  }, [users, loading.users, lastFetch.users, actions, navigate]);

  return {
    users,
    loading: loading.users,
    error: errors.users,
    fetchUsers,
    refetch: () => fetchUsers(true)
  };
}

/**
 * Hook for fetching selections with caching
 */
export function useSelections() {
  const { selections, loading, errors, actions, lastFetch } = useData();
  const navigate = useNavigate();

  const fetchSelections = useCallback(async (force = false) => {
    const cacheAge = Date.now() - (lastFetch.selections || 0);
    const shouldFetch = force || !selections.length || cacheAge > 2 * 60 * 1000;

    if (!shouldFetch && !loading.selections) {
      return selections;
    }

    actions.setLoading('selections', true);
    actions.setError('selections', null);

    try {
      const data = await getAllSelections();
      actions.setSelections(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching selections:', error);
      actions.setError('selections', 'Failed to load selections');
      navigate('/errorPage/Internal Error');
      return [];
    } finally {
      actions.setLoading('selections', false);
    }
  }, [selections, loading.selections, lastFetch.selections, actions, navigate]);

  return {
    selections,
    loading: loading.selections,
    error: errors.selections,
    fetchSelections,
    refetch: () => fetchSelections(true)
  };
}

/**
 * Hook for fetching single announcement with caching
 */
export function useSingleAnnouncement(id) {
  const navigate = useNavigate();

  const fetchSingleAnnouncement = useCallback(async (announcementId, force = false) => {
    if (!announcementId) return null;

    const cacheKey = CacheKeys.SINGLE_ANNOUNCEMENT(announcementId);

    // Check cache first unless forced
    if (!force) {
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await getSingleAnnouncementData(announcementId);
      const announcementData = { isResultsAnnouncement: 1, ...data };

      // Cache the result
      cacheManager.set(cacheKey, announcementData);
      return announcementData;
    } catch (error) {
      console.error('Error fetching single announcement:', error);
      navigate('/errorPage/internal error');
      return null;
    }
  }, [navigate]);

  return {
    fetchSingleAnnouncement: (force = false) => fetchSingleAnnouncement(id, force)
  };
}

/**
 * Hook for fetching single opening with caching
 */
export function useSingleOpening(id) {
  const navigate = useNavigate();

  const fetchSingleOpening = useCallback(async (openingId, force = false) => {
    if (!openingId) return null;

    const cacheKey = CacheKeys.SINGLE_OPENING(openingId);

    // Check cache first unless forced
    if (!force) {
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await getSingleOpening(openingId);

      // Cache the result
      cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching single opening:', error);
      navigate('/errorPage/internal error');
      return null;
    }
  }, [navigate]);

  return {
    fetchSingleOpening: (force = false) => fetchSingleOpening(id, force)
  };
}

/**
 * Hook for fetching comments with caching
 */
export function useComments(announcementId) {
  const navigate = useNavigate();

  const fetchComments = useCallback(async (id, force = false) => {
    if (!id) return [];

    const cacheKey = CacheKeys.COMMENTS(id);

    // Check cache first unless forced
    if (!force) {
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await getAllComments(id);

      // Cache the result with shorter TTL for comments (1 minute)
      cacheManager.set(cacheKey, data || [], 60 * 1000);
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      navigate('/errorPage/internal error');
      return [];
    }
  }, [navigate]);

  return {
    fetchComments: (force = false) => fetchComments(announcementId, force)
  };
}

/**
 * Hook for fetching user profile data with caching
 */
export function useUserProfile(userId) {
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (id, force = false) => {
    if (!id) return null;

    const cacheKey = CacheKeys.USER_PROFILE(id);

    // Check cache first unless forced
    if (!force) {
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await getUserData(id);

      // Cache the result
      cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigate('/errorPage/Internal Error');
      return null;
    }
  }, [navigate]);

  return {
    fetchUserProfile: (force = false) => fetchUserProfile(userId, force)
  };
}
