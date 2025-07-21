import React, { useState } from 'react';
import { acceptSwap } from '../api/services';

const OpenSwapCard = ({ swap, onSwapAccepted, currentUserShifts }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Maps for converting shift codes to full names for display
  const shiftFullNameMap = { A: 'Morning', B: 'Afternoon', N: 'Night' };
  const offeredShift = shiftFullNameMap[swap.offeredShiftType];
  const desiredShift = shiftFullNameMap[swap.desiredShiftType];

  // Find the current user's status on the day of the offered swap
  const offeredDate = new Date(swap.offeredShiftDate);
  const currentUserShiftOnDay = currentUserShifts.find(shift => {
    const shiftDate = new Date(shift.date);
    return (
      shiftDate.getFullYear() === offeredDate.getFullYear() &&
      shiftDate.getMonth() === offeredDate.getMonth() &&
      shiftDate.getDate() === offeredDate.getDate()
    );
  });

  let userStatus;
  if (currentUserShiftOnDay) {
    const shiftName = shiftFullNameMap[currentUserShiftOnDay.shiftType];
    userStatus = `You have the ${shiftName} shift`;
  } else {
    userStatus = "You have a Rest Day";
  }

  const handleAccept = async () => {
    if (!window.confirm('Are you sure you want to accept this shift trade? This will be sent for admin approval.')) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await acceptSwap(swap._id);
      alert('Swap accepted! Awaiting final approval from your admin.');
      if (onSwapAccepted) {
        onSwapAccepted();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept swap. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <p className="font-semibold text-slate-800">
            {swap.user.firstName} {swap.user.lastName}
          </p>
          <div className="flex items-center space-x-2 mt-2 text-slate-600">
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <p className="text-xs font-bold text-red-500">OFFERING</p>
              <p className="font-semibold">{offeredShift} Shift</p>
            </div>
            <span className="text-xl font-light text-slate-400">🔄</span>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-xs font-bold text-green-600">WANTS</p>
              <p className="font-semibold">{desiredShift} Shift</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            on {new Date(swap.offeredShiftDate).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleAccept}
          disabled={isSubmitting}
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Accepting...' : 'Accept Offer'}
        </button>
      </div>
      
      {swap.reason && (
        <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100">
          Reason: {swap.reason}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 text-sm bg-slate-50 p-3 rounded-lg">
        <p>
          <span className="font-semibold">Your Status on this Day:</span>
          <span className={`ml-2 font-medium ${currentUserShiftOnDay ? 'text-orange-600' : 'text-green-600'}`}>
            {userStatus}
          </span>
        </p>
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default OpenSwapCard;