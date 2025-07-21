import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createLeave, getMyShifts } from "../api/services";
import useAuth from "../hooks/useAuth";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../calendar.css";
import { format, isSameDay, startOfToday } from "date-fns";

const LeaveRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [range, setRange] = useState(undefined);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [userShifts, setUserShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const shiftsRes = await getMyShifts();
        setUserShifts(shiftsRes.data.map((s) => new Date(s.date)));
      } catch (err) {
        console.error("Could not fetch user data", err);
        setError("Could not load your shift schedule.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!range?.from) {
      setError("Please select a valid date or date range.");
      return;
    }
    setError(null);
    try {
      const endDate = range.to || range.from;
      await createLeave({ startDate: range.from, endDate: endDate, reason });
      alert("Leave request submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    }
  };

  let footer = (
    <p className="text-sm text-slate-500">
      Please pick the first day of your leave.
    </p>
  );
  if (range?.from) {
    if (!range.to) {
      footer = (
        <p className="text-sm text-slate-500">
          Selected: {format(range.from, "PPP")}
        </p>
      );
    } else if (range.to) {
      footer = (
        <p className="text-sm text-slate-500">
          Selected: {format(range.from, "PPP")} – {format(range.to, "PPP")}
        </p>
      );
    }
  }

  // --- FINAL FIX: Use a single, robust function to determine disabled days ---
  const isDayDisabled = (day) => {
    const today = startOfToday();

    // Disable past dates
    if (day < today) return true;

    // Disable weekly off (only if defined)
    if (
      typeof user?.weeklyOffDay === "number" &&
      day.getDay() === user.weeklyOffDay
    )
      return true;

    // ⚠️ Do NOT disable days with shifts
    // If you want to *highlight* shift days instead, use `modifiers` instead of disabling

    return false; // All other days are allowed
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading your schedule...</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Request Leave
        </h2>
        <p className="text-slate-500 mb-6">
          Select a date range for your leave. Your scheduled shifts and weekly
          off days are disabled.
        </p>

        <div className="flex justify-center border-b pb-4">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            footer={footer}
            disabled={isDayDisabled} // Use the robust function here
            modifiers={{
              offDay: { dayOfWeek: [user?.weeklyOffDay] },
            }}
            modifiersClassNames={{
              offDay: "day-off",
            }}
            showOutsideDays
          />
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg my-4 text-sm">
              {error}
            </p>
          )}
          <div className="mt-4">
            <label
              className="block text-slate-700 text-sm font-semibold mb-2"
              htmlFor="reason"
            >
              Reason
            </label>
            <textarea
              id="reason"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end mt-6 space-x-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
