import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function TestUserRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Extract credentials from query parameters
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const password = params.get('password');
    
    if (email && password) {
      // Redirect to login with these credentials
      navigate('/login', { state: { prefillCredentials: { email, password } } });
    } else {
      // If no credentials, just go to login
      navigate('/login');
    }
  }, [navigate, location]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to login...</p>
    </div>
  );
}

export default TestUserRedirect; 