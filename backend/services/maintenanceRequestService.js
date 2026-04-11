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

  const [lng, lat] = well.location.coordinates;
  console.log(`Checking Weather Risk for Well ${wellId} at [${lat}, ${lng}]`);
  if (lat === undefined || lng === undefined) throw new Error("Well has no coordinates");

  const weatherData = await weatherService.checkRainfall(lat, lng);

  // Format the output specifically for the WeatherRiskCard component
  const formatWeatherOutput = (createdReq = null) => {
    return {
      riskDetected: weatherData.heavyRainfall,
      weather: {
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m
      },
      riskLevel: weatherData.heavyRainfall ? "High" : weatherData.precipitation > 5 ? "Medium" : "Low",
      recommendation: weatherData.heavyRainfall 
        ? "Immediate inspection required. Critical rainfall detected exceeding safe volume thresholds." 
        : weatherData.precipitation > 5 
          ? "Monitor well and surrounding drainage. Intermediate runoff poses a moderate threat." 
          : "Conditions are currently safe and optimal for standard operations.",
      precipitation: weatherData.precipitation,
      requestCreated: createdReq
    };
  };

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

    return formatWeatherOutput(newRequest);
  }

  return formatWeatherOutput(null);
};
