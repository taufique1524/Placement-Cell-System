import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoReturnDownBack } from "react-icons/io5";
import Spinner from "../components/Spinner.jsx";
import Sidebar from "../components/Sidebar";

import { getLoggedInUserDetails } from "../utils/getLoggedInUserDetails.js";
import { getUserData } from "../services/getUserData.services.js";
import {
  handleSubmit,
  handleChange,
} from "../handlers/updateUserData.handler.js";

function UpdateUserDataPage() {
  let navigate = useNavigate();

  const [formVal, setFormVal] = useState({
    email: "",
    dob: "",
    mobile: "",
    profileImage: "",
    gender: "",
    isAdmin: false,
    skills: "",
    linkedIn: "",
    github: "",
    cgpa: ""
  });

  const [error, setError] = useState({
    emailError: "",
    dobError: "",
    mobileError: "",
    otherError: "",
    profileImageError: "",
    genderError: "",
    skillsError: "",
    linkedInError: "",
    githubError: "",
    cgpaError: ""
  });

  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [loading, setLoading] = useState(0);
  const { id } = useParams();
  const [profilePreview, setProfilePreview] = useState("");

  useEffect(() => {
    async function loadLoggedInUserDetails() {
      try {
        const data = await getLoggedInUserDetails();
        if(data?._id !== id){
          navigate('/errorPage/Unauthorised')
          return
        }
        setLoggedInUserDetails(data);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
      // console.log(data);
    }
    loadLoggedInUserDetails();

    async function loadUserDetails() {
      try {
        const data = await getUserData(id);
  
        const dob = data?.dob;
  
        const formattedDate = dob.slice(0, 10);
        
        setFormVal({
          email: data?.email,
          mobile: data?.mobile,
          dob: formattedDate,
          gender: data?.gender,
          isAdmin: data?.isAdmin,
          skills: data?.skills || "",
          linkedIn: data?.linkedIn || "",
          github: data?.github || "",
          cgpa: data?.cgpa || ""
        });
        setProfilePreview(data?.image || "");
      } catch (error) {
        console.log(error);
        navigate('/errorPage/Internal Error')
      }
    }
    loadUserDetails();
  }, []);

  // Handle profile image preview
  const handleProfileImageChange = (e) => {
    handleChange(e, formVal, setError, setFormVal);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Sidebar loggedInUserDetails={loggedInUserDetails} className="">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center relative">
          <div className="absolute left-4 top-4">
            <Link className="rounded-2xl p-2" to={`/userprofile`}>
              <IoReturnDownBack className="size-6 hover:text-white hover:bg-blue-700 rounded-md transition" />
            </Link>
          </div>
          <div className="text-2xl font-bold text-blue-800 mb-6 mt-2">Update Your Details</div>
          {/* Profile Image Preview */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-lg object-cover bg-white"
                src={profilePreview || `https://coenterprises.com.au/wp-content/uploads/2018/02/male-placeholder-image.jpeg`}
                alt="profile preview"
              />
            </div>
            <label className="block mt-3 text-sm font-medium text-gray-900">Profile Picture</label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mt-1"
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleProfileImageChange}
            />
            {error?.profileImageError && (
              <p className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.profileImageError}</p>
            )}
          </div>
          <form
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
            encType="multipart/form-data"
          >
            {/* Email (readonly, plain text) */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-900">Your Email</label>
              <div className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-700 font-medium cursor-not-allowed select-none">
                {formVal?.email}
              </div>
            </div>
            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block mb-1 text-sm font-medium text-gray-900">Mobile No</label>
              <input
                type="string"
                id="mobile"
                name="mobile"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formVal?.mobile}
                onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                placeholder="Enter Your Mobile no"
              />
              {error?.mobileError && (
                <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.mobileError}</p>
              )}
            </div>
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-900">Gender</label>
              <select
                id="gender"
                name="gender"
                onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                value={formVal?.gender}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="prefer not to say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {error?.genderError && (
                <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.genderError}</p>
              )}
            </div>
            {/* DOB */}
            <div>
              <label htmlFor="dob" className="block mb-1 text-sm font-medium text-gray-900">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formVal?.dob}
                onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
              />
              {error?.dobError && (
                <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.dobError}</p>
              )}
            </div>
            {/* Skills, LinkedIn, GitHub, CGPA (non-admin only) */}
            {!loggedInUserDetails?.isAdmin && (
              <>
                <div>
                  <label htmlFor="skills" className="block mb-1 text-sm font-medium text-gray-900">Skills (comma separated)</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="e.g. JavaScript, React, Node.js"
                    value={formVal?.skills}
                    onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                  />
                  {error?.skillsError && (
                    <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.skillsError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="linkedIn" className="block mb-1 text-sm font-medium text-gray-900">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    id="linkedIn"
                    name="linkedIn"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formVal?.linkedIn}
                    onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                  />
                  {error?.linkedInError && (
                    <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.linkedInError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="github" className="block mb-1 text-sm font-medium text-gray-900">GitHub Profile URL</label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="https://github.com/yourusername"
                    value={formVal?.github}
                    onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                  />
                  {error?.githubError && (
                    <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.githubError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cgpa" className="block mb-1 text-sm font-medium text-gray-900">CGPA (out of 10)</label>
                  <input
                    type="number"
                    id="cgpa"
                    name="cgpa"
                    min="0"
                    max="10"
                    step="0.01"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter your CGPA (e.g. 8.5)"
                    value={formVal?.cgpa}
                    onChange={(e) => handleChange(e, formVal, setError, setFormVal)}
                  />
                  {error?.cgpaError && (
                    <p className="mt-1 text-sm text-red-600"><span className="font-medium">Oops!</span> {error?.cgpaError}</p>
                  )}
                </div>
              </>
            )}
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full px-5 py-3 shadow-lg transition-all"
                onClick={(e) => {
                  handleSubmit(
                    e,
                    id,
                    formVal,
                    error,
                    setError,
                    navigate,
                    setLoading
                  );
                }}
              >
                <div className="flex flex-row justify-center items-center">
                  <Spinner text={loading ? "Updating..." : "Update Details"} loading={loading}></Spinner>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}
export default UpdateUserDataPage;
