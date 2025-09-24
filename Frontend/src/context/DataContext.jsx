import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cacheManager, { CacheKeys } from '../services/cacheManager.js';

// Initial state
const initialState = {
  user: null,
  announcements: [],
  results: [],
  openings: [],
  users: [],
  selections: [],
  loading: {
    user: false,
    announcements: false,
    results: false,
    openings: false,
    users: false,
    selections: false
  },
  errors: {
    user: null,
    announcements: null,
    results: null,
    openings: null,
    users: null,
    selections: null
  },
  lastFetch: {
    user: null,
    announcements: null,
    results: null,
    openings: null,
    users: null,
    selections: null
  }
};

// Action types
export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_ANNOUNCEMENTS: 'SET_ANNOUNCEMENTS',
  SET_RESULTS: 'SET_RESULTS',
  SET_OPENINGS: 'SET_OPENINGS',
  SET_USERS: 'SET_USERS',
  SET_SELECTIONS: 'SET_SELECTIONS',
  ADD_ANNOUNCEMENT: 'ADD_ANNOUNCEMENT',
  UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
  DELETE_ANNOUNCEMENT: 'DELETE_ANNOUNCEMENT',
  ADD_OPENING: 'ADD_OPENING',
  UPDATE_OPENING: 'UPDATE_OPENING',
  DELETE_OPENING: 'DELETE_OPENING',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
  SET_LAST_FETCH: 'SET_LAST_FETCH'
};

// Reducer function
function dataReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        errors: { ...state.errors, user: null }
      };

    case ActionTypes.SET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload,
        errors: { ...state.errors, announcements: null }
      };

    case ActionTypes.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        errors: { ...state.errors, results: null }
      };

    case ActionTypes.SET_OPENINGS:
      return {
        ...state,
        openings: action.payload,
        errors: { ...state.errors, openings: null }
      };

    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
        errors: { ...state.errors, users: null }
      };

    case ActionTypes.SET_SELECTIONS:
      return {
        ...state,
        selections: action.payload,
        errors: { ...state.errors, selections: null }
      };

    case ActionTypes.ADD_ANNOUNCEMENT:
      const newAnnouncements = [action.payload, ...state.announcements];
      // Update cache
      cacheManager.set(CacheKeys.ALL_ANNOUNCEMENTS, newAnnouncements);
      return {
        ...state,
        announcements: newAnnouncements
      };

    case ActionTypes.UPDATE_ANNOUNCEMENT:
      const updatedAnnouncements = state.announcements.map(item =>
        item._id === action.payload._id ? action.payload : item
      );
      // Update cache
      cacheManager.set(CacheKeys.ALL_ANNOUNCEMENTS, updatedAnnouncements);
      cacheManager.set(CacheKeys.SINGLE_ANNOUNCEMENT(action.payload._id), action.payload);
      return {
        ...state,
        announcements: updatedAnnouncements
      };

    case ActionTypes.DELETE_ANNOUNCEMENT:
      const filteredAnnouncements = state.announcements.filter(item => item._id !== action.payload);
      // Update cache
      cacheManager.set(CacheKeys.ALL_ANNOUNCEMENTS, filteredAnnouncements);
      cacheManager.delete(CacheKeys.SINGLE_ANNOUNCEMENT(action.payload));
      return {
        ...state,
        announcements: filteredAnnouncements
      };

    case ActionTypes.ADD_OPENING:
      const newOpenings = [action.payload, ...state.openings];
      // Update cache
      cacheManager.set(CacheKeys.ALL_OPENINGS, newOpenings);
      return {
        ...state,
        openings: newOpenings
      };

    case ActionTypes.UPDATE_OPENING:
      const updatedOpenings = state.openings.map(item =>
        item._id === action.payload._id ? action.payload : item
      );
      // Update cache
      cacheManager.set(CacheKeys.ALL_OPENINGS, updatedOpenings);
      cacheManager.set(CacheKeys.SINGLE_OPENING(action.payload._id), action.payload);
      return {
        ...state,
        openings: updatedOpenings
      };

    case ActionTypes.DELETE_OPENING:
      const filteredOpenings = state.openings.filter(item => item._id !== action.payload);
      // Update cache
      cacheManager.set(CacheKeys.ALL_OPENINGS, filteredOpenings);
      cacheManager.delete(CacheKeys.SINGLE_OPENING(action.payload));
      return {
        ...state,
        openings: filteredOpenings
      };

    case ActionTypes.CLEAR_ALL_DATA:
      cacheManager.clear();
      return initialState;

    case ActionTypes.SET_LAST_FETCH:
      return {
        ...state,
        lastFetch: {
          ...state.lastFetch,
          [action.payload.key]: action.payload.timestamp
        }
      };

    default:
      return state;
  }
}

// Create context
const DataContext = createContext();

