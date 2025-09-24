import React from "react";

export default function UserInfoCard({ userData = {} }) {
  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative mx-auto">
      <img
        className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-lg -mt-20 mb-4 object-cover bg-white"
        src={userData?.image || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
        alt="user"
      />
      <div className="text-2xl font-bold text-blue-900 mb-1">{userData?.name || 'User'}</div>
      <div className="text-sm text-blue-600 mb-4 capitalize">{userData?.userType || 'User'}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 w-full mb-4">
        <div><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-800">{userData?.email || '-'}</span></div>
        {!userData?.isAdmin && <div><span className="font-semibold text-gray-700">Branch:</span> <span className="text-blue-700 font-medium">{userData?.branchDetails?.branchCode || userData?.branch || '-'}</span></div>}
        {!userData?.isAdmin && <div><span className="font-semibold text-gray-700">Batch:</span> <span className="text-gray-800">{userData?.batch || '-'}</span></div>}
        {!userData?.isAdmin && <div><span className="font-semibold text-gray-700">Enrolment No:</span> <span className="text-gray-800">{userData?.enrolmentNo || '-'}</span></div>}
        <div><span className="font-semibold text-gray-700">Gender:</span> <span className="text-gray-800">{userData?.gender || '-'}</span></div>
        <div><span className="font-semibold text-gray-700">DOB:</span> <span className="text-gray-800">{userData?.formattedDOB || '-'}</span></div>
        <div><span className="font-semibold text-gray-700">Mobile:</span> <span className="text-gray-800">{userData?.mobile || '-'}</span></div>
      </div>
      {/* Skills and CGPA */}
      {!userData?.isAdmin && (
        <div className="flex flex-wrap gap-2 mb-4 w-full justify-center">
          {userData?.skills && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Skills: {userData.skills}</span>
          )}
          {userData?.cgpa > 0 && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">CGPA: {userData.cgpa}/10</span>
          )}
        </div>
      )}
      {/* Social Links */}
      {!userData?.isAdmin && (
        <div className="flex gap-4 mb-4">
          {userData?.linkedIn && (
            <a href={userData.linkedIn.startsWith('http') ? userData.linkedIn : `https://${userData.linkedIn}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium underline">
              LinkedIn
            </a>
          )}
          {userData?.github && (
            <a href={userData.github.startsWith('http') ? userData.github : `https://${userData.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-800 hover:text-black font-medium underline">
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
}
