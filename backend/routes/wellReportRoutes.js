import express from "express";
import { body, param } from "express-validator";
import { validationResult } from "express-validator";
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

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};


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

  validate,
  createReport
);


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

  validate,
  updateReport
);


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

  validate,
  addComment
);


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

  validate,
  updateComment
);


// Delete a comment
router.delete(
  "/:reportId/comments/:commentId",
  protect,
  fieldOfficerOnly,

  param("reportId").isMongoId().withMessage("Invalid report ID"),
  param("commentId").isMongoId().withMessage("Invalid comment ID"),

  validate,
  deleteComment
);


router.get("/:id", protect, fieldOfficerOnly, getSingleReport);





export default router;
