import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteReq,
} from "../controllers/maintenanceRequestController.js";
import {
  validateCreateMaintenanceRequest,
  validateUpdateMaintenanceRequest,
} from "../middleware/validationMiddleware.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.post("/", authorizeRoles("communityUser"), validateCreateMaintenanceRequest, create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", authorizeRoles("fieldOfficer"), validateUpdateMaintenanceRequest, update);
router.delete("/:id", authorizeRoles("admin"), deleteReq);

export default router;
