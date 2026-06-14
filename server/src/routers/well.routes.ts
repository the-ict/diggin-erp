import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWellValidator, updateWellValidator } from "../validators/well.validator.js";
import { createWell, deleteWell, getAllWells, getWellById, updateWell } from "../controllers/well.controller.js";
import { authenticate, authorize, authorizeOwnTeam } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// WORKER and ADMIN can create wells
router.post("/", authorize("ADMIN", "WORKER"), validate(createWellValidator), createWell);

// All authenticated users can view wells
router.get("/", getAllWells);
router.get("/:id", getWellById);

// WORKER can update wells for their own team, ADMIN can update all
router.put("/:id", authenticate,authorizeOwnTeam, validate(updateWellValidator), updateWell);

// Only ADMIN can delete wells
router.delete("/:id", authorize("ADMIN", "WORKER"), deleteWell);

export default router;
