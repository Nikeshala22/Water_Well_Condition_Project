import axios from "axios";

const API = "http://localhost:5000/api/water-quality";

export const getAllTests = () => axios.get(API);
export const createTest = (data) => axios.post(API, data);
export const deleteTest = (id) => axios.delete(`${API}/${id}`);
export const updateTest = (id, data) => axios.put(`${API}/${id}`, data);
export const getTestById = (id) => axios.get(`${API}/${id}`);