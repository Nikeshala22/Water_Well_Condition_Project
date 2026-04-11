import axios from "axios";

// Fallback prevents broken builds if env is missing
const API_URL = import.meta.env.VITE_API_URL || "https://water-well-condition-project.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;