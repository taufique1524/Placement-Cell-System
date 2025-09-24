import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../constants.js';

const initialProfile = {
  academicDetails: {
    tenth: { board: '', year: '', percentage: '' },
    twelfth: { board: '', year: '', percentage: '' },
    ug: { college: '', degree: '', cgpa: '' },
  },
  skills: [],
  projects: [{ title: '', description: '', link: '' }],
  internships: [{ company: '', role: '', duration: '', description: '' }],
  achievements: [''],
  careerObjective: '',
  resumeTemplateId: 'classic',
};

export default function ResumeProfileForm() {
  const [profile, setProfile] = useState(initialProfile);
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', branch: '', mobile: '', batch: '', gender: '', dob: '', enrolmentNo: '' });
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: '',
    github: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Fetch current user profile
    const token = localStorage.getItem('token');
    axios.get(`${baseUrl}/api/user/loggedInUserDetails`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        const user = res.data.user || res.data.user;
        if (user.isAdmin) {
          setIsRedirecting(true);
          navigate('/alluser', { replace: true });
          return;
        }
        setPersonalInfo({
          name: user.name || '',
          email: user.email || '',
          branch: user.branch || '',
          mobile: user.mobile || '',
          batch: user.batch || '',
          gender: user.gender || '',
          dob: user.formattedDOB || '',
          enrolmentNo: user.enrolmentNo || '',
        });
        setProfile({
          academicDetails: user.academicDetails || initialProfile.academicDetails,
          skills: user.skills && Array.isArray(user.skills) ? user.skills : [],
          projects: user.projects && user.projects.length ? user.projects : [{ title: '', description: '', link: '' }],
          internships: user.internships && user.internships.length ? user.internships : [{ company: '', role: '', duration: '', description: '' }],
          achievements: user.achievements && Array.isArray(user.achievements) ? user.achievements : [''],
          careerObjective: user.careerObjective || '',
          resumeTemplateId: user.resumeTemplateId || 'classic',
        });
        setSocialLinks({
          linkedIn: user.linkedIn || '',
          github: user.github || '',
          instagram: user.instagram || ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleAcademicChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      academicDetails: {
        ...prev.academicDetails,
        [section]: {
          ...prev.academicDetails[section],
          [field]: value,
        },
      },
    }));
  };

  const handleSkillChange = (idx, value) => {
    const newSkills = [...profile.skills];
    newSkills[idx] = value;
    setProfile(prev => ({ ...prev, skills: newSkills }));
  };
  const addSkill = () => setProfile(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  const removeSkill = idx => setProfile(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

  const handleProjectChange = (idx, field, value) => {
    const newProjects = [...profile.projects];
    newProjects[idx][field] = value;
    setProfile(prev => ({ ...prev, projects: newProjects }));
  };
  const addProject = () => setProfile(prev => ({ ...prev, projects: [...prev.projects, { title: '', description: '', link: '' }] }));
  const removeProject = idx => setProfile(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }));

  const handleInternshipChange = (idx, field, value) => {
    const newInternships = [...profile.internships];
    newInternships[idx][field] = value;
    setProfile(prev => ({ ...prev, internships: newInternships }));
  };
  const addInternship = () => setProfile(prev => ({ ...prev, internships: [...prev.internships, { company: '', role: '', duration: '', description: '' }] }));
  const removeInternship = idx => setProfile(prev => ({ ...prev, internships: prev.internships.filter((_, i) => i !== idx) }));

  const handleAchievementChange = (idx, value) => {
    const newAchievements = [...profile.achievements];
    newAchievements[idx] = value;
    setProfile(prev => ({ ...prev, achievements: newAchievements }));
  };
  const addAchievement = () => setProfile(prev => ({ ...prev, achievements: [...prev.achievements, ''] }));
  const removeAchievement = idx => setProfile(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));

  const handleChange = e => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = e => {
    setSocialLinks(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${baseUrl}/api/user/profile/resume`, { ...profile, ...socialLinks }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage('Error saving profile.');
    }
    setSaving(false);
  };

  if (isRedirecting) return null;
  if (loading) return <div className="flex justify-center items-center h-96 text-lg font-semibold">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 mb-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-blue-800 text-center tracking-tight">Resume Profile Builder</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info (read-only, styled) */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-4">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(personalInfo).filter(([key]) => ["name", "email", "batch", "branch", "enrolmentNo", "gender"].includes(key)).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                <div className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 font-medium cursor-not-allowed select-none">
                  {value}
                </div>
              </div>
            ))}
          </div>
          {/* Social Links Inputs */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">LinkedIn</label>
              <input type="text" name="linkedIn" value={socialLinks.linkedIn} onChange={handleSocialChange} placeholder="LinkedIn Profile URL" className="w-full border rounded px-3 py-2 bg-white focus:outline-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">GitHub</label>
              <input type="text" name="github" value={socialLinks.github} onChange={handleSocialChange} placeholder="GitHub Profile URL" className="w-full border rounded px-3 py-2 bg-white focus:outline-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold uppercase mb-1">Instagram</label>
              <input type="text" name="instagram" value={socialLinks.instagram} onChange={handleSocialChange} placeholder="Instagram Profile URL" className="w-full border rounded px-3 py-2 bg-white focus:outline-blue-400" />
            </div>
          </div>
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Academic Details */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Academic Details</h3>
          {['tenth', 'twelfth', 'ug'].map(section => (
            <div key={section} className="mb-4">
              <label className="block font-medium capitalize mb-2 text-gray-700">{section}</label>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(profile.academicDetails[section]).map(field => (
                  <input
                    key={field}
                    className="border rounded px-3 py-2 bg-white focus:outline-blue-400"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={profile.academicDetails[section][field]}
                    onChange={e => handleAcademicChange(section, field, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Skills */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Skills</h3>
          {profile.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                className="border rounded px-3 py-2 flex-1 bg-white focus:outline-blue-400"
                placeholder="Skill"
                value={skill}
                onChange={e => handleSkillChange(idx, e.target.value)}
              />
              <button type="button" className="ml-2 text-red-500 text-xl" onClick={() => removeSkill(idx)} title="Remove">&minus;</button>
            </div>
          ))}
          <button type="button" className="text-blue-600 mt-2 font-semibold" onClick={addSkill}>+ Add Skill</button>
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Projects */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Projects</h3>
          {profile.projects.map((proj, idx) => (
            <div key={idx} className="mb-4 border-b pb-4 last:border-b-0">
              <input className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Title" value={proj.title} onChange={e => handleProjectChange(idx, 'title', e.target.value)} />
              <textarea className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Description" value={proj.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)} />
              <input className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Link" value={proj.link} onChange={e => handleProjectChange(idx, 'link', e.target.value)} />
              <button type="button" className="text-red-500" onClick={() => removeProject(idx)}>&minus; Remove</button>
            </div>
          ))}
          <button type="button" className="text-blue-600 mt-2 font-semibold" onClick={addProject}>+ Add Project</button>
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Internships */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Internships</h3>
          {profile.internships.map((intern, idx) => (
            <div key={idx} className="mb-4 border-b pb-4 last:border-b-0">
              <input className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Company" value={intern.company} onChange={e => handleInternshipChange(idx, 'company', e.target.value)} />
              <input className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Role" value={intern.role} onChange={e => handleInternshipChange(idx, 'role', e.target.value)} />
              <input className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Duration" value={intern.duration} onChange={e => handleInternshipChange(idx, 'duration', e.target.value)} />
              <textarea className="border rounded px-3 py-2 mb-2 w-full bg-white focus:outline-blue-400" placeholder="Description" value={intern.description} onChange={e => handleInternshipChange(idx, 'description', e.target.value)} />
              <button type="button" className="text-red-500" onClick={() => removeInternship(idx)}>&minus; Remove</button>
            </div>
          ))}
          <button type="button" className="text-blue-600 mt-2 font-semibold" onClick={addInternship}>+ Add Internship</button>
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Achievements */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Achievements / Awards</h3>
          {profile.achievements.map((ach, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                className="border rounded px-3 py-2 flex-1 bg-white focus:outline-blue-400"
                placeholder="Achievement"
                value={ach}
                onChange={e => handleAchievementChange(idx, e.target.value)}
              />
              <button type="button" className="ml-2 text-red-500 text-xl" onClick={() => removeAchievement(idx)} title="Remove">&minus;</button>
            </div>
          ))}
          <button type="button" className="text-blue-600 mt-2 font-semibold" onClick={addAchievement}>+ Add Achievement</button>
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Career Objective */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Career Objective / Summary</h3>
          <textarea
            className="border rounded px-3 py-2 w-full bg-white focus:outline-blue-400"
            name="careerObjective"
            value={profile.careerObjective}
            onChange={handleChange}
            placeholder="Your career objective or summary"
          />
        </div>
        <hr className="my-6 border-blue-200" />
        {/* Save Button and Preview Button */}
        <div className="flex items-center justify-center mt-8 gap-6">
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
          <button type="button" className="bg-gray-200 hover:bg-gray-300 text-blue-800 px-8 py-3 rounded-lg text-lg font-semibold shadow border border-blue-200" onClick={() => navigate('/resume-preview')}>Preview Resume</button>
          {message && <span className="ml-6 text-green-600 font-semibold text-lg">{message}</span>}
        </div>
      </form>
    </div>
  );
} 