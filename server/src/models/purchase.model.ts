import mongoose from "mongoose";
import type { IPurchaseModel } from "../types/purchase.types.js";

const purchaseSchema = new mongoose.Schema<IPurchaseModel>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Purchase = mongoose.model<IPurchaseModel>("Purchase", purchaseSchema);