import Well from "../models/Well.js";

export const createWell = async (req, res) => {
  try {
    const { name, village, lat, lng, depth, type } = req.body;

    // Basic validation
    if (!name || !village || !lat || !lng || !depth || !type) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newWell = await Well.create({
      name,
      village,
      depth,
      type,
      location: {
        type: "Point",
        coordinates: [lng, lat], // IMPORTANT: [longitude, latitude]
      },
    });

    res.status(201).json({
      success: true,
      message: "Well created successfully",
      data: newWell,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
