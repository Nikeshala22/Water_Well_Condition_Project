import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Get token
const getToken = () => {
  return localStorage.getItem("token");
};

// Get all reports
export const getReports = async () => {
  const response = await axios.get(`${BASE_URL}/api/reports`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};