import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Label from "../components/Label.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";
import {baseUrl} from '../constants.js'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from '../assets/logo1.png';


function Login() {
  let navigate = useNavigate();
  const location = useLocation();
  const [loading,setLoading] = useState(0);
  const [formVal, setFormVal] = useState({ email: "", password: "" });
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    otherError: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutMsg, setShowLogoutMsg] = useState(!!location.state?.loggedOut);
  
  // Check if we have credentials passed in from the test user redirect
  useEffect(() => {
    if (location.state?.prefillCredentials) {
      const { email, password } = location.state.prefillCredentials;
      setFormVal({ email, password });
      setError({
        ...error,
        otherError: "Test user credentials have been pre-filled. Click Sign in to log in."
      });
    }
    if (location.state?.loggedOut) {
      setShowLogoutMsg(true);
      setTimeout(() => setShowLogoutMsg(false), 3000);
    }
  }, [location.state]);
  function handleChange(e) {
    // console.log(formVal);
    const name = e.target.name + "Error";
    // console.log(name);
    setError({ ...error, [name]: "", otherError: "" });
    setFormVal({ ...formVal, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(1);
      
      // First check if the server is running
      try {
        await axios.get(`${baseUrl}/health`);
      } catch (healthError) {
        setLoading(0);
        setError({ 
          ...error, 
          otherError: "Server is not running or not reachable. Please check your backend server." 
        });
        return;
      }
      
      const res = await axios.post(`${baseUrl}/auth/login`, formVal);
      setLoading(0);
      
      setFormVal({ email: "", password: "" });
      setError({ ...error, ...res.data.error });
      
      if(res?.data?.success===1){
        // Store token and log it to verify it's being saved correctly
        const token = res.data?.user?.token;
        
        if (!token) {
          setError({ ...error, otherError: "No authentication token received from server" });
          return;
        }
        
        // Clear any existing token first
        localStorage.removeItem('token');
        // Store new token
        localStorage.setItem('token', token);
        
        // Verify token was stored correctly
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
          setError({ ...error, otherError: "Failed to store authentication token. Please try again." });
          return;
        }
        
        setLoading(false); // Make sure loading is turned off before redirect
        
        // Redirect through auth check instead of directly to announcements
        setTimeout(() => {
          navigate('/auth');
        }, 100);
      } else {
        setError({ ...error, otherError: res.data?.message || "Login failed" });
      }

    } catch (error) {
      setLoading(0);
      
      if (error.code === "ERR_NETWORK") {
        setError({ 
          ...error, 
          otherError: "Network error. The server is not running or not accessible. Try creating a test user first." 
        });
        
        // Add a link to create a test user directly in the error message
        setTimeout(() => {
          const errorContainer = document.getElementById('login-error-container');
          if (errorContainer) {
            const testUserLink = document.createElement('a');
            testUserLink.href = `${baseUrl}/auth/create-test-user?redirect=true`;
            testUserLink.textContent = "Click here to create a test user";
            testUserLink.style.color = "blue";
            testUserLink.style.textDecoration = "underline";
            
            errorContainer.innerHTML = '';
            errorContainer.appendChild(document.createTextNode("Network error. The server is not running or not accessible. "));
            errorContainer.appendChild(testUserLink);
          }
        }, 100);
      } else if (error.response?.data?.error) {
        setError({ ...error, ...error.response.data.error });
      } else {
        setError({ ...error, otherError: "Login failed. Please try again." });
      }
    }
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {showLogoutMsg && (
          <div className="w-full max-w-md mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-semibold shadow">
            You have been logged out successfully.
          </div>
        )}
        <Link
          to="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
         <img className="h-24 mr-2 object-contain" src={logo} alt="logo" />
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  textVal="Your email"
                >
                  Your email
                </Label>
                <Input
                  type="email"
                  onChange={handleChange}
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={formVal.email}
                  required
                />
                {error.emailError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {error.emailError}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  textVal="Password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formVal.password}
                    required
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
                {error.passwordError !== "" && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops!</span>{" "}
                    {error.passwordError}
                  </p>
                )}
              </div>
              <div className="">
                {/* <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                      textVal="Your email"
                    >
                      Remember me
                    </Label>
                  </div>
                </div> */}
                <Link
                  to={'/forgotPassword'}
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                <div className="flex flex-row justify-center">
                  <Spinner text={"Sign in"} loading={loading} ></Spinner>
                </div>
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link
                  to="/verify-email"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
            {error.otherError !== "" && (
              <p id="login-error-container" className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oops!</span> {error.otherError}
                {error.emailError === "Email not verified. Please verify your email before logging in." && (
                  <div className="mt-2">
                    <Link to="/verify-existing-user" className="text-blue-600 underline">Verify your email</Link>
                  </div>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default Login;
