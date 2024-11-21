import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, userType, onLogout, donorId, donationId }) => {
  return (
    <nav className="navbar">
      <h1>Community Giveback</h1>
      <ul>
        <li><Link to="/">Home</Link></li>

        {/* Conditional Links for Donor */}
        {isAuthenticated && userType === 'donor' && (
          <>
            <li><Link to="/donate">Donation Form</Link></li>
            <li><Link to="/mydonations">My Donations</Link></li>
          </>
        )}

        {/* Conditional Links for Donee */}
        {isAuthenticated && userType === 'donee' && (
          <li><Link to="/donations">View Donations</Link></li>
        )}

        {/* General Links for Authenticated Users */}
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            
            {/* Display the Chat List link for both donor and donee */}
            <li><Link to="/chats">Chat</Link></li>
            
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
