import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { baseUrl } from '../constants.js';

const EditOpeningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  useEffect(() => {
    async function fetchOpening() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/api/opening/getSingleOpening/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpening(res.data.opening);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setErrorMessage({ general: "Failed to load opening." });
      }
    }
    async function loadLoggedInUserDetails() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${baseUrl}/api/user/loggedInUserDetails`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUserDetails(res.data.user);
        if (!res.data.user.isAdmin) {
          navigate("/errorPage/not authorised");
        }
      } catch (error) {
        navigate(`/`);
      }
    }
    loadLoggedInUserDetails();
    fetchOpening();
  }, [id, navigate]);

  const handleChange = (e) => {
    setOpening((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage((prev) => ({ ...prev, [`${e.target.name}Error`]: "" }));
  };

  const handleBranchesAllowedChange = (e) => {
    setOpening((prev) => ({ ...prev, branchesAllowed: e.target.value.split(",").map((b) => b.trim()) }));
    setErrorMessage((prev) => ({ ...prev, branchesAllowedError: "" }));
  };

  const handleCgpaCriteriaChange = (index, field, value) => {
    const updated = [...(opening.cgpaCriteria || [])];
    updated[index][field] = value;
    setOpening((prev) => ({ ...prev, cgpaCriteria: updated }));
    setErrorMessage((prev) => ({ ...prev, cgpaCriteriaError: "" }));
  };

  const addCgpaCriteriaField = () => {
    setOpening((prev) => ({ ...prev, cgpaCriteria: [...(prev.cgpaCriteria || []), { branch: "", cgpa: "" }] }));
  };

  const removeCgpaCriteriaField = (index) => {
    const updated = [...(opening.cgpaCriteria || [])];
    updated.splice(index, 1);
    setOpening((prev) => ({ ...prev, cgpaCriteria: updated }));
    setErrorMessage((prev) => ({ ...prev, cgpaCriteriaError: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(`${baseUrl}/api/opening/updateOpening/${id}`, opening, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      if (res.data.success === 0) {
        setErrorMessage(res.data.error || { general: "Update failed." });
        return;
      }
      setSuccessMessage("Opening updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/openings");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setErrorMessage({ general: "An error occurred. Please try again." });
    }
  };

  if (loading || !opening) return <div className="flex justify-center items-center h-96 text-lg font-semibold">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <div className="w-80"> {/* Increased sidebar width to 20rem */}
        <Sidebar loggedInUserDetails={loggedInUserDetails} />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-xl bg-white p-8 rounded-xl shadow-xl border border-gray-200 mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Opening</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Company Name</label>
              <input type="text" name="companyName" value={opening.companyName} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
              {errorMessage.companyNameError && <div className="text-red-500 text-sm">{errorMessage.companyNameError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Offer Type</label>
              <select name="offerType" value={opening.offerType} onChange={handleChange} className="border rounded px-3 py-2 w-full" required>
                <option value="">Select</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship + Full-time">Internship + Full-time</option>
              </select>
              {errorMessage.offerTypeError && <div className="text-red-500 text-sm">{errorMessage.offerTypeError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input type="text" name="location" value={opening.location} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
              {errorMessage.locationError && <div className="text-red-500 text-sm">{errorMessage.locationError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Branches Allowed</label>
              <input type="text" value={opening.branchesAllowed?.join(", ") || ""} onChange={handleBranchesAllowedChange} className="border rounded px-3 py-2 w-full" required />
              {errorMessage.branchesAllowedError && <div className="text-red-500 text-sm">{errorMessage.branchesAllowedError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Batch</label>
              <input type="text" name="batch" value={opening.batch} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
              {errorMessage.batchError && <div className="text-red-500 text-sm">{errorMessage.batchError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">CGPA Criteria</label>
              {(opening.cgpaCriteria || []).map((c, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={c.branch} onChange={e => handleCgpaCriteriaChange(idx, "branch", e.target.value)} placeholder="Branch" className="border rounded px-2 py-1 w-1/2" />
                  <input type="number" value={c.cgpa} onChange={e => handleCgpaCriteriaChange(idx, "cgpa", e.target.value)} placeholder="CGPA" className="border rounded px-2 py-1 w-1/2" min="0" max="10" step="0.01" />
                  <button type="button" onClick={() => removeCgpaCriteriaField(idx)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addCgpaCriteriaField} className="text-blue-600 mt-1">+ Add CGPA Criteria</button>
              {errorMessage.cgpaCriteriaError && <div className="text-red-500 text-sm">{errorMessage.cgpaCriteriaError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Internship Duration (months)</label>
              <input type="number" name="internshipDuration" value={opening.internship?.duration || ""} onChange={e => setOpening(prev => ({ ...prev, internship: { ...prev.internship, duration: e.target.value } }))} className="border rounded px-3 py-2 w-full" min="0" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Stipend Per Month</label>
              <input type="number" name="stipendPerMonth" value={opening.internship?.stipendPerMonth || ""} onChange={e => setOpening(prev => ({ ...prev, internship: { ...prev.internship, stipendPerMonth: e.target.value } }))} className="border rounded px-3 py-2 w-full" min="0" />
            </div>
            <div>
              <label className="block font-semibold mb-1">CTC (LPA)</label>
              <input type="number" name="ctc" value={opening.fullTime?.ctc || ""} onChange={e => setOpening(prev => ({ ...prev, fullTime: { ...prev.fullTime, ctc: e.target.value } }))} className="border rounded px-3 py-2 w-full" min="0" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Test Date and Time</label>
              <input type="datetime-local" name="testDateAndTime" value={opening.testDateAndTime ? new Date(opening.testDateAndTime).toISOString().slice(0, 16) : ""} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Application Deadline</label>
              <input type="datetime-local" name="applicationDeadline" value={opening.applicationDeadline ? new Date(opening.applicationDeadline).toISOString().slice(0, 16) : ""} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
              {errorMessage.applicationDeadlineError && <div className="text-red-500 text-sm">{errorMessage.applicationDeadlineError}</div>}
            </div>
            <div>
              <label className="block font-semibold mb-1">Additional Info</label>
              <textarea name="additionalInfo" value={opening.additionalInfo} onChange={handleChange} className="border rounded px-3 py-2 w-full" />
            </div>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow w-full">Update Opening</button>
            {successMessage && <div className="text-green-600 font-semibold mt-2 text-center">{successMessage}</div>}
            {errorMessage.general && <div className="text-red-600 font-semibold mt-2 text-center">{errorMessage.general}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOpeningPage; 