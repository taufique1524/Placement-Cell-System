import React, { useState } from 'react';
import { useUserDetails, useAnnouncements, useOpenings } from '../hooks/useDataFetching.js';
import cacheManager from '../services/cacheManager.js';
import { CacheInvalidation } from '../utils/cacheInvalidation.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * Cache Demo Component
 * Demonstrates the caching system functionality
 */
function CacheDemo() {
  const [cacheStats, setCacheStats] = useState(null);
  
  // Use cached data hooks
  const { 
    user, 
    loading: userLoading, 
    error: userError, 
    fetchUserDetails 
  } = useUserDetails();
  
  const { 
    announcements, 
    loading: announcementsLoading, 
    error: announcementsError, 
    fetchAnnouncements 
  } = useAnnouncements();
  
  const { 
    openings, 
    loading: openingsLoading, 
    error: openingsError, 
    fetchOpenings 
  } = useOpenings();

  const updateCacheStats = () => {
    setCacheStats(cacheManager.getStats());
  };

  const clearAllCache = () => {
    CacheInvalidation.everything();
    updateCacheStats();
  };

  const refreshData = async () => {
    await Promise.all([
      fetchUserDetails(true),
      fetchAnnouncements(true),
      fetchOpenings(true)
    ]);
    updateCacheStats();
  };

  React.useEffect(() => {
    updateCacheStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Cache System Demo</h1>
        
        {/* Cache Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Cache Statistics</h2>
          {cacheStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{cacheStats.total}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{cacheStats.valid}</div>
                <div className="text-sm text-gray-600">Valid Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{cacheStats.expired}</div>
                <div className="text-sm text-gray-600">Expired Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(cacheStats.storageSize / 1024)}KB</div>
                <div className="text-sm text-gray-600">Storage Size</div>
              </div>
            </div>
          ) : (
            <LoadingSpinner size="small" text="Loading stats..." />
          )}
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={updateCacheStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh Stats
            </button>
            <button
              onClick={clearAllCache}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Clear All Cache
            </button>
            <button
              onClick={refreshData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Refresh All Data
            </button>
          </div>
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              User Data
              {userLoading && <LoadingSpinner size="small" className="ml-2" showText={false} />}
            </h3>
            
            {userError ? (
              <div className="text-red-600 text-sm">{userError}</div>
            ) : user ? (
              <div className="space-y-2">
                <div><strong>Name:</strong> {user.name || 'N/A'}</div>
                <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                <div><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'Student'}</div>
                <div><strong>Branch:</strong> {user.branch || 'N/A'}</div>
              </div>
            ) : (
              <div className="text-gray-500">No user data</div>
            )}
            
            <button
              onClick={() => fetchUserDetails(true)}
              disabled={userLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            >
              {userLoading ? 'Loading...' : 'Refresh User'}
            </button>
          </div>

          {/* Announcements Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Announcements
              {announcementsLoading && <LoadingSpinner size="small" className="ml-2" showText={false} />}
            </h3>
            
            {announcementsError ? (
              <div className="text-red-600 text-sm">{announcementsError}</div>
            ) : (
              <div className="space-y-2">
                <div><strong>Count:</strong> {announcements?.length || 0}</div>
                <div className="max-h-32 overflow-y-auto">
                  {announcements?.slice(0, 3).map((announcement, index) => (
                    <div key={index} className="text-sm text-gray-600 border-b pb-1 mb-1">
                      {announcement.content?.substring(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => fetchAnnouncements(true)}
              disabled={announcementsLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            >
              {announcementsLoading ? 'Loading...' : 'Refresh Announcements'}
            </button>
          </div>

          {/* Openings Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              Openings
              {openingsLoading && <LoadingSpinner size="small" className="ml-2" showText={false} />}
            </h3>
            
            {openingsError ? (
              <div className="text-red-600 text-sm">{openingsError}</div>
            ) : (
              <div className="space-y-2">
                <div><strong>Count:</strong> {openings?.length || 0}</div>
                <div className="max-h-32 overflow-y-auto">
                  {openings?.slice(0, 3).map((opening, index) => (
                    <div key={index} className="text-sm text-gray-600 border-b pb-1 mb-1">
                      {opening.companyName} - {opening.offerType}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => fetchOpenings(true)}
              disabled={openingsLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            >
              {openingsLoading ? 'Loading...' : 'Refresh Openings'}
            </button>
          </div>
        </div>

        {/* Cache Behavior Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Cache Behavior Demo</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">How it works:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• First load: Data is fetched from server and cached</li>
                <li>• Subsequent loads: Data is served from cache (faster)</li>
                <li>• Cache expires after 5 minutes by default</li>
                <li>• Force refresh bypasses cache and fetches fresh data</li>
                <li>• Cache is automatically invalidated when data is modified</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Performance Benefits:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Reduced server load</li>
                <li>• Faster page navigation</li>
                <li>• Better user experience</li>
                <li>• Offline-like behavior for cached data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CacheDemo;
