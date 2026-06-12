import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWorkerValidator, updateWorkerValidator } from "../validators/worker.validator.js";
import { createWorker, deleteWorker, getAllWorkers, getWorkerById, updateWorker } from "../controllers/worker.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Only ADMIN can manage workers
router.post("/", authorize("ADMIN"), validate(createWorkerValidator), createWorker);
router.get("/", authorize("ADMIN"), getAllWorkers);
router.get("/:id", authorize("ADMIN"), getWorkerById);
router.put("/:id", authorize("ADMIN"), validate(updateWorkerValidator), updateWorker);
router.delete("/:id", authorize("ADMIN"), deleteWorker);

export default router;