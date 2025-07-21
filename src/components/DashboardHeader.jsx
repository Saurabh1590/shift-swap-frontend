import React from "react";
import { Link } from "react-router-dom"; // Import Link

const DashboardHeader = ({ name }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-slate-800">
        Welcome back, {name}!
      </h1>
      <p className="text-slate-500 mt-2">
        Here's what's happening with your schedule and requests.
      </p>
      <div className="mt-6 flex space-x-3">
        {/* Wrap the button in a Link component */}
        <Link
          to="/request-leave"
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Request Leave
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
