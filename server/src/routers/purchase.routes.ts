import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createPurchaseValidator, updatePurchaseValidator } from "../validators/purchase.validator.js";
import { createPurchase, deletePurchase, getAllPurchases, getPurchaseById, updatePurchase } from "../controllers/purchase.controller.js";

const router = Router();

router.post("/", validate(createPurchaseValidator), createPurchase);
router.get("/", getAllPurchases);
router.get("/:id", getPurchaseById);
router.put("/:id", validate(updatePurchaseValidator), updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
