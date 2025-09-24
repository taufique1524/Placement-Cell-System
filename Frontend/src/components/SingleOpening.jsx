import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobInterestButtons from "./JobInterestButtons";
import { useData } from '../context/DataContext.jsx';
import { FaInfoCircle } from 'react-icons/fa';

function SingleOpening({ className = "", obj, children }) {
  const { user } = useData();
  const [hasApplied, setHasApplied] = useState(false); // Track if the user has applied

  // Eligibility logic
  let eligibilityMsg = null;
  let eligible = false;
  let ineligibleReasons = [];
  // Defensive: treat both boolean and string 'true' as placed
  const isPlaced = user?.isPlaced === true || user?.isPlaced === 'true';
  if (user && !user.isAdmin && obj && !isPlaced) {
    const userBranch = user.branch?.branchCode || user.branch;
    const userCgpa = user.cgpa;
    const userBatch = user.batch;
    // Check batch
    const batchAllowed = obj.batch === userBatch;
    if (!batchAllowed) ineligibleReasons.push('Your batch does not match the required batch.');
    // Check branch
    const branchAllowed = (obj.branchesAllowed || []).includes(userBranch);
    if (!branchAllowed) ineligibleReasons.push('Your branch is not allowed for this opening.');
    // Check CGPA
    let cgpaAllowed = true;
    if (obj.cgpaCriteria && obj.cgpaCriteria.length > 0) {
      const branchCriteria = obj.cgpaCriteria.find(c => c.branch === userBranch);
      if (branchCriteria) {
        cgpaAllowed = userCgpa >= branchCriteria.cgpa;
        if (!cgpaAllowed) ineligibleReasons.push(`Your CGPA (${userCgpa}) is below the required (${branchCriteria.cgpa}) for your branch.`);
      }
    }
    eligible = batchAllowed && branchAllowed && cgpaAllowed;
    // Only show eligibility message if not applied
    if (eligible && hasApplied) {
      eligibilityMsg = (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-2 flex items-center gap-2">
          <span className="text-green-600 font-bold">You have already applied for this job.</span>
        </div>
      );
    } else if (!eligible) {
      eligibilityMsg = (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2 flex items-center gap-2">
          <FaInfoCircle className="text-red-500" title="Eligibility Info" />
          <div>
            <div className="text-red-700 font-bold mb-1">You are not eligible for this job.</div>
            <ul className="list-disc list-inside text-red-600 text-sm">
              {ineligibleReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }

  // Notification logic: show badge if new or updated in last 24 hours
  let notificationBadge = null;
  const now = Date.now();
  const createdAt = obj?.createdAt ? new Date(obj.createdAt).getTime() : null;
  const updatedAt = obj?.updatedAt ? new Date(obj.updatedAt).getTime() : null;
  const oneDay = 24 * 60 * 60 * 1000;
  if (createdAt && now - createdAt < oneDay) {
    notificationBadge = <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse">New</span>;
  } else if (updatedAt && now - updatedAt < oneDay) {
    notificationBadge = <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full animate-pulse">Updated</span>;
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border border-blue-100 p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-center gap-4 mb-2">
        <img
          src={obj?.announcer?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
          alt="pic"
          className="w-10 h-10 rounded-full border border-blue-200"
        />
        <div>
          <div className="font-semibold text-lg text-blue-900">{obj?.companyName}{notificationBadge}</div>
          <div className="text-xs text-gray-500">{obj?.announcer?.name} ({obj?.announcer?.userType})</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-gray-400">{obj?.formattedUpdateDate}</div>
          <div className="text-xs text-gray-400">{obj?.formattedUpdateTime}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">{obj?.offerType}</span>
        {obj?.fullTime?.ctc && (
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">CTC: {obj?.fullTime?.ctc} LPA</span>
        )}
        {obj?.internship?.stipendPerMonth && (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium border border-yellow-200">Stipend: {obj?.internship?.stipendPerMonth}/mo</span>
        )}
        <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs font-medium border border-gray-200">Location: {obj?.location}</span>
        {obj?.batch && (
          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-200">Batch: {obj.batch}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-200">Deadline: {obj?.formattedApplicationDeadlineDate}, {obj?.formattedApplicationDeadlineTime}</span>
        <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs font-medium border border-pink-200">Branches: {(obj?.branchesAllowed || []).join(", ")}</span>
        {obj?.cgpaCriteria?.length > 0 && (
          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-200">Eligibility: {obj?.cgpaCriteria.map((c) => `${c.branch}: ${c.cgpa}`).join(", ")}</span>
        )}
      </div>
      {obj?.additionalInfo && (
        <div className="text-sm text-gray-700 mb-2"><b>Info:</b> {obj?.additionalInfo}</div>
      )}
      <div className="flex flex-wrap gap-2 items-center mt-2">
        {window.localStorage.getItem("isAdmin") !== "true" && !isPlaced && (
          <>
            {eligible && hasApplied && eligibilityMsg}
            {eligible && !hasApplied && (
              <JobInterestButtons openingId={obj?._id} setHasApplied={setHasApplied} />
            )}
            {!eligible && eligibilityMsg}
          </>
        )}
      </div>
      {children}
    </div>
  );
}

export default SingleOpening;
