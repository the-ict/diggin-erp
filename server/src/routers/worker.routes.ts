import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWorkerValidator, updateWorkerValidator } from "../validators/worker.validator.js";
import { createWorker, deleteWorker, getAllWorkers, getWorkerById, updateWorker } from "../controllers/worker.controller.js";

const router = Router();

router.post("/", validate(createWorkerValidator), createWorker);
router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/:id", validate(updateWorkerValidator), updateWorker);
router.delete("/:id", deleteWorker);

export default router;