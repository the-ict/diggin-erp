import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWareItemValidator, updateWareItemValidator } from "../validators/wareitem.validator.js";
import { createWareItem, deleteWareItem, getAllWareItems, getWareItemById, updateWareItem } from "../controllers/wareitem.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// WAREHOUSEMAN and ADMIN can manage ware items
router.post("/", authorize("ADMIN", "WAREHOUSEMAN"), validate(createWareItemValidator), createWareItem);
router.get("/", authorize("ADMIN", "WAREHOUSEMAN"), getAllWareItems);
router.get("/:id", authorize("ADMIN", "WAREHOUSEMAN"), getWareItemById);
router.put("/:id", authorize("ADMIN", "WAREHOUSEMAN"), validate(updateWareItemValidator), updateWareItem);
router.delete("/:id", authorize("ADMIN", "WAREHOUSEMAN"), deleteWareItem);

export default router;
