import React, { useState } from 'react';
import axios from 'axios';

const DonationForm = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null); // State to hold the uploaded image
  const [message, setMessage] = useState(''); // State to hold success or error message

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the JWT token from local storage
    const token = localStorage.getItem('token');
    console.log("Client-side token:", token);
    if (!token) {
      console.error('No token found');
      setMessage('No token found. Please log in again.');
      return;
    }

    // Create a FormData object to handle text and file data together
    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);
    if (image) {
      formData.append('image', image); // Append the image file if it exists
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/donations/donate',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request
            'Content-Type': 'multipart/form-data', // Set content type for file upload
          }
        }
      );

      console.log('Donation submitted:', response.data);
      setMessage('Donation submitted successfully!'); // Set success message
      // Clear form fields
      setItemName('');
      setDescription('');
      setCategory('');
      setLocation('');
      setImage(null); // Reset image state
    } catch (error) {
      console.error('Error submitting donation:', error);
      const errorMessage = error.response?.data?.msg || 'Error submitting donation. Please try again.';
      setMessage(errorMessage); // Set error message based on server response
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Donate an Item</h2>
      <input 
        type="text" 
        placeholder="Item Name" 
        value={itemName} 
        onChange={(e) => setItemName(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Item Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Category" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Location" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        required 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      <button type="submit">Submit Donation</button>
      {message && <p>{message}</p>} {/* Display success or error message */}
    </form>
  );
};

export default DonationForm;
