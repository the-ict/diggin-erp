import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWareItemValidator, updateWareItemValidator } from "../validators/wareitem.validator.js";
import { createWareItem, deleteWareItem, getAllWareItems, getWareItemById, updateWareItem } from "../controllers/wareitem.controller.js";

const router = Router();

router.post("/", validate(createWareItemValidator), createWareItem);
router.get("/", getAllWareItems);
router.get("/:id", getWareItemById);
router.put("/:id", validate(updateWareItemValidator), updateWareItem);
router.delete("/:id", deleteWareItem);

export default router;
