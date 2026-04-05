import express from "express";
import {
  createWell,
  getAllWells,
  getWellById,
  getWellByWellId,
  updateWell,
  updateWellStatus,
  deleteWell,
} from "../controllers/wellsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create well (Admin only)
router.post("/", protect, authorizeRoles("admin"), createWell);

<<<<<<< HEAD
// Get all wells (Admin, Field Officer, Visitor)
router.get("/", protect, authorizeRoles("admin", "field_officer", "visitor"), getAllWells);

// Get single well by Mongodb _id
router.get("/id/:id", protect, authorizeRoles("admin", "field_officer", "visitor"), getWellById);

// Get Single Well by input wellId
router.get("/wellId/:wellId", protect, authorizeRoles("admin", "field_officer", "visitor"), getWellByWellId);
=======
// Get all wells (Admin, Field Officer, Lab Tester, Customer)
router.get("/", protect, authorizeRoles("admin", "field_officer", "lab_tester", "customer"), getAllWells);

// Get single well by Mongodb _id
router.get("/id/:id", protect, authorizeRoles("admin", "field_officer", "lab_tester", "customer"), getWellById);

// Get Single Well by input wellId
router.get("/wellId/:wellId", protect, authorizeRoles("admin", "field_officer", "lab_tester", "customer"), getWellByWellId);
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)

// Update metadata (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), updateWell);

// Update status (Admin + Field Officer)
router.patch("/:id/status", protect, authorizeRoles("admin", "field_officer"), updateWellStatus);

// Delete well(Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteWell);



<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 9aaa432 (Add frontend and update backend for water quality monitoring)
