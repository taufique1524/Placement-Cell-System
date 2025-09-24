import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

export default function ResumeTemplateClassic({ profile }) {
  if (!profile) return null;
  const {
    name,
    email,
    branch,
    batch,
    enrolmentNo,
    gender,
    academicDetails = {},
    skills = [],
    projects = [],
    internships = [],
    achievements = [],
    careerObjective = '',
  } = profile;

  return (
    <div
      className="bg-white text-gray-900 rounded-xl shadow-md w-full max-w-4xl mx-auto border border-gray-200 overflow-hidden print:bg-white print:text-gray-900 print:shadow-none print:rounded-none print:border print:border-gray-200 print:p-0 print:m-0"
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
    >
      <div className="flex flex-col md:flex-row print:flex print:flex-row">
        {/* Left Sidebar */}
        <div className="md:w-1/3 bg-blue-50 p-6 flex flex-col gap-8 border-r border-blue-100 print:bg-blue-50 print:border-blue-100 print:p-6 print:gap-8 print:border-r print:w-1/3">
          {/* Social Links */}
          {(profile.linkedIn || profile.github || profile.instagram) && (
            <div className="flex flex-row items-center gap-4 mb-4 print:gap-4">
              {profile.linkedIn && (
                <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <FaLinkedin className="text-blue-700 text-2xl hover:scale-110 transition-transform print:text-blue-700" />
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                  <FaGithub className="text-gray-800 text-2xl hover:scale-110 transition-transform print:text-gray-800" />
                </a>
              )}
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                  <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition-transform print:text-pink-500" />
                </a>
              )}
            </div>
          )}
          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-bold text-blue-800 mb-2 tracking-wide print:text-blue-800 print:font-bold">Contact</h2>
            <div className="text-gray-900 text-sm mb-1 print:text-gray-900"><span className="font-semibold print:font-semibold">Email:</span> {email}</div>
            <div className="text-gray-900 text-sm mb-1 print:text-gray-900"><span className="font-semibold print:font-semibold">Batch:</span> {batch}</div>
            <div className="text-gray-900 text-sm mb-1 print:text-gray-900"><span className="font-semibold print:font-semibold">Branch:</span> {branch}</div>
            <div className="text-gray-900 text-sm mb-1 print:text-gray-900"><span className="font-semibold print:font-semibold">Enrollment No:</span> {enrolmentNo}</div>
            <div className="text-gray-900 text-sm print:text-gray-900"><span className="font-semibold print:font-semibold">Gender:</span> {gender}</div>
          </div>
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-2 tracking-wide print:text-blue-800 print:font-bold">Skills</h2>
              <ul className="flex flex-wrap gap-2 print:gap-2">
                {skills.map((skill, idx) => (
                  <li key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium print:bg-blue-100 print:text-blue-800 print:rounded-full print:text-xs print:font-medium">{skill}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 mb-2 tracking-wide print:text-blue-800 print:font-bold">Achievements</h2>
              <ul className="list-disc list-inside text-gray-900 text-sm space-y-1 print:text-gray-900 print:text-sm print:space-y-1">
                {achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="md:w-2/3 p-8 flex flex-col gap-8 print:p-8 print:gap-8 print:w-2/3">
          {/* Name & Summary */}
          <div className="border-b border-gray-200 pb-4 mb-2 print:border-b print:border-gray-200">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-tight uppercase print:text-blue-900 print:font-extrabold">{name}</h1>
            {careerObjective && (
              <p className="text-gray-900 text-base mt-2 italic print:text-gray-900 print:text-base">{careerObjective}</p>
            )}
          </div>
          {/* Education */}
          <div>
            <h2 className="text-xl font-bold text-blue-800 mb-3 tracking-wide border-b border-blue-100 pb-1 print:text-blue-800 print:font-bold print:border-b print:border-blue-100">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 print:text-gray-900 print:font-semibold">10th</h3>
                <div className="text-sm print:text-sm">Board: {academicDetails.tenth?.board}</div>
                <div className="text-sm print:text-sm">Year: {academicDetails.tenth?.year}</div>
                <div className="text-sm print:text-sm">Percentage: {academicDetails.tenth?.percentage}</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 print:text-gray-900 print:font-semibold">12th</h3>
                <div className="text-sm print:text-sm">Board: {academicDetails.twelfth?.board}</div>
                <div className="text-sm print:text-sm">Year: {academicDetails.twelfth?.year}</div>
                <div className="text-sm print:text-sm">Percentage: {academicDetails.twelfth?.percentage}</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 print:text-gray-900 print:font-semibold">UG</h3>
                <div className="text-sm print:text-sm">College: {academicDetails.ug?.college}</div>
                <div className="text-sm print:text-sm">Degree: {academicDetails.ug?.degree}</div>
                <div className="text-sm print:text-sm">CGPA: {academicDetails.ug?.cgpa}</div>
              </div>
            </div>
          </div>
          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-3 tracking-wide border-b border-blue-100 pb-1 print:text-blue-800 print:font-bold print:border-b print:border-blue-100">Projects</h2>
              <ul className="space-y-3 print:space-y-3">
                {projects.map((proj, idx) => (
                  <li key={idx} className="">
                    <div className="font-semibold text-blue-900 text-lg print:text-blue-900 print:font-semibold">{proj.title}</div>
                    <div className="text-gray-900 text-sm mb-1 print:text-gray-900 print:text-sm">{proj.description}</div>
                    {proj.link && <a href={proj.link} className="text-blue-600 underline text-sm print:text-blue-600 print:underline print:text-sm" target="_blank" rel="noopener noreferrer">{proj.link}</a>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Internships */}
          {internships.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-3 tracking-wide border-b border-blue-100 pb-1 print:text-blue-800 print:font-bold print:border-b print:border-blue-100">Internships</h2>
              <ul className="space-y-3 print:space-y-3">
                {internships.map((intern, idx) => (
                  <li key={idx} className="">
                    <div className="font-semibold text-blue-900 text-lg print:text-blue-900 print:font-semibold">{intern.company} - {intern.role}</div>
                    <div className="text-gray-900 text-sm mb-1 print:text-gray-900 print:text-sm">{intern.duration}</div>
                    <div className="text-gray-900 text-sm print:text-gray-900 print:text-sm">{intern.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 