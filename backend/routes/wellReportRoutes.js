import express from "express";
<<<<<<< HEAD
import { body, param } from "express-validator";
import { validationResult } from "express-validator";
=======
import { body, param, validationResult } from "express-validator";
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
import upload from "../middleware/upload.js";
import {
  createReport,
  getReports,
  addComment,
<<<<<<< HEAD
  getAllComments,      
=======
  getAllComments,
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  getWellComments,
  updateComment,
  deleteComment,
  getReportsByWell,
  getSingleReport,
  updateReport,
<<<<<<< HEAD
  deleteReport        
} from "../controllers/wellReportController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
=======
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
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  }
  next();
};

<<<<<<< HEAD

// FIELD OFFICER MIDDLEWARE
const fieldOfficerOnly = (req, res, next) => {
  if (req.user && req.user.role === "field_officer") {
    next();
  } else {
    res.status(403).json({ message: "Access restricted to field officers only" });
  }
};

// Routes protected for field officers only
router.post(
  "/",
  protect,
  fieldOfficerOnly,
  upload.single("photo"),

  // Validation rules
  body("wellId").notEmpty().withMessage("Well ID is required"),
  body("waterLevel")
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid water level"),
  body("pumpStatus")
    .isIn(["Working", "Damaged", "Missing"])
    .withMessage("Invalid pump status"),
  body("severity")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid severity"),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

=======
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
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  validate,
  createReport
);

<<<<<<< HEAD

router.get("/", protect, fieldOfficerOnly, getReports);

router.get("/well/:wellId", protect, fieldOfficerOnly, getReportsByWell);

// Update report
router.put(
  "/:id",
  protect,
  fieldOfficerOnly,
  upload.single("photo"),

  param("id").isMongoId().withMessage("Invalid report ID"),
  body("waterLevel")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Invalid water level"),
  body("pumpStatus")
    .optional()
    .isIn(["Working", "Damaged", "Missing"])
    .withMessage("Invalid pump status"),
  body("severity")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid severity"),
  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

=======
router.put(
  "/:id",
  protect,
  authorizeRoles("field_officer"), 
  upload.single("photo"),
  param("id").isMongoId().withMessage("Invalid report ID"),
  body("description").optional().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  validate,
  updateReport
);

<<<<<<< HEAD

//Delete report
router.delete("/:id", protect, fieldOfficerOnly, deleteReport);

//Add comment
router.post(
  "/:id/comments",
  protect,
  fieldOfficerOnly,

  param("id").isMongoId().withMessage("Invalid report ID"),
  body("message")
    .isLength({ min: 3 })
    .withMessage("Comment must be at least 3 characters"),

=======
router.delete("/:id", protect, authorizeRoles("field_officer"), deleteReport);

// --- COMMENT ACTIONS ---
router.post(
  "/:id/comments",
  protect,
  authorizeRoles("field_officer"), 
  param("id").isMongoId().withMessage("Invalid report ID"),
  body("message").isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  validate,
  addComment
);

<<<<<<< HEAD

// Display all comments
router.get("/comments/all", protect, fieldOfficerOnly, getAllComments);

// Display comments for a specific well
router.get("/comments/well/:wellId", protect, fieldOfficerOnly, getWellComments);

// Update a comment
router.put(
  "/:reportId/comments/:commentId",
  protect,
  fieldOfficerOnly,

  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  body("message")
    .isLength({ min: 3 })
    .withMessage("Comment must be at least 3 characters"),

=======
router.put(
  "/:reportId/comments/:commentId",
  protect,
  authorizeRoles("field_officer"), 
  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  body("message").isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  validate,
  updateComment
);

<<<<<<< HEAD

// Delete a comment
router.delete(
  "/:reportId/comments/:commentId",
  protect,
  fieldOfficerOnly,

  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),

=======
router.delete(
  "/:reportId/comments/:commentId",
  protect,
  authorizeRoles("admin", "field_officer"), // Allow Admin to moderate/delete comments if needed
  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
  validate,
  deleteComment
);

<<<<<<< HEAD

router.get("/:id", protect, fieldOfficerOnly, getSingleReport);





export default router;
=======
export default router;
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
