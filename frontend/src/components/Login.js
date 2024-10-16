// src/components/Login.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Import the initialized auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(()=>{
    fetchCsrf();  // Fetch CSRF token from backend when component mounts.
    // Other code...
  },[])
function fetchCsrf(){
  fetch('http://localhost:5000/', {
    method: 'GET',
    credentials: 'include'
  })
 .then(response => response.json()).then((data)=>console.log(data))
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
    signInWithEmailAndPassword(auth, email, password).then(({user}) => {
        // Get the user's ID token as it is needed to exchange for a session cookie.
       
        console.log( Cookies.get("XSRF-TOKEN"))
        return user.getIdToken().then(idToken => {
          console.log(idToken)
            return fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },
               credentials: 'include',
              
              body: JSON.stringify({ idToken }),
            });
         
        });
      }).then(() => {
        // A page redirect would suffice as the persistence is set to NONE.
        return auth.signOut();
      }).then(() => {
        window.location.assign('/employees');
        
      });
      alert('Logged in successfully!');
      // Redirect or perform other actions after successful login
    } catch (err) {
      setError(err.message);
    }
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
    </div>
  );
};

export default Login;
