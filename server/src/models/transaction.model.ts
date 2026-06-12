import mongoose from "mongoose";
import type { ITransaction } from "../types/transaction.types.js";

const transactionSchema = new mongoose.Schema<ITransaction>({
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    type: { type: String, required: true },
    note: { type: String, required: false },
});

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
