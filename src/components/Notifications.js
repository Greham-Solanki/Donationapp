import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiGet } from '../utils/api';
import './Notifications.css';  // Make sure to import the new CSS file

const Notifications = ({ userId, notifications }) => {
  const [initialNotifications, setInitialNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/notifications/user/${userId}`);
        const fetchedNotifications = Array.isArray(response?.data) ? response.data : [];
        setInitialNotifications(fetchedNotifications);
        setAllNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        ...notifications,
      ]);
    }
  }, [notifications]);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {allNotifications.length === 0 ? (
        <p className="no-notifications">No notifications yet!</p>
      ) : (
        <ul className="notifications-list">
          {allNotifications.map((note, index) => (
            <li key={index} className="notification-item">
              <div className="notification-content">
                <p className="notification-message">{`New message from ${note.sender?.name || 'Unknown'}: ${note.content || note.message}`}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
