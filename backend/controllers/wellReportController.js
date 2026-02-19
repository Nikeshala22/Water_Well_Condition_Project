import Report from "../models/reportModel.js";
import Well from "../models/Well.js";
import fs from "fs";
import path from "path";

export const createReport = async (req, res) => {
  try {
    const { wellId, waterLevel, pumpStatus, severity, description } = req.body;

    // Check if Well exists
    const well = await Well.findOne({ wellId });
    if (!well) return res.status(404).json({ message: "Well not found" });

    const photoFile = req.file ? [req.file.filename] : [];

    const report = await Report.create({
      wellId,             
      waterLevel,
      pumpStatus,
      severity,
      description,
      photos: photoFile,
      reportedBy: req.user.id,
    });

    const reportObj = report.toObject();

reportObj.photos = report.photos.map(photo =>
  `${req.protocol}://${req.get("host")}/uploads/${photo}`
);

res.status(201).json(reportObj);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .select("wellId waterLevel pumpStatus severity description photos status reportedBy comments createdAt")
      .populate("reportedBy", "username")
      .populate("comments.commentedBy", "username")
      .sort({ createdAt: -1 });

    const cleanedReports = reports.map(report => {
      return {
        _id: report._id,
        wellId: typeof report.wellId === "object"
          ? report.wellId.wellId   // if populated object
          : report.wellId,         // if string

        waterLevel: report.waterLevel,
        pumpStatus: report.pumpStatus,
        severity: report.severity,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,

        photos: report.photos.map(photo =>
          `${req.protocol}://${req.get("host")}/uploads/${photo}`
        ),

        reportedBy: report.reportedBy,

        comments: report.comments.map(comment => ({
          _id: comment._id,
          message: comment.message,
          commentedBy: comment.commentedBy,
          commentedAt: comment.commentedAt
        }))
      };
    });

    res.status(200).json(cleanedReports);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET REPORTS FOR A SPECIFIC WELL
export const getReportsByWell = async (req, res) => {
  try {
    const { wellId } = req.params;

    const reports = await Report.find({ wellId })
      .populate("reportedBy", "username")
      .populate("comments.commentedBy", "username")
      .sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        message: "No reports found for this well",
      });
    }

    // Convert photo filenames to full URLs
    const updatedReports = reports.map(report => {
      const reportObj = report.toObject();

      reportObj.photos = report.photos.map(photo =>
        `${req.protocol}://${req.get("host")}/uploads/${photo}`
      );

      return reportObj;
    });

    res.status(200).json(updatedReports);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE REPORT BY ID
export const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reportedBy", "username")
      .populate("comments.commentedBy", "username");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const reportObj = report.toObject();

    reportObj.photos = report.photos.map(photo =>
  `${req.protocol}://${req.get("host")}/uploads/${photo}`
);

res.status(200).json(reportObj);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE REPORT
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      waterLevel,
      pumpStatus,
      severity,
      description,
      status,
    } = req.body;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update fields if provided
    if (waterLevel) report.waterLevel = waterLevel;
    if (pumpStatus) report.pumpStatus = pumpStatus;
    if (severity) report.severity = severity;
    if (description) report.description = description;
    if (status) report.status = status;

   if (req.file) {
   report.photos = [req.file.filename];
}

    await report.save();

const updatedReport = report.toObject();

// Convert filenames to full URLs
updatedReport.photos = report.photos.map(photo =>
  `${req.protocol}://${req.get("host")}/uploads/${photo}`
);

res.status(200).json({
  message: "Report updated successfully",
  report: updatedReport,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE REPORT BY ID
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Optional: Delete images from server
    if (report.photos && report.photos.length > 0) {
      report.photos.forEach(photo => {
        const filePath = path.join("uploads", photo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete the report from database
    await report.deleteOne();

    res.status(200).json({ message: "Report deleted successfully" });
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
// UPDATE COMMENT
export const updateComment = async (req, res) => {
  try {
    const { reportId, commentId } = req.params;
    const { message } = req.body;

    // Find the report
    const report = await Report.findById(reportId).populate(
      "comments.commentedBy",
      "username"
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Find the comment
    const comment = report.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the logged-in user is the author
    if (comment.commentedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own comments" });
    }

    // Update the message
    comment.message = message;
    await report.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { reportId, commentId } = req.params;

    // Find the report
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Find the comment index
    const comment = report.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if logged-in user is the author or admin
    if (comment.commentedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    // Remove the comment using pull
    report.comments.pull({ _id: commentId });

    await report.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
