import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addSelections } from "../services/addSelections.services.js";
import axios from "axios";
import { useData } from '../context/DataContext.jsx';
import { getAllSelections } from "../services/getAllSelections.services.js";
import { baseUrl } from '../constants.js';

function AddSelectionsPage() {
  const { _id } = useParams();
  const [applied, setApplied] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { actions } = useData();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/user/applied-and-shortlisted?openingId=${_id}`, {
          headers: { token: localStorage.getItem('token') }
        });
        setApplied(res.data.applied);
        setShortlisted(res.data.shortlisted.map(s => s.enrolmentNo));
      } catch (err) {
        setApplied([]);
        setShortlisted([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [_id, successMessage]);

  const handleAdd = async (enrolmentNo) => {
    setLoading(true);
    await addSelections(_id, [{ enrolmentNo }]);
    setSuccessMessage("Student added to selected list.");
    // Fetch and update selections context
    const updated = await getAllSelections();
    if (updated && updated.newSelection) {
      actions.setSelections(updated.newSelection);
    }
    setTimeout(() => setSuccessMessage(""), 2000);
    setLoading(false);
  };

  return (
    <Sidebar>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center tracking-tight">Shortlist Students for Job</h2>
          <div className="w-full mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-800">Applied Students</h3>
              {successMessage && (
                <span className="text-green-700 font-semibold text-base bg-green-50 px-4 py-2 rounded shadow-sm border border-green-200">{successMessage}</span>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg border border-blue-100 bg-white">
              {loading ? (
                <div className="py-8 text-center text-blue-700 font-semibold text-lg">Loading...</div>
              ) : applied.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-lg">No students have applied for this job yet.</div>
              ) : (
                <table className="min-w-full divide-y divide-blue-100">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Enrolment No</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {applied.map((student, idx) => {
                      const isShortlisted = shortlisted.includes(student.enrolmentNo);
                      // Use a unique key: enrolmentNo + idx
                      return (
                        <tr key={student.enrolmentNo + '-' + idx} className={isShortlisted ? "bg-green-50" : idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.enrolmentNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-semibold">{student.branch}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.batch}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {isShortlisted ? (
                              <span className="inline-block bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Shortlisted</span>
                            ) : (
                              <button
                                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all"
                                onClick={() => handleAdd(student.enrolmentNo)}
                                disabled={loading}
                              >
                                Add to Selected List
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default AddSelectionsPage;
