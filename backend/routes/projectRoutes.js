
import express from "express";
import {
  addMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Admin"), createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, authorize("Admin"), updateProject);
router.post("/:id/members", protect, authorize("Admin"), addMember);
router.delete("/:id", protect, authorize("Admin"), deleteProject);

export default router;
