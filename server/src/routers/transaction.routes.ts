import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createTransactionValidator, updateTransactionValidator } from "../validators/transaction.validator.js";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/", validate(createTransactionValidator), createTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", validate(updateTransactionValidator), updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
