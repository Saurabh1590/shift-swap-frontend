import React from 'react';

const ShiftCard = ({ shift }) => {
  // --- New: Map for shift codes ---
  const shiftTypeMap = {
    A: 'Morning',
    B: 'Afternoon',
    N: 'Night',
  };

  const shiftFullName = shiftTypeMap[shift.shiftType] || 'Unknown Shift';
  const date = new Date(shift.date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 transition hover:shadow-md hover:border-blue-300">
      <div className={`text-3xl ${shift.shiftType === 'N' ? 'text-indigo-500' : 'text-amber-500'}`}>
        {/* The icon logic remains the same */}
        {shift.shiftType === 'N' ? '🌙' : '☀️'}
      </div>
      <div className="flex-grow">
        {/* --- Updated: Display the full shift name as the title --- */}
        <p className="font-bold text-slate-800">{shiftFullName} Shift</p>
        <p className="text-sm text-slate-500">{formattedDate}</p>
      </div>
      
    </div>
  );
};

export default ShiftCard;