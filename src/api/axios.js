import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,  // MUST to send cookies on Render
});

export default api;
