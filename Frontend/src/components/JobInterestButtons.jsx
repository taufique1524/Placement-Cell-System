import React, { useState, useEffect } from "react";
import { expressInterest, getInterestStatus } from "../services/jobInterest.services";

function JobInterestButtons({ openingId, className = "", setHasApplied }) {
  const [loading, setLoading] = useState(true);
  const [interest, setInterest] = useState(null);
  const [isEligible, setIsEligible] = useState(true);
  const [eligibilityReason, setEligibilityReason] = useState("");
  const [error, setError] = useState("");
  const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    async function fetchInterestStatus() {
      try {
        setLoading(true);
        const response = await getInterestStatus(openingId);
        if (response.success === 1) {
          setInterest(response.data.isInterested);
          setIsEligible(response.data.isEligible);
          setEligibilityReason(response.data.eligibilityReason || "");
          setIsPlaced(response.data.isPlaced || false);
          if (setHasApplied && response.data.isInterested === true) {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching interest status:", error);
        setError("Failed to load your interest status");
      } finally {
        setLoading(false);
      }
    }

    if (openingId) {
      fetchInterestStatus();
    }
  }, [openingId]);

  const handleInterestClick = async (isInterested) => {
    try {
      setLoading(true);
      const response = await expressInterest(openingId, isInterested);
      if (response.success === 1) {
        setInterest(isInterested);
        setIsEligible(response.isEligible);
        setEligibilityReason(response.eligibilityReason || "");
        setIsPlaced(response.isPlaced || false);
        if (setHasApplied && isInterested === true) {
          setHasApplied(true);
        }
      } else {
        setError(response.message || "Failed to update interest status");
      }
    } catch (error) {
      console.error("Error expressing interest:", error);
      setError("Failed to update interest status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse delay-100"></div>
        <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse delay-200"></div>
      </div>
    );
  }

  // Special UI for placed students
  if (isPlaced) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="text-green-600 text-sm mb-2 text-center">
          <div className="font-bold">🎉 Congratulations! You are already placed!</div>
          <div className="mt-1">{eligibilityReason}</div>
        </div>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
          You cannot apply for new job openings as you are already placed.
        </div>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="text-red-600 text-sm mb-2 text-center">
          <div className="font-bold">You don't meet the eligibility criteria for this job</div>
          <div className="mt-1">{eligibilityReason}</div>
        </div>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleInterestClick(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              interest === true
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
            disabled={loading}
          >
            Interested Anyway
          </button>
          <button
            onClick={() => handleInterestClick(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              interest === false
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
            disabled={loading}
          >
            Not Interested
          </button>
        </div>
      </div>
    );
  }

  if (interest === true) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="text-green-700 font-semibold">You applied for this job.</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {error && <div className="text-red-600 text-sm mr-2">{error}</div>}
      <button
        onClick={() => handleInterestClick(true)}
        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 shadow"
        disabled={loading}
      >
        Apply
      </button>
    </div>
  );
}

export default JobInterestButtons;