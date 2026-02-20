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

const router = express.Router();

router.post("/", validateCreateMaintenanceRequest, create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", validateUpdateMaintenanceRequest, update);
router.delete("/:id", deleteReq);

export default router;
