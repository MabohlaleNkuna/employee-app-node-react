import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Request to the backend to clear cookies
      await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include', 
      });

      // Sign out using Firebase authentication
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1F3B5C',
      padding: '1rem 2rem',
      color: 'white',
    },
    logo: {
      margin: 0,
    },
    links: {
      listStyle: 'none',
      display: 'flex',
      margin: 0,
    },
    linkItem: {
      marginLeft: '1.5rem',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
    },
    button: {
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <h1>Employee App</h1>
      </div>
      <ul style={styles.links}>
        <li style={styles.linkItem}>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        
        <li style={styles.linkItem}>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </li>
        {!user && (
          <li style={styles.linkItem}>
            <Link to="/login" style={styles.link}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
