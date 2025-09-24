import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import ResumeTemplateClassic from '../components/ResumeTemplateClassic';
// import ResumeTemplateModern from '../components/ResumeTemplateModern';
// import ResumeTemplateMinimal from '../components/ResumeTemplateMinimal';
// import ResumeTemplateColor from '../components/ResumeTemplateColor';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../constants.js';

const templateMap = {
  classic: ResumeTemplateClassic,
  // modern: ResumeTemplateModern,
  // minimal: ResumeTemplateMinimal,
  // color: ResumeTemplateColor,
};

export default function ResumePreviewPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const { userId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    let url = `${baseUrl}/api/user/loggedInUserDetails`;
    if (userId) {
      url = `${baseUrl}/api/user/otherUserProfile/${userId}`;
    }
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setProfile(res.data.user || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Resume',
  });

  if (loading) return <div className="flex justify-center items-center h-96 text-lg font-semibold">Loading...</div>;
  if (!profile) return <div className="text-center text-red-600">Failed to load profile.</div>;

  const TemplateComponent = templateMap[profile.resumeTemplateId] || ResumeTemplateClassic;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 mb-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center tracking-tight">Resume Preview</h2>
      {/* Always render the printable content with the ref attached, even if profile is not loaded */}
      <div ref={componentRef} className="bg-gray-50 p-8 rounded-xl border border-gray-100 mb-8 min-h-[400px]">
        {loading && <div className="text-center text-gray-400">Loading resume...</div>}
        {!loading && !profile && <div className="text-center text-red-600">Failed to load profile.</div>}
        {profile && <TemplateComponent profile={profile} />}
      </div>
      <div className="flex justify-center">
        <button
          onClick={handlePrint}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow"
          disabled={loading || !profile}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
} 