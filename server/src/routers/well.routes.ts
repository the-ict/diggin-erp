import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWellValidator, updateWellValidator } from "../validators/well.validator.js";
import { createWell, deleteWell, getAllWells, getWellById, updateWell } from "../controllers/well.controller.js";

const router = Router();

router.post("/", validate(createWellValidator), createWell);
router.get("/", getAllWells);
router.get("/:id", getWellById);
router.put("/:id", validate(updateWellValidator), updateWell);
router.delete("/:id", deleteWell);

export default router;
