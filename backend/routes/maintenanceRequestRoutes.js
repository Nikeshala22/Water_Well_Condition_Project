import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteReq,
} from "../controllers/maintenanceRequestController.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", deleteReq);

export default router;
