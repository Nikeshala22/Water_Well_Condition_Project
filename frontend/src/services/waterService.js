import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Water Quality endpoints
const API = `${BASE_URL}/api/water-quality`;

// Get all tests
export const getAllTests = () => axios.get(API);

// Create new test
export const createTest = (data) => axios.post(API, data);

// Get test by ID
export const getTestById = (id) => axios.get(`${API}/${id}`);

// Update test
export const updateTest = (id, data) =>
  axios.put(`${API}/${id}`, data);

// Delete test
export const deleteTest = (id) =>
  axios.delete(`${API}/${id}`);