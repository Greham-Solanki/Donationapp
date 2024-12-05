import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyDonationList = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const donorId = localStorage.getItem('donorId'); // Retrieve donorId from local storage

  useEffect(() => {
    console.log("Retrieved donorId:", donorId);
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/donations/donor/${donorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDonations(response.data);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setError('Failed to fetch donations.');
      }
    };

    fetchDonations();
  }, [donorId]);

  const handleDonationClick = (donationId) => {
    navigate(`/mydonationdetails/${donationId}`);
  };

  return (
    <div>
      <h2>My Donations</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {donations.map((donation) => (
          <li key={donation._id}>
            <Link to={`/mydonationdetails/${donation._id}`}>
              {donation.itemName}
            </Link>
            {' - '}
            <span>{donation.location}</span>
            <button onClick={() => handleDonationClick(donation._id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDonationList;
