import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LeaveRequestPage from './pages/LeaveRequestPage';
import SwapRequestPage from './pages/SwapRequestPage';
import ProfilePage from './pages/ProfilePage'; // Import the new page

function App() {
  const location = useLocation();
  // Check if the current route is one of the authentication pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    // This is the main container for the entire app
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      {/* This main content area grows to fill the available space */}
      <main className={`flex-grow ${
        // If it's an auth page, we center the content. Otherwise, we use a standard container.
        isAuthPage ? 'flex items-center justify-center p-4' : 'container mx-auto p-4'
      }`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/request-leave" element={<LeaveRequestPage />} />
            <Route path="/propose-swap" element={<SwapRequestPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
