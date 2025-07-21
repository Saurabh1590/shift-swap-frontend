// Defines the start hour for each shift type (24-hour format)
export const SHIFT_START_HOURS = {
  A: 6,  // 6:00 AM
  B: 14, // 2:00 PM
  N: 22, // 10:00 PM
};

const SWAP_TIME_LIMIT_HOURS = 8;

/**
 * Checks if an action is allowed based on the shift time and the time limit.
 * This is a client-side function.
 * @param {Date | string} shiftDate - The date of the shift.
 * @param {string} shiftType - The type of shift ('A', 'B', or 'N').
 * @returns {boolean} - True if the action is allowed, false otherwise.
 */
export const isActionAllowed = (shiftDate, shiftType) => {
  const shiftStartHour = SHIFT_START_HOURS[shiftType];
  if (shiftStartHour === undefined) return false;

  const shiftStartTime = new Date(shiftDate);
  // Use setHours on the client to respect the user's local timezone
  shiftStartTime.setHours(shiftStartHour, 0, 0, 0); 

  const timeLimitMilliseconds = SWAP_TIME_LIMIT_HOURS * 60 * 60 * 1000;
  const deadline = shiftStartTime.getTime() - timeLimitMilliseconds;

  return Date.now() < deadline;
};
