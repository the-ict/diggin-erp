import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createTransactionValidator, updateTransactionValidator } from "../validators/transaction.validator.js";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transaction.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Only ADMIN can manage transactions
router.post("/", authorize("ADMIN"), validate(createTransactionValidator), createTransaction);
router.get("/", authorize("ADMIN"), getAllTransactions);
router.get("/:id", authorize("ADMIN"), getTransactionById);
router.put("/:id", authorize("ADMIN"), validate(updateTransactionValidator), updateTransaction);
router.delete("/:id", authorize("ADMIN"), deleteTransaction);

export default router;
