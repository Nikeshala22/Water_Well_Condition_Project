import express from "express";
import upload from "../middleware/upload.js";
import {
  createReport,
  getReports,
  addComment,
} from "../controllers/wellReportController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only 'field_officer' can access these routes
router.post("/", protect, authorizeRoles("field_officer"), upload.array("photos", 5), createReport);

router.get("/", protect, authorizeRoles("field_officer"), getReports);

router.post("/:id/comments", protect, authorizeRoles("field_officer"), addComment);

export default router;
