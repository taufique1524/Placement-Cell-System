# P_Cell Caching System Documentation

## Overview

The P_Cell application now includes a comprehensive client-side caching system that significantly reduces server calls and improves user experience by storing frequently accessed data locally with intelligent cache management.

## Key Features

### 🚀 Performance Benefits
- **Reduced Server Load**: Minimize API calls by serving cached data
- **Faster Navigation**: Instant data loading from cache
- **Better UX**: Smooth transitions between pages
- **Offline-like Experience**: Access cached data even with poor connectivity

### 🧠 Smart Caching
- **Automatic Expiration**: Data expires after configurable TTL (default: 5 minutes)
- **Cache Invalidation**: Automatic cache clearing when data is modified
- **Storage Persistence**: Cache survives page refreshes using localStorage
- **Memory Management**: Automatic cleanup of expired entries

## Architecture

### Core Components

1. **CacheManager** (`src/services/cacheManager.js`)
   - Singleton service for cache operations
   - localStorage persistence
   - TTL-based expiration
   - Pattern-based invalidation

2. **DataContext** (`src/context/DataContext.jsx`)
   - Global state management with React Context
   - Integrates with cache manager
   - Provides centralized data access

3. **Custom Hooks** (`src/hooks/useDataFetching.js`)
   - `useUserDetails()` - User authentication data
   - `useAnnouncements()` - Announcements with caching
   - `useOpenings()` - Job openings with caching
   - `useResults()` - Results with caching
   - `useUsers()` - User list with caching
   - `useSelections()` - Selections with caching

4. **Cache Invalidation** (`src/utils/cacheInvalidation.js`)
   - Smart invalidation strategies
   - Event-based cache clearing
   - Time-based cleanup

## Usage Examples

### Basic Data Fetching with Caching

```jsx
import { useAnnouncements } from '../hooks/useDataFetching.js';

function AnnouncementsPage() {
  const { 
    announcements, 
    loading, 
    error, 
    fetchAnnouncements 
  } = useAnnouncements();

  useEffect(() => {
    fetchAnnouncements(); // Uses cache if available
  }, []);

  const handleRefresh = () => {
    fetchAnnouncements(true); // Force fresh data
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay error={error} onRetry={handleRefresh} />}
      {announcements.map(announcement => (
        <AnnouncementCard key={announcement._id} data={announcement} />
      ))}
    </div>
  );
}
```

### Manual Cache Operations

```jsx
import cacheManager, { CacheKeys } from '../services/cacheManager.js';

// Get cached data
const cachedUser = cacheManager.get(CacheKeys.LOGGED_IN_USER);

// Set data with custom TTL (10 minutes)
cacheManager.set('custom_key', data, 10 * 60 * 1000);

// Check if data exists and is valid
if (cacheManager.has(CacheKeys.ALL_ANNOUNCEMENTS)) {
  // Use cached data
}

// Clear specific cache
cacheManager.delete(CacheKeys.ALL_ANNOUNCEMENTS);

// Clear all cache
cacheManager.clear();
```

### Cache Invalidation

```jsx
import { CacheInvalidation } from '../utils/cacheInvalidation.js';

// After creating a new announcement
CacheInvalidation.announcements.afterCreate(newAnnouncement);

// After updating user profile
CacheInvalidation.users.afterUpdate(updatedUser);

// Clear everything on logout
CacheInvalidation.onUserAction.logout();
```

## Cache Keys

The system uses standardized cache keys defined in `CacheKeys`:

```javascript
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
```

## Configuration

### Default TTL Values
- **General Data**: 5 minutes
- **User Data**: 5 minutes  
- **Comments**: 1 minute (more dynamic)
- **User Lists**: 5 minutes

### Customizing TTL

```javascript
// Set custom TTL when caching
cacheManager.set(key, data, 10 * 60 * 1000); // 10 minutes
```

## Integration Guide

### Step 1: Wrap App with DataProvider

```jsx
import { DataProvider } from './context/DataContext.jsx';

function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}
```

### Step 2: Replace Direct API Calls

**Before:**
```jsx
useEffect(() => {
  async function loadData() {
    const data = await getAllAnnouncements();
    setAnnouncements(data);
  }
  loadData();
}, []);
```

**After:**
```jsx
const { announcements, fetchAnnouncements } = useAnnouncements();

useEffect(() => {
  fetchAnnouncements();
}, []);
```

### Step 3: Handle Loading and Error States

```jsx
const { 
  announcements, 
  loading, 
  error, 
  fetchAnnouncements 
} = useAnnouncements();

return (
  <DataStateManager
    loading={loading}
    error={error}
    data={announcements}
    onRetry={() => fetchAnnouncements(true)}
  >
    {/* Your content here */}
  </DataStateManager>
);
```

## Best Practices

### 1. Use Appropriate Cache TTL
- **Static data**: Longer TTL (10+ minutes)
- **Dynamic data**: Shorter TTL (1-2 minutes)
- **User-specific data**: Medium TTL (5 minutes)

### 2. Implement Proper Error Handling
```jsx
const { data, loading, error, fetchData } = useCustomHook();

if (error) {
  return <ErrorDisplay error={error} onRetry={() => fetchData(true)} />;
}
```

### 3. Invalidate Cache on Mutations
```jsx
const handleCreate = async (newItem) => {
  await createItem(newItem);
  CacheInvalidation.items.afterCreate(newItem);
  fetchItems(true); // Refresh list
};
```

### 4. Use Loading States
```jsx
return (
  <DataStateManager
    loading={loading}
    error={error}
    data={data}
    loadingComponent={<CustomLoader />}
  >
    {/* Content */}
  </DataStateManager>
);
```

## Monitoring and Debugging

### Cache Statistics
```jsx
const stats = cacheManager.getStats();
console.log('Cache stats:', stats);
// { total: 5, valid: 4, expired: 1, storageSize: 1024 }
```

### Debug Cache Contents
```jsx
// View all cache entries (development only)
console.log('Cache contents:', cacheManager.cache);
```

### Cache Demo Page
Visit `/cache-demo` to see the caching system in action with real-time statistics and controls.

## Troubleshooting

### Common Issues

1. **Stale Data**: Force refresh with `fetchData(true)`
2. **Storage Full**: Cache automatically cleans up expired entries
3. **Inconsistent State**: Clear all cache with `cacheManager.clear()`

### Performance Tips

1. **Preload Essential Data**: Load critical data on app start
2. **Batch Operations**: Group related cache operations
3. **Monitor Storage**: Keep cache size reasonable
4. **Use Patterns**: Leverage pattern-based invalidation

## Migration Notes

### From Direct API Calls
1. Replace `useEffect` with custom hooks
2. Add loading/error state handling
3. Implement cache invalidation for mutations
4. Update component props to use cached data

### Backward Compatibility
The system is designed to be backward compatible. Existing components will continue to work, but won't benefit from caching until migrated.

## Future Enhancements

- [ ] Background refresh for expired data
- [ ] Compression for large cache entries
- [ ] Cache warming strategies
- [ ] Advanced analytics and monitoring
- [ ] Service worker integration for true offline support
