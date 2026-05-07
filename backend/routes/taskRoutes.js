
import express from "express";
import {
  createTask,
  getDashboardSummary,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard/summary", protect, getDashboardSummary);
router.post("/", protect, authorize("Admin"), createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);

export default router;
