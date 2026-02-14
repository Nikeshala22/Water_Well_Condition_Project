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

// GET ALL COMMENTS (from all reports)
export const getAllComments = async (req, res) => {
  try {
    // Get all reports and their comments
    const reports = await Report.find()
      .populate("comments.commentedBy", "username")
      .sort({ createdAt: -1 });

    // Flatten all comments into a single array
    const allComments = reports.flatMap(report =>
      report.comments.map(comment => ({
        commentId: comment._id, 
        reportId: report._id,
        wellId: report.wellId,
        message: comment.message,
        commentedBy: comment.commentedBy.username,
        commentedAt: comment.commentedAt,
      }))
    );

    res.status(200).json(allComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS FOR A SPECIFIC WELL
export const getWellComments = async (req, res) => {
  try {
    const { wellId } = req.params;

    const reports = await Report.find({ wellId })
      .populate("comments.commentedBy", "username")
      .sort({ createdAt: -1 });

    if (!reports.length) {
      return res.status(404).json({ message: "No reports/comments found for this well" });
    }

    // Flatten comments for this well
    const wellComments = reports.flatMap(report =>
      report.comments.map(comment => ({
        commentId: comment._id, 
        reportId: report._id,
        message: comment.message,
        commentedBy: comment.commentedBy.username,
        commentedAt: comment.commentedAt,
      }))
    );

    res.status(200).json(wellComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
