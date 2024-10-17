import React from 'react';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "GET",
        credentials: "include"
      });
      window.location.assign("/login");  
    } catch (error) {
      console.error("Logout error:", error); 
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
