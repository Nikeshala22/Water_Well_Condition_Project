import api from "../api/axios";

// Get all tests
export const getAllTests = () => api.get("/water-quality");

// Create new test
export const createTest = (data) => api.post("/water-quality", data);

// Get test by ID
export const getTestById = (id) => api.get(`/water-quality/${id}`);

// Update test
export const updateTest = (id, data) =>
  api.put(`/water-quality/${id}`, data);

// Delete test
export const deleteTest = (id) =>
  api.delete(`/water-quality/${id}`);