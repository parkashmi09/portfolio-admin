
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("You need to log in to access this page");
    }
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
