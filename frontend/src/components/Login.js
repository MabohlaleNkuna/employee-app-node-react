import React, { useEffect, useState } from 'react'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // State for success popup
  const navigate = useNavigate();

  useEffect(() => {
    fetchCsrf();
    setupAutoLogout(); // Set up auto-logout after login
  }, []);

  function fetchCsrf() {
    fetch('http://localhost:5000/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => console.log('CSRF token fetched:', data))
      .catch(err => console.log('Error fetching CSRF:', err));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });

      // Show success message for 3 seconds
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/employees'); // Automatically redirect to home page
      }, 3000); // 3 seconds delay
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include',
      });
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  };

  const setupAutoLogout = () => {
    let timeout;

    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout(); // Auto-logout after 2 minutes of inactivity
      }, 120 * 1000);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);

    resetTimeout(); // Start timeout on mount

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
    };
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {showSuccess && <div className="popup">Login successful! Redirecting...</div>} {/* Success message popup */}
    </div>
  );
};

export default Login;
