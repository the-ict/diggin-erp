import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createPurchaseValidator, updatePurchaseValidator } from "../validators/purchase.validator.js";
import { createPurchase, deletePurchase, getAllPurchases, getPurchaseById, updatePurchase } from "../controllers/purchase.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// MANAGER and ADMIN can manage purchases
router.post("/", authorize("ADMIN", "MANAGER"), validate(createPurchaseValidator), createPurchase);
router.get("/", authorize("ADMIN", "MANAGER"), getAllPurchases);
router.get("/:id", authorize("ADMIN", "MANAGER"), getPurchaseById);
router.put("/:id", authorize("ADMIN", "MANAGER"), validate(updatePurchaseValidator), updatePurchase);
router.delete("/:id", authorize("ADMIN", "MANAGER"), deletePurchase);

export default router;
