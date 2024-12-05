import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      // Make the API call to log in
      const response = await axios.post('http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/auth/login', { email, password });

      // Store the token in local storage
      localStorage.setItem('token', response.data.token);

      // Extract user data from the response, including the user ID
      const userData = {
        id: response.data.id,
        email: response.data.email,
        userType: response.data.userType,
      };

      // Call the onLogin function passed as a prop
      onLogin(userData);
      localStorage.setItem('donorId', response.data.id); // Also store it in localStorage if needed.

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      // Display the error message if credentials are invalid
      const errorMessage = err.response?.data?.msg || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
