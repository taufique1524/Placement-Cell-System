import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function TokenDebugger() {
  const [token, setToken] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  const verifyToken = async () => {
    setLoading(true);
    setError('');
    setVerifyResult(null);
    
    try {
      const response = await axios.get(`${baseUrl}/verify-token`, {
        headers: {
          'token': token,
          'Authorization': `Bearer ${token}`
        }
      });
      
      setVerifyResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Unknown error');
      setVerifyResult(error.response?.data || { success: 0, message: 'Failed to verify token' });
    } finally {
      setLoading(false);
    }
  };
  
  const getUserDetails = async () => {
    setLoading(true);
    setError('');
    setUserDetails(null);
    
    try {
      const response = await axios.get(`${baseUrl}/api/user/loggedInUserDetails`, {
        headers: {
          'token': token,
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserDetails(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Unknown error');
      setUserDetails(error.response?.data || { success: 0, message: 'Failed to get user details' });
    } finally {
      setLoading(false);
    }
  };
  
  const saveToken = () => {
    localStorage.setItem('token', token);
    alert('Token saved to localStorage');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Token Debugger</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-semibold">JWT Token</label>
        <textarea 
          className="w-full p-2 border rounded"
          rows="4"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your JWT token here"
        />
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={verifyToken}
          disabled={loading || !token}
        >
          {loading ? 'Loading...' : 'Verify Token'}
        </button>
        
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={getUserDetails}
          disabled={loading || !token}
        >
          {loading ? 'Loading...' : 'Get User Details'}
        </button>
        
        <button 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          onClick={saveToken}
          disabled={!token}
        >
          Save Token to localStorage
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {verifyResult && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Token Verification Result</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(verifyResult, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {userDetails && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(userDetails, null, 2)}</pre>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

export default TokenDebugger; 