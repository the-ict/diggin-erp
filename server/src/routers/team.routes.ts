import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createTeamValidator, updateTeamValidator } from "../validators/team.validator.js";
import { createTeam, deleteTeam, getAllTeams, getTeamById, updateTeam } from "../controllers/team.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Only ADMIN can manage teams
router.post("/", authorize("ADMIN"), validate(createTeamValidator), createTeam);
router.get("/", authorize("ADMIN"), getAllTeams);
router.get("/:id", authorize("ADMIN"), getTeamById);
router.put("/:id", authorize("ADMIN"), validate(updateTeamValidator), updateTeam);
router.delete("/:id", authorize("ADMIN"), deleteTeam);

export default router;
