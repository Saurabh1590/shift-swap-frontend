import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://shift-swap-backend.onrender.com/api' // <-- Paste your Render backend URL here
  : 'http://localhost:5000/api';
  

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default api;