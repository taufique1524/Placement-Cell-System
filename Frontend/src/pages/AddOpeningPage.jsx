import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoMdDoneAll } from "react-icons/io";
import Spinner from "../components/Spinner.jsx";
import Sidebar from "../components/Sidebar";


import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails";
import { addOpening } from "../services/addOpening.services.js";

const ALL_BRANCHES = ["IT", "ECE", "IT-BI", "CSE"];

const AddOpeningPage = () => {
  const [offerType, setOfferType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [internshipDuration, setInternshipDuration] = useState("");
  const [stipendPerMonth, setStipendPerMonth] = useState("");
  const [ctc, setCtc] = useState("");
  const [location, setLocation] = useState("");
  const [branchesAllowed, setBranchesAllowed] = useState([]); // now array
  const [cgpaCriteria, setCgpaCriteria] = useState({}); // now object keyed by branch
  const [testDateAndTime, setTestDateAndTime] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [batch, setBatch] = useState("2022");
  const[loading,setLoading] = useState(0);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  const intialErrorMessage = {
    offerTypeError: "",
    companyNameError: "",
    internshipDurationError: "",
    stipendPerMonthError: "",
    ctcError: "",
    locationError: "",
    branchesAllowedError: "",
    cgpaCriteriaError: "",
    testDateAndTimeError: "",
    applicationDeadlineError: "",
    additionalInfoError: "",
    batchError: "",
  };
  const [errorMessage, setErrorMessage] = useState(intialErrorMessage);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate()

  const handleOfferTypeChange = (e) => {
    setOfferType(e.target.value);
    // console.log(offerType);
  };
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, companyNameError: "" };
    });
  };

  const handleInternshipDurationChange = (e) => {
    setInternshipDuration(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, internshipDurationError: "" };
    });
  };

  const handleStipendPerMonthChange = (e) => {
    setStipendPerMonth(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, stipendPerMonthError: "" };
    });
  };

  const handleCtcChange = (e) => {
    setCtc(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, ctcError: "" };
    });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, locationError: "" };
    });
  };

  // Branches Allowed checkbox handler
  const handleBranchesAllowedCheckbox = (branch) => {
    setBranchesAllowed((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
    setErrorMessage((prev) => ({ ...prev, branchesAllowedError: "" }));
  };
  // CGPA Criteria input handler
  const handleCgpaInput = (branch, value) => {
    setCgpaCriteria((prev) => ({ ...prev, [branch]: value }));
    setErrorMessage((prev) => ({ ...prev, cgpaCriteriaError: "" }));
  };

  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, batchError: "" };
    });
  };

  const handleApplicationDeadlineChange = (e) => {
    setApplicationDeadline(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, applicationDeadlineError: "" };
    });
  };
  const handleTestDateAndTimeChange = (e) => {
    setTestDateAndTime(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, testDateAndTimeError: "" };
    });
  };

  const handleAdditionalInfoChange = (e) => {
    setAdditionalInfo(e.target.value);
    setErrorMessage((prev) => {
      return { ...prev, additionalInfoError: "" };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Extra validation before sending
    if (!companyName.trim()) {
      setErrorMessage((prev) => ({ ...prev, companyNameError: "Company Name can't be empty" }));
      return;
    }
    if (!offerType) {
      setErrorMessage((prev) => ({ ...prev, offerTypeError: "Offer type can't be empty" }));
      return;
    }
    if (!location.trim()) {
      setErrorMessage((prev) => ({ ...prev, locationError: "Location can't be empty" }));
      return;
    }
    if (!branchesAllowed || branchesAllowed.length === 0) {
      setErrorMessage((prev) => ({ ...prev, branchesAllowedError: "Branches allowed can't be empty" }));
      return;
    }
    if (!batch || batch === "") {
      alert("Please select a batch year.");
      setErrorMessage((prev) => ({ ...prev, batchError: "Batch can't be empty" }));
      return;
    }
    if (!applicationDeadline) {
      setErrorMessage((prev) => ({ ...prev, applicationDeadlineError: "Application deadline can't be empty" }));
      return;
    }
    // Validate CGPA criteria: must be 0-10 or blank
    for (const branch of branchesAllowed) {
      const cgpa = cgpaCriteria[branch];
      if (cgpa !== undefined && cgpa !== "" && (isNaN(Number(cgpa)) || Number(cgpa) < 0 || Number(cgpa) > 10)) {
        setErrorMessage((prev) => ({ ...prev, cgpaCriteriaError: `CGPA for ${branch} must be between 0 and 10 or blank` }));
        return;
      }
    }
    // Prepare cgpaCriteria array for backend
    const cgpaCriteriaArr = branchesAllowed
      .map((branch) => ({ branch, cgpa: cgpaCriteria[branch] !== undefined && cgpaCriteria[branch] !== "" ? Number(cgpaCriteria[branch]) : "" }))
      .filter((c) => c.cgpa !== "");
    try {
      setLoading(1);
      const data = await addOpening({
        companyName,
        offerType,
        internshipDuration,
        stipendPerMonth,
        ctc,
        location,
        branchesAllowed,
        batch: String(batch),
        cgpaCriteria: cgpaCriteriaArr,
        testDateAndTime,
        applicationDeadline,
        additionalInfo,
      });
      setLoading(0);
      if (data?.success === 0) {
        setErrorMessage((prev) => {
          if (data?.error) {
            Object.entries(data.error).forEach(() => {
              // Removed unused 'key' and 'val'
            });
          }
          return { ...prev, ...data?.error, general: data?.error?.general || "" };
        });
        return; // Stop further execution if error
      } else {
        setOfferType("");
        setCompanyName("");
        setInternshipDuration("");
        setStipendPerMonth("");
        setCtc("");
        setLocation("");
        setBranchesAllowed([]);
        setCgpaCriteria({});
        setTestDateAndTime("");
        setApplicationDeadline("");
        setAdditionalInfo("");
        setBatch("");
        setSuccessMessage("Added Successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      setLoading(0);
      setErrorMessage((prev) => ({ ...prev, general: "An error occurred. Please check your input and try again." }));
    }
  };

  useEffect(() => {
    async function loadLoggedInUserDetails() {
      try {
        const data = await getLoggedInUserDetails();
        if(data?.success === 0){
          navigate(`/errorPage/${data?.message}`)
        }else{
          setLoggedInUserDetails(data);
        }
        if(data?.userType === 'student'){
          navigate('/errorPage/not authorised')
        }
      } catch (error) {
        console.log(error);
        navigate(`/`)
      }
    }
    loadLoggedInUserDetails();
  }, []);

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-start pt-10 pb-20 px-2">
        <div className="sticky top-0 z-20 w-full max-w-2xl mx-auto flex items-center justify-center px-6 py-6 rounded-b-2xl bg-white/80 backdrop-blur shadow-lg border-b border-blue-200 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Add New Job Opening</h1>
        </div>
        {successMessage !== "" && (
          <div className="w-full max-w-xl mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-semibold shadow">
            <IoMdDoneAll size={20} className="inline mr-2" />
            {successMessage}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mx-auto bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col gap-6 border border-blue-100"
        >
          <div className="text-2xl font-bold text-blue-800 mb-2 text-center">Opening Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-gray-700 font-bold mb-1">Company Name</label>
              <input type="text" name="companyName" id="companyName" value={companyName} onChange={handleCompanyNameChange} className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errorMessage.companyNameError && <p className="mt-1 text-xs text-red-600">{errorMessage.companyNameError}</p>}
            </div>
            <div>
              <label htmlFor="offerType" className="block text-gray-700 font-bold mb-1">Offer Type</label>
              <select id="offerType" value={offerType} onChange={handleOfferTypeChange} className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="">Select Offer Type</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship + Full-time">Internship + Full-time</option>
              </select>
              {errorMessage.offerTypeError && <p className="mt-1 text-xs text-red-600">{errorMessage.offerTypeError}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 font-bold mb-1">Location</label>
              <input id="location" type="text" value={location} onChange={handleLocationChange} placeholder="'Not Specified' if not specified" className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errorMessage.locationError && <p className="mt-1 text-xs text-red-600">{errorMessage.locationError}</p>}
            </div>
            <div>
              <label htmlFor="batch" className="block text-gray-700 font-bold mb-1">Batch</label>
              <select
                id="batch"
                value={batch}
                onChange={handleBatchChange}
                className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
              >
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
              {errorMessage.batchError && <p className="mt-1 text-xs text-red-600">{errorMessage.batchError}</p>}
            </div>
          </div>
          <hr className="my-2 border-blue-100" />
          <div className="text-xl font-semibold text-blue-700 mb-2">Offer Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(offerType === "Internship" || offerType === "Internship + Full-time") && (
              <div>
                <label htmlFor="internshipDuration" className="block text-gray-700 font-bold mb-1">Internship Duration (months)</label>
                <input id="internshipDuration" type="number" value={internshipDuration} onChange={handleInternshipDurationChange} placeholder="in months" className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                {errorMessage.internshipDurationError && <p className="mt-1 text-xs text-red-600">{errorMessage.internshipDurationError}</p>}
              </div>
            )}
            {(offerType === "Internship" || offerType === "Internship + Full-time") && (
              <div>
                <label htmlFor="stipendPerMonth" className="block text-gray-700 font-bold mb-1">Stipend Per Month (in thousands)</label>
                <input id="stipendPerMonth" type="number" value={stipendPerMonth} onChange={handleStipendPerMonthChange} placeholder="In thousands per month" className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                {errorMessage.stipendPerMonthError && <p className="mt-1 text-xs text-red-600">{errorMessage.stipendPerMonthError}</p>}
              </div>
            )}
            {(offerType === "Full-time" || offerType === "Internship + Full-time") && (
              <div>
                <label htmlFor="ctc" className="block text-gray-700 font-bold mb-1">CTC (in LPA)</label>
                <input id="ctc" type="number" value={ctc} onChange={handleCtcChange} placeholder="In LPA" className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                {errorMessage.ctcError && <p className="mt-1 text-xs text-red-600">{errorMessage.ctcError}</p>}
              </div>
            )}
          </div>
          <hr className="my-2 border-blue-100" />
          <div className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">Branches & Eligibility <span className="text-xs text-gray-400" title="Select allowed branches and set CGPA criteria for each.">(?)</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Branches Allowed</label>
              <div className="flex flex-wrap gap-4 mb-2">
                {ALL_BRANCHES.map((branch) => (
                  <label key={branch} className="flex items-center gap-2">
                    <input type="checkbox" checked={branchesAllowed.includes(branch)} onChange={() => handleBranchesAllowedCheckbox(branch)} />
                    <span>{branch}</span>
                  </label>
                ))}
              </div>
              {errorMessage.branchesAllowedError && <p className="mt-1 text-xs text-red-600">{errorMessage.branchesAllowedError}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">CGPA Criteria (per branch)</label>
              <div className="flex flex-col gap-2">
                {ALL_BRANCHES.map((branch) => (
                  <div key={branch} className="flex items-center gap-2 mb-1">
                    <label className="w-16 font-semibold text-gray-700">{branch}:</label>
                    <input type="number" min="0" max="10" step="0.01" value={cgpaCriteria[branch] || ""} onChange={(e) => handleCgpaInput(branch, e.target.value)} placeholder="CGPA (optional)" className="input input-bordered py-1 px-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-32" disabled={!branchesAllowed.includes(branch)} />
                  </div>
                ))}
              </div>
              {errorMessage.cgpaCriteriaError && <p className="mt-1 text-xs text-red-600">{errorMessage.cgpaCriteriaError}</p>}
            </div>
          </div>
          <hr className="my-2 border-blue-100" />
          <div className="text-xl font-semibold text-blue-700 mb-2">Dates & Additional Info</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="applicationDeadline" className="block text-gray-700 font-bold mb-1">Application Deadline</label>
              <input id="applicationDeadline" type="datetime-local" value={applicationDeadline} onChange={handleApplicationDeadlineChange} className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errorMessage.applicationDeadlineError && <p className="mt-1 text-xs text-red-600">{errorMessage.applicationDeadlineError}</p>}
            </div>
            <div>
              <label htmlFor="testDateAndTime" className="block text-gray-700 font-bold mb-1">Test Date and Time</label>
              <input id="testDateAndTime" type="datetime-local" value={testDateAndTime} onChange={handleTestDateAndTimeChange} className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errorMessage.testDateAndTimeError && <p className="mt-1 text-xs text-red-600">{errorMessage.testDateAndTimeError}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="additionalInfo" className="block text-gray-700 font-bold mb-1">Additional Information</label>
            <textarea id="additionalInfo" value={additionalInfo} onChange={handleAdditionalInfoChange} className="input input-bordered w-full px-3 py-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
            {errorMessage.additionalInfoError && <p className="mt-1 text-xs text-red-600">{errorMessage.additionalInfoError}</p>}
          </div>
          {errorMessage.general && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-medium">Oops!</span> {errorMessage.general}
            </p>
          )}
          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded-xl shadow-lg text-lg flex items-center gap-2 transition-all duration-150">
              <Spinner text={"Add Opening"} loading={loading} />
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default AddOpeningPage;
