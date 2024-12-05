import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import DonationForm from './components/DonationForm';
import DonationList from './components/DonationList';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import DonationDetails from './components/DonationDetails';
import ChatPage from './components/ChatPage';
import ChatListPage from './components/ChatListPage';
import MyDonationList from './components/MyDonationList'; // Updated to use MyDonationList
import MyDonationDetails from './components/MyDonationDetails'; // Updated to use MyDonationDetails
import io from 'socket.io-client';

export const SocketContext = createContext();

const ProtectedRoute = ({ element, isAuthenticated, userType, requiredType }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (userType !== requiredType) return <Navigate to="/" />;
  return element;
};

const healthCheck = async () => {
  try {
    const response = await fetch('/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [donationId, setDonationId] = useState(null);

  // Load user data from localStorage on initial load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize socket only when user is authenticated
  const socket = user ? io('http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000', { query: { userId: user.id } }) : null;

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected.");
    });

    socket.on('messageReceived', (messageData) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { sender: messageData.sender, content: messageData.content },
      ]);
    });

    return () => {
      socket.disconnect();
      socket.off('messageReceived');
    };
  }, [socket]);

  const handleLogin = (userData) => {
    console.log('User logged in with data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data in localStorage
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user'); // Clear user data from localStorage
  };

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Navbar
          isAuthenticated={isAuthenticated}
          userType={user?.userType}
          onLogout={handleLogout}
          donorId={user?.id}
          donationId={donationId} // Pass donationId for specific chat links
        />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/donate"
            element={
              <ProtectedRoute
                element={<DonationForm />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType="donor"
              />
            }
          />
          <Route
            path="/donations"
            element={
              <ProtectedRoute
                element={<DonationList currentUserId={user?.id} userType="donee" />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType="donee"
              />
            }
          />
          <Route
            path="/mydonations"
            element={
              <ProtectedRoute
                element={<MyDonationList />} // Use MyDonationList here
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType="donor"
              />
            }
          />
          <Route
            path="/mydonationdetails/:donationId"
            element={
              <ProtectedRoute
                element={<MyDonationDetails setDonationId={setDonationId} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType="donor"
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                element={<Profile user={user} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} // Assuming donor can view profile
              />
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute
                element={<Notifications userId={user?.id} notifications={notifications} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} // Assuming donee should see notifications
              />
            }
          />
          <Route
            path="/donation/:donationId"
            element={
              <ProtectedRoute
                element={<DonationDetails currentUserId={user?.id} setDonationId={setDonationId} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} 
              />
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute
                element={<ChatListPage currentUserId={user?.id} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} 
              />
            }
          />
          <Route
            path="/chat/:donorId/:donationId"
            element={
              <ProtectedRoute
                element={<ChatPage currentUserId={user?.id} notifications={notifications} setNotifications={setNotifications} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} 
              />
            }
          />
          <Route
            path="/chat/:donorId"
            element={
              <ProtectedRoute
                element={<ChatPage currentUserId={user?.id} notifications={notifications} setNotifications={setNotifications} />}
                isAuthenticated={isAuthenticated}
                userType={user?.userType}
                requiredType={user?.userType} 
              />
            }
          />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
};

export default App;
