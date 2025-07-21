import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while checking auth status
    return <div>Loading...</div>;
  }

  // If there is a user, render the child route (e.g., Dashboard).
  // Otherwise, navigate them to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;