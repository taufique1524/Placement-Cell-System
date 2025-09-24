import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import { getLoggedInUserDetails } from '../utils/getLoggedInUserDetails.js';
import { getAllAnnouncements } from '../services/getAllAnnouncements.services.js';
import { getAllResults } from '../services/getAllResults.services.js';
import { getAllOpenings } from '../services/getAllOpenings.services.js';
import { getAllUsers } from '../services/getAllUsers.services.js';
import { getAllSelections } from '../services/getAllSelections.services.js';

const MOTIVATIONAL_QUOTES = [
  "Believe you can and you're halfway there.",
  "Every day is a new beginning.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "You are capable of amazing things.",
  "Difficult roads often lead to beautiful destinations.",
  "Stay positive, work hard, make it happen.",
  "Your only limit is your mind.",
  "Dream it. Wish it. Do it."
];

function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

function AuthRedirect() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Checking authentication...');
  const [quote] = useState(getRandomQuote());
  const { actions } = useData();

  useEffect(() => {
    async function checkAndLoadAllData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No authentication token found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        // Validate token (reuse your logic)
        let isTokenValid = false;
        let decodedToken = null;
        if (token.split('.').length === 3) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            decodedToken = JSON.parse(window.atob(base64));
            if (decodedToken && decodedToken._id && decodedToken.exp) {
              const currentTime = Math.floor(Date.now() / 1000);
              if (decodedToken.exp > currentTime) {
                isTokenValid = true;
              }
            }
          } catch (decodeError) {
            isTokenValid = false;
          }
        }
        if (!isTokenValid) {
          setMessage('Session expired or invalid. Redirecting to login...');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        setMessage('Loading your data...');
        // Fetch all data in parallel
        const [user, announcements, results, openings, users, selections] = await Promise.all([
          getLoggedInUserDetails(),
          getAllAnnouncements(),
          getAllResults(),
          getAllOpenings(),
          getAllUsers(false), // false = not only admins
          getAllSelections()
        ]);
        // Store in context
        actions.setUser(user);
        actions.setAnnouncements(announcements);
        actions.setResults(results);
        actions.setOpenings(openings);
        actions.setUsers(users);
        actions.setSelections(selections?.newSelection || selections); // FIX: set only the array
        setMessage('Authentication and data load successful! Redirecting...');
        setTimeout(() => navigate('/allannouncements'), 1000);
      } catch (error) {
        setMessage('Authentication or data load error. Redirecting to login...');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      }
    }
    checkAndLoadAllData();
    // eslint-disable-next-line
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <span className="block text-2xl font-bold text-blue-600 mb-2">{quote}</span>
        </div>
        <p className="text-gray-600">{message}</p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthRedirect; 