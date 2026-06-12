import mongoose from "mongoose";
import type { IWareTransactionModel } from "../types/waretransaction.types.js";

const wareTransactionSchema = new mongoose.Schema<IWareTransactionModel>({
    wareItemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, enum: ["INCOME", "OUTCOME"], required: true }
},{
    timestamps: true,
});

export const WareTransaction = mongoose.model<IWareTransactionModel>("WareTransaction", wareTransactionSchema);