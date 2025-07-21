import api from './axios';

// --- USER SERVICES ---
export const getMyShifts = () => api.get('/shift/my');
export const getMyLeaves = () => api.get('/leave/my');
export const createLeave = (leaveData) => api.post('/leave', leaveData);
export const getMySwaps = () => api.get('/swap/my');
export const createSwap = (swapData) => api.post('/swap', swapData);
export const getAllSwaps = () => api.get('/swap/all');

// --- THIS IS THE MISSING FUNCTION ---
export const acceptSwap = (swapId) => api.post(`/swap/${swapId}/accept`);


// --- ADMIN SERVICES ---
export const getAdminSummary = () => api.get('/admin/summary');
export const adminGetAllLeaves = () => api.get('/leave/all');
export const adminGetAllSwaps = () => api.get('/swap/all');
export const adminGetAllUsers = () => api.get('/admin/users');
export const updateLeaveStatus = (leaveId, status) => api.put(`/leave/${leaveId}/${status}`);
export const updateSwapStatus = (swapId, status) => api.put(`/swap/${swapId}/status`, { status });