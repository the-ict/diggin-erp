import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createTeamValidator, updateTeamValidator } from "../validators/team.validator.js";
import { createTeam, deleteTeam, getAllTeams, getTeamById, updateTeam } from "../controllers/team.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Only ADMIN can manage teams (create, update, delete)
router.post("/", validate(createTeamValidator), createTeam);
router.get("/", getAllTeams); // All authenticated users can read teams
router.get("/:id", getTeamById); // All authenticated users can read teams
router.put("/:id", validate(updateTeamValidator), updateTeam);
router.delete("/:id", deleteTeam);

export default router;
