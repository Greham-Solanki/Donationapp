import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const DonationDetails = ({ currentUserId, setDonationId }) => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [initialMessage, setInitialMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
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

  const handleSendMessage = async () => {
    if (!initialMessage.trim()) return;

    try {
      const donorId = donation?.donor?._id;
      if (!currentUserId || !donorId) {
        console.error("Missing currentUserId or donorId");
        setError("Unable to send message due to missing user information.");
        return;
      }

      // Create chat group and send initial message
      await axios.post('http://localhost:5000/api/chats/initiate', {
        doneeId: currentUserId,
        donorId,
        donationId,
        itemName: donation.itemName,
        initialMessage,
      });

      setMessageSent(true);
      setInitialMessage(""); // Clear the input after sending the message
      navigate(`/chat/${donorId}/${donationId}`); // Navigate to chat page with donor and donation IDs
     //navigate('/chats')

    } catch (error) {
      console.error("Error initiating chat:", error.response?.data || error.message);
      setError("Failed to send message. Please try again.");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!donation) return <div>Loading donation details...</div>;

  const donor = donation.donor || {};

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
      
      <h3>Donor Information</h3>
      <p><strong>Name:</strong> {donor.name || 'Not provided'}</p>
      <p><strong>Email:</strong> {donor.email || 'Not provided'}</p>

      <textarea
        placeholder="Type your message..."
        value={initialMessage}
        onChange={(e) => setInitialMessage(e.target.value)}
        disabled={messageSent}
      />
      
      <button
        onClick={messageSent ? () => navigate(`/chat/${donor._id}/${donationId}`) : handleSendMessage}
      >
        {messageSent ? "Go to Chat" : "Send Message"}
      </button>
    </div>
  );
};

export default DonationDetails;
