import MaintenanceRequest from "../models/MaintenanceRequest.js";
import Well from "../models/Well.js";
import * as weatherService from "../services/weatherService.js";

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

export const updateStatus = async (id, status) => {
  const request = await MaintenanceRequest.findById(id);
  if (!request) return null;

  const validTransitions = {
    Pending: ["InProgress", "Completed"],
    InProgress: ["Completed", "Pending"],
    Completed: []
  };

  if (!validTransitions[request.status].includes(status)) {
    throw new Error(`Invalid status transition from ${request.status} to ${status}`);
  }

  request.status = status;
  await request.save();
  return MaintenanceRequest.findById(id).populate("wellId requestedBy assignedTo");
};

export const checkWeatherRisk = async (wellId, userId) => {
  const well = await Well.findById(wellId);
  if (!well) throw new Error("Well not found");

  const { lat, lng } = well.location;
  if (!lat || !lng) throw new Error("Well has no coordinates");

  const weatherData = await weatherService.checkRainfall(lat, lng);

  if (weatherData.heavyRainfall) {
    // Automatically create a high-priority maintenance alert
    const newRequest = await MaintenanceRequest.create({
      wellId: well._id,
      issueType: "Contamination", // Potential contamination due to heavy rain
      description: `Automated Alert: Heavy rainfall detected (${weatherData.precipitation}mm). High risk of contamination.`,
      priority: "High",
      status: "Pending",
      requestedBy: userId // Will be the admin/system user triggering the check
    });

    return {
      riskDetected: true,
      weatherData,
      requestCreated: newRequest
    };
  }

  return { riskDetected: false, weatherData };
};
