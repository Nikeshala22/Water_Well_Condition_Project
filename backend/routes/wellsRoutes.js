import express from "express";
import {
  createWell,
  getAllWells,
  getWellById,
  updateWell,
  updateWellStatus,
  deleteWell,
} from "../controllers/wellsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create well (Admin only)
router.post("/", protect, authorizeRoles("admin"), createWell);

// Get all wells (Admin, Field Officer, Visitor)
router.get("/", protect, authorizeRoles("admin", "field_officer", "visitor"), getAllWells);

// Get single well
router.get("/:id", protect, authorizeRoles("admin", "field_officer", "visitor"), getWellById);

// Update metadata (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), updateWell);

// Update status (Admin + Field Officer)
router.patch("/:id/status", protect, authorizeRoles("admin", "field_officer"), updateWellStatus);

// Hard Delete (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteWell);



export default router;
