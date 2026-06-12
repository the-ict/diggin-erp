import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createMachineValidator, updateMachineValidator } from "../validators/machine.validator.js";
import { createMachine, deleteMachine, getAllMachines, getMachineById, updateMachine } from "../controllers/machine.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Only ADMIN can manage machines
router.post("/", authorize("ADMIN"), validate(createMachineValidator), createMachine);
router.get("/", authorize("ADMIN"), getAllMachines);
router.get("/:id", authorize("ADMIN"), getMachineById);
router.put("/:id", authorize("ADMIN"), validate(updateMachineValidator), updateMachine);
router.delete("/:id", authorize("ADMIN"), deleteMachine);

export default router;
