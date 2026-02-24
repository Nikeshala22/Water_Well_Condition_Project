import MaintenanceRequest from "../models/MaintenanceRequest.js";

export const createRequest = async (data) => {
  return await MaintenanceRequest.create(data);
};

export const getAllRequests = async (filters = {}) => {
  return await MaintenanceRequest.find(filters).populate("wellId requestedBy assignedTo");
};

export const getRequestById = async (id) => {
  return await MaintenanceRequest.findById(id).populate("wellId requestedBy assignedTo");
};

export const updateRequest = async (id, data) => {
  return await MaintenanceRequest.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRequest = async (id) => {
  return await MaintenanceRequest.findByIdAndDelete(id);
};

export const assignRequest = async (id, assignedTo) => {
  return await MaintenanceRequest.findByIdAndUpdate(
    id,
    { assignedTo, status: "InProgress" },
    { new: true }
  ).populate("wellId requestedBy assignedTo");
};
