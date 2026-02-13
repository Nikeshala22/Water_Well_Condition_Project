import Well from "../models/Well.js";

// =====================
// Create Well (Admin)
// =====================
export const createWell = async (req, res) => {
  try {
    const { wellId, name, village, lat, lng, depth, type } = req.body;
    if (!wellId || !name || !village || !lat || !lng || !depth || !type)
      return res.status(400).json({ message: "All fields are required" });
    
    // Check if wellId already exists
    const existingWell = await Well.findOne({ wellId });
    if (existingWell) {
      return res.status(400).json({ message: "wellId already exists. Please use a unique wellId." });
    }
    const well = await Well.create({
      wellId,
      name,
      village,
      depth,
      type,
      location: { type: "Point", coordinates: [lng, lat] },
    });

    res.status(201).json({ success: true, message: "Well created successfully", data: well });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// Get All Wells
// =====================
export const getAllWells = async (req, res) => {
  try {
    const { village, status } = req.query;

    let query = { isArchived: false };
    if (village) query.village = village;
    if (status) query.status = status;

    const wells = await Well.find(query);
    res.status(200).json({ success: true, data: wells });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get single well by Mongo _id
export const getWellById = async (req, res) => {
  try {
    const { id } = req.params;
    const well = await Well.findById(id);
    if (!well) return res.status(404).json({ message: "Well not found" });
    res.status(200).json({ success: true, data: well });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single well by wellId (manual input)
export const getWellByWellId = async (req, res) => {
  try {
    const { wellId } = req.params;
    const well = await Well.findOne({ wellId });
    if (!well) return res.status(404).json({ message: "Well not found" });
    res.status(200).json({ success: true, data: well });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// Update Well Metadata (Admin Only)
// =====================
export const updateWell = async (req, res) => {
  try {
    const { name, village, depth, type } = req.body;

    const well = await Well.findById(req.params.id);
    if (!well) return res.status(404).json({ message: "Well not found" });

    well.name = name || well.name;
    well.village = village || well.village;
    well.depth = depth || well.depth;
    well.type = type || well.type;

    await well.save();
    res.status(200).json({ success: true, message: "Well updated", data: well });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================
// Update Well Status (Admin + Field Officer)
// =====================
export const updateWellStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const well = await Well.findById(req.params.id);
    if (!well) return res.status(404).json({ message: "Well not found" });

    if (!["Active", "Dry", "Maintenance"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    well.status = status;
    await well.save();

    res.status(200).json({ success: true, message: "Well status updated", data: well });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hard Delete Well (Admin only)
export const deleteWell = async (req, res) => {
  try {
    const well = await Well.findById(req.params.id);
    if (!well) return res.status(404).json({ message: "Well not found" });

    await well.deleteOne(); // Completely removes the document in

    res.status(200).json({
      success: true,
      message: "Well deleted permanently",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

