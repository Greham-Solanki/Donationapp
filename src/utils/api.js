// src/utils/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Your API base URL
  timeout: 10000, // Set a timeout for requests
});

// Handle API responses and errors
const handleResponse = (response) => response.data;

const handleError = (error) => {
  // Log the error for debugging
  console.error('API call error:', error);

  // Check if the error has a response (from the server)
  if (error.response) {
    // Custom error messages based on status codes
    switch (error.response.status) {
      case 400:
        throw new Error('Bad Request: Please check your input.');
      case 401:
        throw new Error('Unauthorized: Please log in again.');
      case 404:
        throw new Error('Not Found: The resource you requested does not exist.');
      case 500:
      default:
        throw new Error('An unexpected error occurred. Please try again later.');
    }
  } else {
    throw new Error('Network Error: Please check your connection.');
  }
};

// Export an API function
export const apiGet = async (url) => {
  try {
    const response = await apiClient.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const apiPost = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Export other methods (put, delete, etc.) as needed
