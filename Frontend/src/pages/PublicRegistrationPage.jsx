import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../constants.js";
import Input from "../components/Input.jsx";
import Label from "../components/Label.jsx";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";
import { IoMdDoneAll } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PublicRegistrationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    batch: "2023",
    enrolmentNo: "",
    gender: "prefer not to say",
    dob: "",
    mobile: ""
  });
  
  const [errorMessage, setErrorMessage] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    branchError: "",
    batchError: "",
    enrolmentNoError: "",
    genderError: "",
    dobError: "",
    mobileError: ""
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [loading, setLoading] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Check for verified email and token
  const verifiedEmail = location.state?.verifiedEmail;
  const emailVerificationToken = location.state?.emailVerificationToken;
  // If not present, redirect to OTP verification page
  if (!verifiedEmail || !emailVerificationToken) {
    navigate("/verify-email");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear the error when user starts typing
    const errorKey = e.target.name + "Error";
    setErrorMessage({ ...errorMessage, [errorKey]: "" });
  };

  // Function to generate a strong password
  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+=-{}[]|:;<>,.?";
    
    // Ensure at least one character from each category
    let password = "";
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest with random characters from all categories
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 4; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    // Update both password fields
    setFormData({
      ...formData,
      password: password,
      confirmPassword: password
    });
    
    // Clear any password errors
    setErrorMessage({
      ...errorMessage,
      passwordError: "",
      confirmPasswordError: ""
    });
    
    // Show the password after generating it
    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    let hasError = false;
    const newErrors = { ...errorMessage };
    
    if (!formData.name) {
      newErrors.nameError = "Name is required";
      hasError = true;
    }
    
    if (!formData.email) {
      newErrors.emailError = "Email is required";
      hasError = true;
    }
    
    if (!formData.password) {
      newErrors.passwordError = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.passwordError = "Password must be at least 6 characters";
      hasError = true;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPasswordError = "Passwords do not match";
      hasError = true;
    }

    if (!formData.branch) {
      newErrors.branchError = "Branch is required";
      hasError = true;
    }

    if (!formData.enrolmentNo) {
      newErrors.enrolmentNoError = "Enrollment ID is required";
      hasError = true;
    }

    if (!formData.dob) {
      newErrors.dobError = "Date of Birth is required";
      hasError = true;
    }

    if (!formData.mobile) {
      newErrors.mobileError = "Mobile number is required";
      hasError = true;
    } else if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      newErrors.mobileError = "Mobile number must be 10 digits";
      hasError = true;
    }
    
    if (hasError) {
      setErrorMessage(newErrors);
      return;
    }
    
    try {
      setLoading(1);
      
      // First check if the server is running
      try {
        await axios.get(`${baseUrl}/health`);
      } catch (healthError) {
        setLoading(0);
        setGeneralErrorMessage("Server is not running or not reachable. Please check your backend server.");
        return;
      }
      
      // Send registration request to backend
      const res = await axios.post(
        `${baseUrl}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          enrolmentNo: formData.enrolmentNo,
          mobile: formData.mobile,
          batch: formData.batch,
          branch: formData.branch,
          gender: formData.gender,
          dob: formData.dob,
          verifiedEmail: verifiedEmail, // Include verifiedEmail
          emailVerificationToken: emailVerificationToken // Include emailVerificationToken
        }
      );
      
      setLoading(0);
      
      // Handle API errors
      if (res?.data?.error) {
        setErrorMessage({ ...errorMessage, ...res.data.error });
        return;
      }
      
      // Handle success
      if (res?.data?.success === 1) {
        setSuccessMessage("Registration successful! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setLoading(0);
      console.error("Error during registration:", error);
      
      // Handle error response
      if (error.response?.data?.error) {
        setErrorMessage({ ...errorMessage, ...error.response.data.error });
      } else if (error.code === "ERR_NETWORK") {
        setGeneralErrorMessage("Network error. The server is not running or not accessible. Please make sure your backend server is running on port 5000.");
        
        // Add a link to create a test user
        const testUserLink = document.createElement('a');
                 testUserLink.href = `${baseUrl}/auth/create-test-user?redirect=true`;
        testUserLink.textContent = "Click here to try creating a test user";
        testUserLink.style.color = "blue";
        testUserLink.style.textDecoration = "underline";
        
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
          errorContainer.appendChild(document.createElement('br'));
          errorContainer.appendChild(testUserLink);
        }
      } else {
        setGeneralErrorMessage("Registration failed. Please try again later.");
      }
      
      setTimeout(() => {
        if (!error.code === "ERR_NETWORK") {
          setGeneralErrorMessage("");
        }
      }, 10000);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {successMessage && (
        <p className="sticky top-0 bg-green-200 w-full p-2 flex flex-row text-black">
          <IoMdDoneAll size={20} color="green" className="mr-2" />
          {successMessage}
        </p>
      )}
      
      {generalErrorMessage && (
        <p id="error-container" className="sticky top-0 bg-red-200 w-full p-2 flex flex-row text-black">
          <RxCross2 size={20} color="red" className="mr-2" />
          {generalErrorMessage}
        </p>
      )}
      
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-auto lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Placement Cell
        </Link>
        
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Name field */}
              <div>
                <Label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Salman Jamal"
                />
                {errorMessage.nameError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.nameError}
                  </p>
                )}
              </div>
              
              {/* Email field */}
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="IIT2022150@iita.ac.in"
                  disabled // Disable editing
                />
                {errorMessage.emailError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.emailError}
                  </p>
                )}
              </div>

              {/* Branch field */}
              <div>
                <Label
                  htmlFor="branch"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Branch
                </Label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">IT-BI</option>
                </select>
                {errorMessage.branchError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.branchError}
                  </p>
                )}
              </div>

              {/* Batch field */}
              <div>
                <Label
                  htmlFor="batch"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Batch
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[ "2025","2024","2023", "2022"].map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`px-4 py-2 rounded-md ${
                        formData.batch === year
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => {
                        setFormData({ ...formData, batch: year });
                        setErrorMessage({ ...errorMessage, batchError: "" });
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                {errorMessage.batchError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.batchError}
                  </p>
                )}
              </div>

              {/* Enrollment ID field */}
              <div>
                <Label
                  htmlFor="enrolmentNo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enrollment ID
                </Label>
                <Input
                  type="text"
                  name="enrolmentNo"
                  id="enrolmentNo"
                  value={formData.enrolmentNo}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="e.g., IIT2022150"
                />
                {errorMessage.enrolmentNoError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.enrolmentNoError}
                  </p>
                )}
              </div>

              {/* Gender field */}
              <div>
                <Label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="prefer not to say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errorMessage.genderError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.genderError}
                  </p>
                )}
              </div>

              {/* DOB field */}
              <div>
                <Label
                  htmlFor="dob"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errorMessage.dobError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.dobError}
                  </p>
                )}
              </div>

              {/* Mobile Number field */}
              <div>
                <Label
                  htmlFor="mobile"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile Number
                </Label>
                <Input
                  type="text"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="e.g., 9876543210"
                />
                {errorMessage.mobileError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.mobileError}
                  </p>
                )}
              </div>
              
              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Generate Strong Password
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errorMessage.passwordError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.passwordError}
                  </p>
                )}
              </div>
              
              {/* Confirm Password field */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errorMessage.confirmPasswordError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {errorMessage.confirmPasswordError}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <div className="flex flex-row justify-center">
                  <Spinner text="Create Account" loading={loading} />
                </div>
              </Button>
              
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicRegistrationPage; 