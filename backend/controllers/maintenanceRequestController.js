import * as maintenanceService from "../services/maintenanceRequestService.js";

// POST /api/maintenance
export const create = async (req, res) => {
  try {
    const request = await maintenanceService.createRequest(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/maintenance
export const getAll = async (req, res) => {
  try {
    const requests = await maintenanceService.getAllRequests(req.query);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/maintenance/:id
export const getById = async (req, res) => {
  try {
    const request = await maintenanceService.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/maintenance/:id
export const update = async (req, res) => {
  try {
    const request = await maintenanceService.updateRequest(req.params.id, req.body);
    if (!request) return res.status(404).json({ message: "Maintenance Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/maintenance/:id
export const deleteReq = async (req, res) => {
  try {
    const request = await maintenanceService.deleteRequest(req.params.id);
    if (!request) return res.status(404).json({ message: "Maintenance Request not found" });
    res.json({ message: "Maintenance Request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/maintenance/:id/assign
export const assign = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo is required" });
    }
    const request = await maintenanceService.assignRequest(req.params.id, assignedTo);
    if (!request) return res.status(404).json({ message: "Maintenance Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
