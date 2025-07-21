import React from 'react';
import useAuth from '../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the correct dashboard based on the user's role
  return user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default DashboardPage;