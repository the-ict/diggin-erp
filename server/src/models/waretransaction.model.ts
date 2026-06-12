import mongoose from "mongoose";
import type { IWareTransactionModel } from "../types/waretransaction.types.js";

const wareTransactionSchema = new mongoose.Schema<IWareTransactionModel>({
    wareItemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, enum: ["INCOME", "OUTCOME"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{
    timestamps: true,
});

export const WareTransaction = mongoose.model<IWareTransactionModel>("WareTransaction", wareTransactionSchema);