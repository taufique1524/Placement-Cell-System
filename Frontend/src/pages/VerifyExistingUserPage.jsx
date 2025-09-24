import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../constants.js";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function VerifyExistingUserPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${baseUrl}/auth/resend-otp-existing-user`, { email });
      setMessage("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${baseUrl}/auth/verify-otp-existing-user`, { email, otp });
      setMessage("Email verified! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 dark:bg-gray-800">
        <h1 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Verify Your Email
        </h1>
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <Input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        )}
        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 underline">Back to Login</Link>
        </div>
      </div>
    </section>
  );
}

export default VerifyExistingUserPage; 