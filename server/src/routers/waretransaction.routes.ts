import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWareTransactionValidator, updateWareTransactionValidator } from "../validators/waretransaction.validator.js";
import { createWareTransaction, deleteWareTransaction, getAllWareTransactions, getWareTransactionById, updateWareTransaction } from "../controllers/waretransaction.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// WAREHOUSEMAN and ADMIN can manage ware transactions
router.post("/", authorize("ADMIN", "WAREHOUSEMAN"), validate(createWareTransactionValidator), createWareTransaction);
router.get("/", authorize("ADMIN", "WAREHOUSEMAN"), getAllWareTransactions);
router.get("/:id", authorize("ADMIN", "WAREHOUSEMAN"), getWareTransactionById);
router.put("/:id", authorize("ADMIN", "WAREHOUSEMAN"), validate(updateWareTransactionValidator), updateWareTransaction);
router.delete("/:id", authorize("ADMIN", "WAREHOUSEMAN"), deleteWareTransaction);

export default router;
