import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// A small, reusable component for the feature cards on this page
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 transform hover:-translate-y-2 transition-transform duration-300">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="text-center py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          <span className="block">Effortless Shift Management</span>
          <span className="block text-blue-600 mt-2">for Your Entire Team</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
          Simplify your scheduling with automated rotations, easy shift trading, and seamless leave requests. Focus on your work, not the schedule.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose ShiftSwap?</h2>
            <p className="text-slate-500 mt-2">Everything you need in one modern platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🗓️"
              title="Automated Scheduling"
              description="New employees are automatically assigned a fair, rotating schedule based on your company's A-N-B cycle and weekly days off."
            />
            <FeatureCard
              icon="🔄"
              title="Intelligent Shift Trading"
              description="Propose a trade or request a cover. Our system handles the logic for both scenarios, sending requests for admin approval."
            />
            <FeatureCard
              icon="✈️"
              title="Streamlined Leave Requests"
              description="Submit leave requests through a simple form. Admins can approve or reject them with a single click from their dashboard."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;