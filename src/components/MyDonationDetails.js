import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MyDonationDetails = ({ currentUserId, setDonationId }) => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Set the current donationId in the parent state
    setDonationId(donationId);

    // Fetch donation details from the server
    const fetchDonationDetails = async () => {
      try {
        const response = await axios.get(`http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/donations/${donationId}`);
        console.log("Donation data:", response.data);
        setDonation(response.data);
      } catch (error) {
        console.error("Error fetching donation data:", error);
        setError("Failed to load donation details.");
      }
    };

    fetchDonationDetails();
  }, [donationId, setDonationId]);

  if (error) return <div>Error: {error}</div>;
  if (!donation) return <div>Loading donation details...</div>;

  return (
    <div>
      <h2>{donation.itemName}</h2>
      {donation.image && (
        <div>
          <img
            src={donation.image}
            alt={donation.itemName}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>
      )}

      <p>{donation.description}</p>
      <p>Category: {donation.category}</p>
      <p>Location: {donation.location}</p>
      <p>Status: {donation.status}</p>
    </div>
  );
};

export default MyDonationDetails;
