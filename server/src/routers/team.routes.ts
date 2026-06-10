import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createTeamValidator, updateTeamValidator } from "../validators/team.validator.js";
import { createTeam, deleteTeam, getAllTeams, getTeamById, updateTeam } from "../controllers/team.controller.js";

const router = Router();

router.post("/", validate(createTeamValidator), createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.put("/:id", validate(updateTeamValidator), updateTeam);
router.delete("/:id", deleteTeam);

export default router;
