 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('donor'); // default user type
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://backend-alb-366726698.us-east-1.elb.amazonaws.com:5000/api/auth/register', { name, email, password, userType });
      console.log(response.data);
      navigate('/login'); // Navigate to login after registration
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="donor">Donor</option>
        <option value="donee">Donee</option>
        <option value="organization">Organization</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
