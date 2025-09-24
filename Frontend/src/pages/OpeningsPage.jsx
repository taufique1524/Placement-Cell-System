import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import SingleOpening from "../components/SingleOpening.jsx";
import JobInterestStats from "../components/JobInterestStats";
import { useData } from '../context/DataContext.jsx';
import { deleteOpening } from "../services/deleteOpening.services.js";

const OFFER_TYPES = ["Internship", "Full-time", "Internship + Full-time"];

function OpeningsPage() {
  const navigate = useNavigate();
  const { openings = [], user: loggedInUserDetails = {} } = useData();
  const [filteredOpenings, setFilteredOpenings] = useState([]);
  // Filter states
  const [filterCompany, setFilterCompany] = useState("");
  const [filterOfferType, setFilterOfferType] = useState("");
  const [filterCtcMin, setFilterCtcMin] = useState("");
  const [filterCtcMax, setFilterCtcMax] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterCgpa, setFilterCgpa] = useState("");
  const [showStats, setShowStats] = useState({});

  const handleClickComment = (_id) => {
    navigate(`/singleOpening/${_id}`);
  };
  const handleClickDelete = async (e, _id) => {
    e.preventDefault();
    try {
      await deleteOpening(_id);
      // Optionally, trigger a refresh or update context here
    } catch (error) {
      console.log(error);
    }
  };
  const handleClick2 = () => {
    navigate("/addOpening");
  };
  const handleClickAddSelections = (_id) => {
    navigate(`/addSelections/${_id}`);
  };

  useEffect(() => {
    setFilteredOpenings(openings);
  }, [openings]);

  useEffect(() => {
    let filtered = openings.filter((opening) => {
      if (filterCompany && !opening.companyName.toLowerCase().includes(filterCompany.toLowerCase())) return false;
      if (filterOfferType && opening.offerType !== filterOfferType) return false;
      if (filterCtcMin || filterCtcMax) {
        let ctc = opening.fullTime?.ctc || 0;
        if (filterCtcMin && ctc < parseFloat(filterCtcMin)) return false;
        if (filterCtcMax && ctc > parseFloat(filterCtcMax)) return false;
      }
      if (filterDeadline) {
        const deadline = new Date(opening.applicationDeadline);
        const selected = new Date(filterDeadline);
        if (deadline > selected) return false;
      }
      if (filterBranch && !(opening.branchesAllowed || []).includes(filterBranch)) return false;
      if (filterCgpa) {
        const cgpaOk = (opening.cgpaCriteria || []).some(
          (c) => c.cgpa >= parseFloat(filterCgpa)
        );
        if (!cgpaOk) return false;
      }
      return true;
    });
    setFilteredOpenings(filtered);
  }, [filterCompany, filterOfferType, filterCtcMin, filterCtcMax, filterDeadline, filterBranch, filterCgpa, openings]);

  const allBranches = Array.from(
    new Set(
      openings.flatMap((o) => o.branchesAllowed || [])
    )
  );

  const isAdmin = loggedInUserDetails?.isAdmin === true || window.localStorage.getItem('isAdmin') === 'true';

  return (
    <>
      <Sidebar loggedInUserDetails={loggedInUserDetails} className="mb-0 pb-0">
        <>
          <div className="mt-20 flex justify-center text-2xl font-bold text-blue-900 ">All Openings</div>
          <div className="z-10 bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 items-center justify-between mt-6 mb-4">
            <input
              type="text"
              placeholder="Company Name"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="input input-bordered w-40 px-2 py-1 rounded border border-blue-200"
            />
            <select
              value={filterOfferType}
              onChange={(e) => setFilterOfferType(e.target.value)}
              className="input input-bordered w-40 px-2 py-1 rounded border border-blue-200"
            >
              <option value="">All Types</option>
              {OFFER_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="CTC Min"
                value={filterCtcMin}
                onChange={(e) => setFilterCtcMin(e.target.value)}
                className="input input-bordered w-20 px-2 py-1 rounded border border-blue-200"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="CTC Max"
                value={filterCtcMax}
                onChange={(e) => setFilterCtcMax(e.target.value)}
                className="input input-bordered w-20 px-2 py-1 rounded border border-blue-200"
                min="0"
              />
            </div>
            <input
              type="date"
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
              className="input input-bordered w-40 px-2 py-1 rounded border border-blue-200"
            />
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="input input-bordered w-40 px-2 py-1 rounded border border-blue-200"
            >
              <option value="">All Branches</option>
              {allBranches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min CGPA"
              value={filterCgpa}
              onChange={(e) => setFilterCgpa(e.target.value)}
              className="input input-bordered w-28 px-2 py-1 rounded border border-blue-200"
              min="0"
              max="10"
              step="0.01"
            />
          </div>
          <div className={`h-full w-[70%] rounded-lg p-4`}>
            {filteredOpenings.map((pp,ind) => {
              pp.isResultsAnnouncement = 0;
              return (
                <SingleOpening key={ind} obj={pp} className="w-full">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                      <button
                        className="mt-4 p-0 m-0"
                        onClick={() => {
                          handleClickComment(pp?._id);
                        }}
                      >
                        <BiSolidCommentDetail color="grey" size={24} />
                      </button>
                      {isAdmin && (
                        <button
                          className="mt-4 p-0 m-0 ml-2"
                          onClick={(e) => {
                            handleClickDelete(e, pp?._id);
                          }}
                        >
                          <MdDelete color="red" size={24} />
                        </button>
                      )}
                    </div>
                    {/* Add Selections button only for admin */}
                    {isAdmin && (
                      <button
                        className="mt-4 p-0 m-0 ml-2"
                        onClick={() => {
                          handleClickAddSelections(pp?._id);
                        }}
                      >
                        <AiOutlineUsergroupAdd color="darkblue" size={24} />
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="mt-4 p-0 m-0 ml-2"
                        onClick={() => navigate(`/editOpening/${pp._id}`)}
                      >
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded font-semibold hover:bg-yellow-500">Edit</span>
                      </button>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="mt-2">
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
                        onClick={() => setShowStats((prev) => ({ ...prev, [pp._id]: !prev[pp._id] }))}
                      >
                        {showStats[pp._id] ? 'Hide Statistics' : 'Show Statistics'}
                      </button>
                      {showStats[pp._id] && (
                        <JobInterestStats openingId={pp._id} />
                      )}
                    </div>
                  )}
                </SingleOpening>
              );
            })}
          </div>
          {loggedInUserDetails?.isAdmin === true ? (
            <div className="ml-[87%] sticky bottom-0 bg-blue-50 left-0 w-[10%] flex justify-center pb-4 rounded-full">
              <Button onClick={handleClick2} className="rounded-xl">
                +
              </Button>
            </div>
          ) : (
            ""
          )}
        </>
      </Sidebar>
    </>
  );
}

export default OpeningsPage;
