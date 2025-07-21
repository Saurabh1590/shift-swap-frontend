import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_approval: 'bg-yellow-100 text-yellow-800',
    open: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};


const RequestCard = ({ request, currentUserId }) => {
  const isLeave = request.startDate; 
  const title = isLeave ? 'Leave Request' : 'Swap Request';
  const icon = isLeave ? '✈️' : '🔄';

  const dateInfo = isLeave 
    ? `From: ${new Date(request.startDate).toLocaleDateString()} To: ${new Date(request.endDate).toLocaleDateString()}`
    : `For Shift on ${new Date(request.offeredShiftDate).toLocaleDateString()}`;

  // Determine the swap partner
  let swapPartner = null;
  if (request.status === 'approved' && !isLeave && request.acceptedBy) {
    // If the current user created the swap, the partner is 'acceptedBy'
    if (request.user._id === currentUserId) {
      swapPartner = request.acceptedBy;
    } else { // Otherwise, the partner is the original user
      swapPartner = request.user;
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-slate-800">{icon} {title}</p>
          <p className="text-sm text-slate-500 mt-1">{dateInfo}</p>
          {swapPartner && (
            <p className="text-sm text-green-600 font-medium mt-1">
              Approved - With {swapPartner.firstName} {swapPartner.lastName}
            </p>
          )}
        </div>
        <StatusBadge status={request.status} />
      </div>
      {request.reason && (
        <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100">
          Reason: {request.reason}
        </p>
      )}
    </div>
  );
};

export default RequestCard;
