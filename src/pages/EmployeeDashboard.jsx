import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getMyShifts, getMyLeaves, getMySwaps, getAllSwaps } from '../api/services';
import DashboardSkeleton from '../components/DashboardSkeleton';
import DashboardHeader from '../components/DashboardHeader';
import RequestCard from '../components/RequestCard';
import OpenSwapCard from '../components/OpenSwapCard';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '../calendar.css';
import { SHIFT_START_HOURS } from '../utils/shiftConfig';
import { isSameDay, isWithinInterval, startOfDay } from 'date-fns';
import { isActionAllowed } from '../utils/shiftConfig';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ shifts: [], leaves: [], swaps: [], openSwaps: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState(new Date());

  // ... All the data fetching and logic functions (fetchData, useMemo, etc.) remain the same ...
  const fetchData = useCallback(async () => {
    try {
      const [shiftsRes, leavesRes, mySwapsRes, allSwapsRes] = await Promise.all([
        getMyShifts(), getMyLeaves(), getMySwaps(), getAllSwaps(),
      ]);
      const openSwaps = allSwapsRes.data.filter(s => s.status === 'open' && s.user._id !== user._id);
      setData({
        shifts: shiftsRes.data,
        leaves: leavesRes.data,
        swaps: mySwapsRes.data,
        openSwaps: openSwaps,
      });
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const { shiftModifiers, leaveDays, swappedDays } = useMemo(() => {
    const shiftModifiers = { morning: [], afternoon: [], night: [] };
    data.shifts.forEach(s => {
      const date = startOfDay(new Date(s.date));
      if (s.shiftType === 'A') shiftModifiers.morning.push(date);
      else if (s.shiftType === 'B') shiftModifiers.afternoon.push(date);
      else if (s.shiftType === 'N') shiftModifiers.night.push(date);
    });

    const approvedLeaves = data.leaves.filter(l => l.status === 'approved');
    const leaveDays = approvedLeaves.flatMap(l => {
      const dates = [];
      let currentDate = new Date(l.startDate);
      const endDate = new Date(l.endDate);
      while (currentDate <= endDate) {
        dates.push(startOfDay(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    });
    
    const approvedSwaps = data.swaps.filter(s => s.status === 'approved');
    const swappedDays = approvedSwaps.map(s => startOfDay(new Date(s.offeredShiftDate)));

    return { shiftModifiers, leaveDays, swappedDays };
  }, [data.shifts, data.leaves, data.swaps]);

  const DayContent = ({ date }) => {
    const isLeave = leaveDays.some(d => isSameDay(date, d));
    const isSwapped = swappedDays.some(d => isSameDay(date, d));
    return (
      <div className="day-content">
        {date.getDate()}
        {isLeave && <span className="day-icon">✈️</span>}
        {isSwapped && <span className="day-icon">🔄</span>}
      </div>
    );
  };

  const renderSidePanelContent = () => {
    if (!selectedDay) return <p className="text-slate-500 text-sm mt-4">Select a day from the calendar to see details.</p>;

    const selectedDate = startOfDay(selectedDay);
    const shiftOnDay = data.shifts.find(s => isSameDay(new Date(s.date), selectedDate));
    const leaveOnDay = data.leaves.find(l => l.status === 'approved' && isWithinInterval(selectedDate, { start: startOfDay(new Date(l.startDate)), end: startOfDay(new Date(l.endDate)) }));
    const swapOnDay = data.swaps.find(s => s.status === 'approved' && isSameDay(new Date(s.offeredShiftDate), selectedDate));

    if (leaveOnDay) return ( <div className="mt-4 bg-red-50 p-4 rounded-lg"><p className="font-semibold text-red-700">✈️ On Leave</p><p className="text-slate-600 text-sm">Reason: {leaveOnDay.reason}</p></div> );
    
    if (swapOnDay) {
        const swapPartner = swapOnDay.user._id === user._id ? swapOnDay.acceptedBy : swapOnDay.user;
        return (
            <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-700">🔄 Shift Swapped</p>
                <p className="text-slate-600 text-sm">With {swapPartner?.firstName} {swapPartner?.lastName}</p>
            </div>
        );
    }

    if (shiftOnDay) {
      const isSwapAllowed = isActionAllowed(shiftOnDay.date, shiftOnDay.shiftType);
      return (
        <div className="mt-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="font-semibold text-slate-700">Shift Details:</p>
            <p className="text-slate-600">Type: {shiftOnDay.shiftType} ({ {A: 'Morning', B: 'Afternoon', N: 'Night'}[shiftOnDay.shiftType] })</p>
          </div>
          <div className="mt-6">
            <p className="font-semibold text-slate-700 mb-2">Actions:</p>
            <Link to={isSwapAllowed ? "/propose-swap" : "#"} state={{ preselectedShift: shiftOnDay }} className={`w-full text-center block px-5 py-2.5 font-semibold rounded-lg transition ${isSwapAllowed ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} aria-disabled={!isSwapAllowed} onClick={(e) => !isSwapAllowed && e.preventDefault()}>Propose a Swap</Link>
            {!isSwapAllowed && <p className="text-xs text-slate-500 mt-2">Note: Swaps must be proposed at least 8 hours before the shift starts.</p>}
          </div>
        </div>
      );
    }

    return <p className="text-slate-500 text-sm mt-4">No events scheduled for this day.</p>;
  };
  
  const TabButton = ({ tabName, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <DashboardHeader name={user?.firstName} />
      <div className="flex space-x-2 mb-6 border-b border-slate-200">
        <TabButton tabName="schedule">My Schedule</TabButton>
        <TabButton tabName="requests">My Requests</TabButton>
        <TabButton tabName="openSwaps">Open Swaps</TabButton>
      </div>
      <div>
        {activeTab === 'schedule' && (
          // --- LAYOUT CHANGE HERE ---
          // Use a flexbox layout to make the components fill the space
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Calendar takes up more space on larger screens */}
            <div className="flex-grow lg:flex-grow-0 lg:w-2/3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                modifiers={{ ...shiftModifiers, onLeave: leaveDays, swapped: swappedDays }}
                modifiersClassNames={{ morning: 'day-morning', afternoon: 'day-afternoon', night: 'day-night', onLeave: 'day-onLeave', swapped: 'day-swapped' }}
                components={{ DayContent }}
                showOutsideDays
                fixedWeeks
              />
              <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-xs mt-2 text-slate-600">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-100 mr-2"></span>Morning</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-sky-100 mr-2"></span>Afternoon</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-100 mr-2"></span>Night</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-100 mr-2"></span>On Leave</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-100 mr-2"></span>Swapped</div>
              </div>
            </div>
            {/* Side panel takes up the remaining space */}
            <div className="flex-grow bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800">{selectedDay ? selectedDay.toLocaleDateString('en-US', {dateStyle: 'full'}) : "Select a day"}</h3>
              {renderSidePanelContent()}
            </div>
          </div>
        )}
        {activeTab === 'requests' && (
          <div className="space-y-4">{data.swaps.length > 0 || data.leaves.length > 0 ? [...data.swaps, ...data.leaves].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((req) => <RequestCard key={req._id} request={req} currentUserId={user._id} />) : <p className="text-slate-500">You have no requests.</p>}</div>
        )}
        {activeTab === 'openSwaps' && (
          <div className="space-y-4">{data.openSwaps.length > 0 ? data.openSwaps.map((swap) => <OpenSwapCard key={swap._id} swap={swap} onSwapAccepted={fetchData} currentUserShifts={data.shifts} />) : <p className="text-slate-500">No open swaps.</p>}</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;