import express from "express";
import { body, param, validationResult } from "express-validator";
import upload from "../middleware/upload.js";
import {
  createReport,
  getReports,
  addComment,
  getAllComments,
  getWellComments,
  updateComment,
  deleteComment,
  getReportsByWell,
  getSingleReport,
  updateReport,
  deleteReport
} from "../controllers/wellReportController.js";

// Import your flexible middleware
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 2. ROUTES

// --- GET ROUTES (Both Admin & Field Officer can view) ---
// We use authorizeRoles("admin", "field_officer") to allow both.
router.get("/", protect, authorizeRoles("admin", "field_officer"), getReports);
router.get("/well/:wellId", protect, authorizeRoles("admin", "field_officer"), getReportsByWell);
router.get("/comments/all", protect, authorizeRoles("admin", "field_officer"), getAllComments);
router.get("/comments/well/:wellId", protect, authorizeRoles("admin", "field_officer"), getWellComments);
router.get("/:id", protect, authorizeRoles("admin", "field_officer"), getSingleReport);

// --- POST/PUT/DELETE ROUTES (Only Field Officers can modify) ---
router.post(
  "/",
  protect,
  authorizeRoles("field_officer"), // Strictly for field officers
  upload.single("photo"),
  body("wellId").notEmpty().withMessage("Well ID is required"),
  body("waterLevel").isIn(["High", "Medium", "Low"]).withMessage("Invalid water level"),
  body("pumpStatus").isIn(["Working", "Damaged", "Missing"]).withMessage("Invalid pump status"),
  body("description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  validate,
  createReport
);

router.put(
  "/:id",
  protect,
  authorizeRoles("field_officer"), 
  upload.single("photo"),
  param("id").isMongoId().withMessage("Invalid report ID"),
  body("description").optional().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  validate,
  updateReport
);

router.delete("/:id", protect, authorizeRoles("field_officer"), deleteReport);

// --- COMMENT ACTIONS ---
router.post(
  "/:id/comments",
  protect,
  authorizeRoles("field_officer"), 
  param("id").isMongoId().withMessage("Invalid report ID"),
  body("message").isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
  validate,
  addComment
);

router.put(
  "/:reportId/comments/:commentId",
  protect,
  authorizeRoles("field_officer"), 
  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  body("message").isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
  validate,
  updateComment
);

router.delete(
  "/:reportId/comments/:commentId",
  protect,
  authorizeRoles("admin", "field_officer"), // Allow Admin to moderate/delete comments if needed
  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  validate,
  deleteComment
);

export default router;