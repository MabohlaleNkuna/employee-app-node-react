import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();  

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include',
      });

      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Employee App</h1>
      </div>
      <ul className="navbar-links">
        <li className="navbar-link-item">
          <Link to="/employees" className="navbar-link">Home</Link>
        </li>

        
        {user && location.pathname !== '/login' && (
          <li className="navbar-link-item">
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </li>
        )}

      
        {!user && (
          <li className="navbar-link-item">
            <Link to="/login" className="navbar-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
