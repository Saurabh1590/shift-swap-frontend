import React, { useState, useEffect, useCallback } from 'react';
import { getAdminSummary, adminGetAllLeaves, adminGetAllSwaps, adminGetAllUsers, updateLeaveStatus, updateSwapStatus } from '../api/services';
import Card from '../components/Card';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingSwaps, setPendingSwaps] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // We don't reset loading here for silent refreshes
      const [summaryRes, leavesRes, swapsRes, usersRes] = await Promise.all([
        getAdminSummary(),
        adminGetAllLeaves(),
        adminGetAllSwaps(),
        adminGetAllUsers(),
      ]);
      setSummary(summaryRes.data);
      setPendingLeaves(leavesRes.data.filter(l => l.status === 'pending'));
      setPendingSwaps(swapsRes.data.filter(s => s.status === 'pending_approval'));
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setError("Could not load administrator data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleLeaveAction = async (leaveId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this leave request?`)) return;
    try {
      await updateLeaveStatus(leaveId, status);
      fetchData(); // Refresh data
    } catch (err) {
      alert(`Failed to ${status} leave request.`);
    }
  };

  const handleSwapAction = async (swapId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this swap?`)) return;
    try {
      await updateSwapStatus(swapId, status);
      fetchData(); // Refresh data
    } catch (err) {
      alert(`Failed to ${status} swap request.`);
    }
  };
  
  const TabButton = ({ tabName, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
    >
      {children}
    </button>
  );

  if (loading) return <div className="text-center mt-10">Loading Admin Dashboard...</div>;
  if (error) return <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Pending Leaves">{summary?.pendingLeaves ?? '...'}</Card>
        <Card title="Swaps Pending Approval">{pendingSwaps.length ?? '...'}</Card>
        <Card title="Total Users">{summary?.totalUsers ?? '...'}</Card>
      </div>

      <div className="flex space-x-2 mb-6 border-b border-slate-200">
        <TabButton tabName="requests">Manage Requests</TabButton>
        <TabButton tabName="users">User Management</TabButton>
      </div>

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Pending Leave Requests">
            {pendingLeaves.length > 0 ? pendingLeaves.map(leave => (
              <div key={leave._id} className="p-3 bg-slate-50 rounded-lg mb-3 border">
                <p><strong>Employee:</strong> {leave.user.firstName} {leave.user.lastName}</p>
                <p className="text-sm"><strong>Dates:</strong> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                <p className="text-sm"><strong>Reason:</strong> {leave.reason}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => handleLeaveAction(leave._id, 'approved')} className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                  <button onClick={() => handleLeaveAction(leave._id, 'rejected')} className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                </div>
              </div>
            )) : <p className="text-slate-500">No pending leave requests.</p>}
          </Card>

          <Card title="Pending Swap Approvals">
            {pendingSwaps.length > 0 ? pendingSwaps.map(swap => (
              <div key={swap._id} className="p-3 bg-slate-50 rounded-lg mb-3 border">
                <p><strong>Original Poster:</strong> {swap.user.firstName} {swap.user.lastName}</p>
                <p><strong>Accepted By:</strong> {swap.acceptedBy?.firstName} {swap.acceptedBy?.lastName}</p>
                <p className="text-sm"><strong>Shift:</strong> {new Date(swap.offeredShiftDate).toLocaleDateString()} (Type: {swap.offeredShiftType})</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => handleSwapAction(swap._id, 'approved')} className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                  <button onClick={() => handleSwapAction(swap._id, 'rejected')} className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                </div>
              </div>
            )) : <p className="text-slate-500">No swaps are pending approval.</p>}
          </Card>
        </div>
      )}
      
      {activeTab === 'users' && (
        <Card title="All Users">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                  <th className="py-2 px-4 text-left text-xs font-semibold text-slate-600 uppercase">Weekly Off Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allUsers.map(user => (
                  <tr key={user._id}>
                    <td className="py-3 px-4 text-sm text-slate-700">{user.firstName} {user.lastName}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-slate-700 capitalize">{user.role}</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][user.weeklyOffDay] ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