// Provider component
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      // Load user data
      const cachedUser = cacheManager.get(CacheKeys.LOGGED_IN_USER);
      if (cachedUser) {
        dispatch({ type: ActionTypes.SET_USER, payload: cachedUser });
      }

      // Load announcements
      const cachedAnnouncements = cacheManager.get(CacheKeys.ALL_ANNOUNCEMENTS);
      if (cachedAnnouncements) {
        dispatch({ type: ActionTypes.SET_ANNOUNCEMENTS, payload: cachedAnnouncements });
      }

      // Load results
      const cachedResults = cacheManager.get(CacheKeys.ALL_RESULTS);
      if (cachedResults) {
        dispatch({ type: ActionTypes.SET_RESULTS, payload: cachedResults });
      }

      // Load openings
      const cachedOpenings = cacheManager.get(CacheKeys.ALL_OPENINGS);
      if (cachedOpenings) {
        dispatch({ type: ActionTypes.SET_OPENINGS, payload: cachedOpenings });
      }

      // Load users
      const cachedUsers = cacheManager.get(CacheKeys.ALL_USERS);
      if (cachedUsers) {
        dispatch({ type: ActionTypes.SET_USERS, payload: cachedUsers });
      }

      // Load selections
      const cachedSelections = cacheManager.get(CacheKeys.ALL_SELECTIONS);
      if (cachedSelections) {
        dispatch({ type: ActionTypes.SET_SELECTIONS, payload: cachedSelections });
      }
    };

    loadCachedData();
  }, []);

  // Helper functions for actions
  const actions = {
    setLoading: (key, value) => dispatch({ 
      type: ActionTypes.SET_LOADING, 
      payload: { key, value } 
    }),
    
    setError: (key, error) => dispatch({ 
      type: ActionTypes.SET_ERROR, 
      payload: { key, error } 
    }),
    
    setUser: (user) => {
      cacheManager.set(CacheKeys.LOGGED_IN_USER, user);
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },
    
    setAnnouncements: (announcements) => {
      cacheManager.set(CacheKeys.ALL_ANNOUNCEMENTS, announcements);
      dispatch({ type: ActionTypes.SET_ANNOUNCEMENTS, payload: announcements });
      dispatch({ 
        type: ActionTypes.SET_LAST_FETCH, 
        payload: { key: 'announcements', timestamp: Date.now() } 
      });
    },
    
    setResults: (results) => {
      cacheManager.set(CacheKeys.ALL_RESULTS, results);
      dispatch({ type: ActionTypes.SET_RESULTS, payload: results });
      dispatch({ 
        type: ActionTypes.SET_LAST_FETCH, 
        payload: { key: 'results', timestamp: Date.now() } 
      });
    },
    
    setOpenings: (openings) => {
      cacheManager.set(CacheKeys.ALL_OPENINGS, openings);
      dispatch({ type: ActionTypes.SET_OPENINGS, payload: openings });
      dispatch({ 
        type: ActionTypes.SET_LAST_FETCH, 
        payload: { key: 'openings', timestamp: Date.now() } 
      });
    },
    
    setUsers: (users) => {
      cacheManager.set(CacheKeys.ALL_USERS, users);
      dispatch({ type: ActionTypes.SET_USERS, payload: users });
      dispatch({ 
        type: ActionTypes.SET_LAST_FETCH, 
        payload: { key: 'users', timestamp: Date.now() } 
      });
    },
    
    setSelections: (selections) => {
      cacheManager.set(CacheKeys.ALL_SELECTIONS, selections);
      dispatch({ type: ActionTypes.SET_SELECTIONS, payload: selections });
      dispatch({ 
        type: ActionTypes.SET_LAST_FETCH, 
        payload: { key: 'selections', timestamp: Date.now() } 
      });
    },
    
    addAnnouncement: (announcement) => dispatch({ 
      type: ActionTypes.ADD_ANNOUNCEMENT, 
      payload: announcement 
    }),
    
    updateAnnouncement: (announcement) => dispatch({ 
      type: ActionTypes.UPDATE_ANNOUNCEMENT, 
      payload: announcement 
    }),
    
    deleteAnnouncement: (id) => dispatch({ 
      type: ActionTypes.DELETE_ANNOUNCEMENT, 
      payload: id 
    }),
    
    addOpening: (opening) => dispatch({ 
      type: ActionTypes.ADD_OPENING, 
      payload: opening 
    }),
    
    updateOpening: (opening) => dispatch({ 
      type: ActionTypes.UPDATE_OPENING, 
      payload: opening 
    }),
    
    deleteOpening: (id) => dispatch({ 
      type: ActionTypes.DELETE_OPENING, 
      payload: id 
    }),
    
    clearAllData: () => dispatch({ type: ActionTypes.CLEAR_ALL_DATA })
  };

  const value = {
    ...state,
    actions
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
