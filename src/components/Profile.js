// Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Adjust the URL based on your API endpoint
        const response = await axios.get(`http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/users/${user.email}`);
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      setLoading(false); // If user is not defined, skip loading
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error if there is one
  }

  // Render user profile data
  return (
    <div>
      <h2>User Profile</h2>
      {profileData ? (
        <div>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>User Type:</strong> {profileData.userType}</p>
          {/* Add other user profile fields here */}
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;
