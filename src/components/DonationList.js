import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const DonationList = ({ currentUserId, userType }) => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null); // State to hold any error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://backend-alb-366726698.us-east-1.elb.amazonaws.com/api/donations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter donations based on user type
        if (userType === 'donor') {
          // Only show donations posted by the current donor
          const donorDonations = response.data.filter(donation => donation.donor._id === currentUserId);
          setDonations(donorDonations);
        } else {
          // Show all donations for donee users (or adjust based on your donee requirements)
          setDonations(response.data);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to fetch donations.');
      }
    };

    fetchDonations();
  }, [currentUserId, userType]);

  const handleDonationClick = (donationId) => {
    navigate(`/donation/${donationId}`);
  };

  return (
    <div>
      <h2>{userType === 'donor' ? 'Your Donations' : 'Available Donations'}</h2>
      {error && <p className="error">{error}</p>} {/* Display error if any */}
      <ul>
        {donations.length === 0 ? (
          <li>No donations found.</li>
        ) : (
          donations.map((donation) => (
            <li key={donation._id}>
              <Link to={`/donation/${donation._id}`}>
                {donation.itemName}
              </Link>
              {' - '}
              <span>{donation.location}</span>
              <button onClick={() => handleDonationClick(donation._id)}>
                View Details
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DonationList;
