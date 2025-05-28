import { config } from '../config/config';

// Simple auth utilities for static authentication
// In a real app, this would connect to a backend service

const API_URL = config.API_URL;
const TOKEN_KEY = 'token'; // Using consistent token key

const ADMIN_USER = {
  email: "admin@example.com",
  password: "admin123", // In a real app, this would be hashed
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Verify token expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

// Login function
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token
    setToken(data.token);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

// Logout function
export const logout = () => {
  removeToken();
  // Optional: Clear other stored data
  localStorage.clear();
};

// Auth provider for protecting routes
export const requireAuth = (next) => {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }
  return next;
};

// Get auth header for API requests
export const getAuthHeader = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Function to check if token is about to expire and needs refresh
export const isTokenExpiringSoon = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if token will expire in the next 5 minutes
    return payload.exp - (Date.now() / 1000) < 300;
  } catch (error) {
    return false;
  }
};
