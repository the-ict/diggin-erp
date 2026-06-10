import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createMachineValidator, updateMachineValidator } from "../validators/machine.validator.js";
import { createMachine, deleteMachine, getAllMachines, getMachineById, updateMachine } from "../controllers/machine.controller.js";

const router = Router();

router.post("/", validate(createMachineValidator), createMachine);
router.get("/", getAllMachines);
router.get("/:id", getMachineById);
router.put("/:id", validate(updateMachineValidator), updateMachine);
router.delete("/:id", deleteMachine);

export default router;
