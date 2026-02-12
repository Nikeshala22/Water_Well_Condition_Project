import express from "express";
import { createWell } from "../controllers/wellsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/wells
// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createWell
);

export default router;
