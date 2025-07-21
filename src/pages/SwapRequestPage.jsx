import React, { useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { createSwap } from '../api/services';
import { isActionAllowed } from '../utils/shiftConfig'; // Helper function for the 8-hour rule

const SwapRequestPage = () => {
  const location = useLocation();
  // Get the shift data passed from the dashboard calendar
  const preselectedShift = location.state?.preselectedShift;

  const [desiredShiftType, setDesiredShiftType] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useMemo is a React hook that optimizes performance.
  // This calculation only re-runs if the preselectedShift changes.
  const availableOptions = useMemo(() => {
    if (!preselectedShift) return [];
    
    // Filter the list of all possible shift types ("A", "B", "N")
    return ["A", "B", "N"].filter(type => {
      // Rule 1: Don't show the user's own shift type as an option to trade for.
      if (type === preselectedShift.shiftType) return false;
      
      // Rule 2: Check if the desired shift is also at least 8 hours in the future.
      // This prevents requesting a shift that has already passed for the day.
      return isActionAllowed(preselectedShift.date, type);
    });
  }, [preselectedShift]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!desiredShiftType) {
        setError("Please select the shift type you'd like in return.");
        return;
    }
    try {
      const swapData = {
        offeredShiftDate: preselectedShift.date,
        offeredShiftType: preselectedShift.shiftType,
        desiredShiftType: desiredShiftType,
        reason: reason,
      };
      await createSwap(swapData);
      alert('Swap request submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit swap request.');
    }
  };

  // If a user navigates to this page directly without selecting a shift,
  // show a helpful message and a link back to the dashboard.
  if (!preselectedShift) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">No shift selected.</h2>
        <p className="mt-2 text-slate-600">Please go back to your dashboard and select a shift from the calendar to propose a swap.</p>
        <Link to="/dashboard" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Propose a Shift Trade</h2>
        <p className="text-slate-500 mb-6">Confirm your shift and choose which one you'd like in return.</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-slate-700">You are offering:</p>
              <p className="text-slate-600 text-lg font-bold">
                  Shift {preselectedShift.shiftType} on {new Date(preselectedShift.date).toLocaleDateString()}
              </p>
          </div>

          <div className="mb-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="desiredShift">
              In exchange for:
            </label>
            <select
              id="desiredShift"
              className="w-full px-4 py-2.5 border rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={desiredShiftType}
              onChange={(e) => setDesiredShiftType(e.target.value)}
              required
            >
              <option value="" disabled>-- Select a valid shift type --</option>
              {availableOptions.length > 0 ? (
                availableOptions.map(type => (
                  <option key={type} value={type}>
                    Shift {type} ({ {A: 'Morning', B: 'Afternoon', N: 'Night'}[type] })
                  </option>
                ))
              ) : (
                <option disabled>No valid shifts available for trade at this time.</option>
              )}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="reason">
              Reason for trade
            </label>
            <textarea
              id="reason"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-end mt-6 space-x-3">
             <Link to="/dashboard" className="px-5 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition">
                Cancel
             </Link>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              disabled={availableOptions.length === 0}
            >
              Confirm & Submit Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestPage;