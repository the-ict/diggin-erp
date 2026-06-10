import { Router } from "express";
import { validate } from "../middleware/validator.middleware.js";
import { createWareTransactionValidator, updateWareTransactionValidator } from "../validators/waretransaction.validator.js";
import { createWareTransaction, deleteWareTransaction, getAllWareTransactions, getWareTransactionById, updateWareTransaction } from "../controllers/waretransaction.controller.js";

const router = Router();

router.post("/", validate(createWareTransactionValidator), createWareTransaction);
router.get("/", getAllWareTransactions);
router.get("/:id", getWareTransactionById);
router.put("/:id", validate(updateWareTransactionValidator), updateWareTransaction);
router.delete("/:id", deleteWareTransaction);

export default router;
