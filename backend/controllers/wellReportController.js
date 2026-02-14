import Report from "../models/reportModel.js";


// CREATE REPORT
export const createReport = async (req, res) => {
  try {
    const { wellId, waterLevel, pumpStatus, severity, description } =
      req.body;

    const photoFiles = req.files
      ? req.files.map((file) => file.filename)
      : [];

    const report = await Report.create({
      wellId,
      waterLevel,
      pumpStatus,
      severity,
      description,
      photos: photoFiles,
      reportedBy: req.user.id,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL REPORTS
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "username")
      .populate("comments.commentedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { message } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.comments.push({
      message,
      commentedBy: req.user.id,
    });

    await report.save();

    res.status(201).json({
      message: "Comment added successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

