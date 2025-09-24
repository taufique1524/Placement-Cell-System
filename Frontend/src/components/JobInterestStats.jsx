import React, { useState, useEffect } from "react";
import { getOpeningStatistics } from "../services/jobInterest.services";
import { useData } from '../context/DataContext.jsx';

function JobInterestStats({ openingId, className = "" }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const { users = [] } = useData(); // Get all users from context

  useEffect(() => {
    async function fetchStatistics() {
      try {
        setLoading(true);
        const response = await getOpeningStatistics(openingId);
        if (response.success === 1) {
          setStats(response.statistics);
        } else {
          setError("Failed to load statistics");
        }
      } catch (error) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }

    if (openingId) {
      fetchStatistics();
    }
  }, [openingId]);

  if (loading) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Compute not interested users excluding those in interestedUsers
  let notInterestedUsers = [];
  if (stats.interestedUsers) {
    const interestedIds = new Set(stats.interestedUsers.map(u => u.user._id));
    if (stats.notInterestedUsers && stats.notInterestedUsers.length > 0) {
      notInterestedUsers = stats.notInterestedUsers.filter(u => !interestedIds.has(u.user._id));
    } else {
      notInterestedUsers = users
        .filter(u => !u.isAdmin && !interestedIds.has(u._id))
        .map(u => ({ user: u, _id: u._id }));
    }
  }
  // Use the computed notInterestedUsers length for the top count
  const notInterestedCount = notInterestedUsers.length;

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-700">{stats.totalInterested}</div>
          <div className="text-sm text-green-600">Applied</div>
        </div>
        <div className="bg-red-100 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-700">{notInterestedCount}</div>
          <div className="text-sm text-red-600">Not Interested</div>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.eligibleAndInterested}</div>
          <div className="text-sm text-blue-600">Eligible & Interested</div>
        </div>
      </div>

      {stats.interestedUsers && stats.interestedUsers.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            {showUsers ? "Hide" : "Show"} Applied Students ({stats.interestedUsers.length})
            <svg
              className={`ml-1 w-4 h-4 transition-transform ${
                showUsers ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {showUsers && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eligibility
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.interestedUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.user.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.user.batch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.isEligible ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Not Eligible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Not Interested Students List */}
      {notInterestedUsers && notInterestedUsers.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="text-red-600 hover:text-red-800 font-medium flex items-center"
          >
            {showUsers ? "Hide" : "Show"} Not Interested Students ({notInterestedUsers.length})
            <svg
              className={`ml-1 w-4 h-4 transition-transform ${
                showUsers ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {showUsers && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notInterestedUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.user.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.user.batch}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobInterestStats;