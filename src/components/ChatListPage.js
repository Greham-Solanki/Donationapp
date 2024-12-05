import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

const ChatListPage = ({ currentUserId }) => {
  const [chatGroups, setChatGroups] = useState([]);
  const [error, setError] = useState("");
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    const fetchChatGroups = async () => {
      try {
        const response = await axios.get(`http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/chats/user/${currentUserId}`); // Update API call
        setChatGroups(response.data); // Assuming response contains chatGroups
      } catch (err) {
        console.error("Error fetching chat groups:", err);
        setError("Failed to load chat groups.");
      }
    };

    fetchChatGroups();
  }, [currentUserId]);

  if (error) return <div>Error: {error}</div>;
  if (!chatGroups.length) return <div>No active chats.</div>;

  return (
    <div>
      <h2>Your Chats</h2>
      <ul>
        {chatGroups.map((chat) => (
          <li key={chat._id}>
            <Link to={`/chat/${currentUserId}/${donationId}`}> {/* Update the link structure to match selected chat */}
              {chat.groupName} {/* Assuming groupName exists */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;
