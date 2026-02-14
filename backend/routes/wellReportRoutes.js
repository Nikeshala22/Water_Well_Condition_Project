import express from "express";
import upload from "../middleware/upload.js";
import {
  createReport,
  getReports,
  addComment, 
} from "../controllers/wellReportController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ======= FIELD OFFICER MIDDLEWARE =======
const fieldOfficerOnly = (req, res, next) => {
  if (req.user && req.user.role === "field_officer") {
    next();
  } else {
    res.status(403).json({ message: "Access restricted to field officers only" });
  }
};

// Routes protected for field officers only
router.post("/", protect, fieldOfficerOnly, upload.array("photos", 5), createReport);

router.get("/", protect, fieldOfficerOnly, getReports);

router.post("/:id/comments", protect, fieldOfficerOnly, addComment);


export default router;
