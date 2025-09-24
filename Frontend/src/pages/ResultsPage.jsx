import { useState } from "react";
import MessageCard from "../components/MessageCard.jsx";
import Sidebar from "../components/Sidebar";
import WriteComment from "../components/WriteComment.jsx";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import Modal from "../components/Modal.jsx";
import { useData } from '../context/DataContext.jsx';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function ResultsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { user: loggedInUser = {}, results = [], selections = [], users = [], openings = [] } = useData();

  // Compute stats from context data
  const totalStudents = users.filter(u => !u.isAdmin).length;
  const totalSelected = selections.length;
  const totalRemaining = totalStudents - totalSelected;
  const companyStats = openings.map(company => {
    const count = selections.filter(sel => sel.companyDetails?.companyName === company.companyName).length;
    return { companyName: company.companyName, count };
  })
  .sort((a, b) => b.count - a.count); // Sort descending by count

  // Branch-wise stats
  const branchMap = {};
  users.forEach(u => {
    if (!u.isAdmin && u.branch) {
      const branch = u.branch.branchCode || u.branch;
      if (!branchMap[branch]) branchMap[branch] = { total: 0, selected: 0 };
      branchMap[branch].total += 1;
    }
  });
  selections.forEach(sel => {
    const branch = sel.studentDetails?.branch?.branchCode || sel.studentDetails?.branch;
    if (branch && branchMap[branch]) branchMap[branch].selected += 1;
  });

  // Helper to open modal with students for a company
  const handleShowStudents = (companyName) => {
    const students = selections.filter(
      (sel) => sel.companyDetails?.companyName === companyName
    );
    setSelectedCompany(companyName);
    setSelectedStudents(students);
    setModalOpen(true);
  };

  // Pie chart data for total
  const totalPieData = {
    labels: ['Selected', 'Remaining'],
    datasets: [
      {
        data: [totalSelected, Math.max(totalRemaining, 0)],
        backgroundColor: ['#22c55e', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for all branches
  const branchLabels = Object.keys(branchMap);
  const branchSelected = branchLabels.map(branch => branchMap[branch].selected);
  const branchRemaining = branchLabels.map(branch => Math.max(branchMap[branch].total - branchMap[branch].selected, 0));
  const branchBarData = {
    labels: branchLabels,
    datasets: [
      {
        label: 'Selected',
        data: branchSelected,
        backgroundColor: '#f59e42',
      },
      {
        label: 'Remaining',
        data: branchRemaining,
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <>
      <Sidebar loggedInUserDetails={loggedInUser}>
        <div className="mt-20 flex flex-col items-center text-xl text-blue-900 ">
          <div className="mb-4">Results</div>
          {/* Total Students Pie Chart */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-56 h-56">
              <Pie data={totalPieData} />
            </div>
            <div className="mt-2 text-base text-gray-700">Selected vs Remaining (Total Students)</div>
          </div>
          {/* Statistics Section */}
          <div className="bg-white shadow rounded-lg p-4 mb-6 w-full max-w-3xl">
            <div className="flex flex-col md:flex-row md:space-x-8 justify-between items-center">
              <div className="text-lg font-semibold text-gray-700">Total Students: <span className="text-blue-700">{totalStudents}</span></div>
              <div className="text-lg font-semibold text-gray-700">Total Selected: <span className="text-green-700">{totalSelected}</span></div>
            </div>
            <div className="mt-4">
              <div className="text-md font-semibold text-gray-700 mb-2">Company-wise Selections:</div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg bg-white">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Company Name</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">Total Selected</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">View Students</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyStats.map((c, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{c.companyName}</td>
                        <td className="px-6 py-4 text-center text-blue-800 font-bold">{c.count}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                            onClick={() => handleShowStudents(c.companyName)}
                            disabled={c.count === 0}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Branch-wise Bar Chart */}
          <div className="w-full max-w-3xl mb-8 bg-white shadow rounded-lg p-4 flex flex-col items-center">
            <div className="w-full h-80">
              <Bar data={branchBarData} options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Selected vs Remaining (Branch-wise)' },
                },
                scales: {
                  x: { title: { display: true, text: 'Branch' } },
                  y: { title: { display: true, text: 'Number of Students' }, beginAtZero: true },
                },
              }} />
            </div>
          </div>
        </div>
        {/* Modal for selected students */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Selected Students for ${selectedCompany}`}
        >
          {selectedStudents.length === 0 ? (
            <div className="text-center text-gray-500">No students selected for this company.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg bg-white">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Enrolment No</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Branch</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStudents.map((sel, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-gray-900">{sel.studentDetails?.enrolmentNo}</td>
                      <td className="px-6 py-4 text-gray-900">{sel.studentDetails?.name}</td>
                      <td className="px-6 py-4 text-gray-900">{sel.studentDetails?.branch?.branchCode || sel.studentDetails?.branch || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      </Sidebar>
    </>
  );
}

export default ResultsPage;
