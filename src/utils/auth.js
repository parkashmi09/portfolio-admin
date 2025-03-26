
// Simple auth utilities for static authentication
// In a real app, this would connect to a backend service

const ADMIN_USER = {
  email: "admin@example.com",
  password: "admin123", // In a real app, this would be hashed
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem("adminAuth") === "true";
};

// Login function
export const login = (email, password) => {
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    localStorage.setItem("adminAuth", "true");
    return true;
  }
  return false;
};

// Logout function
export const logout = () => {
  localStorage.removeItem("adminAuth");
};

// Auth provider for protecting routes
export const requireAuth = (next) => {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }
  return next;
};
