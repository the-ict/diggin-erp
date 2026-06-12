import mongoose from "mongoose";
import type { IPurchaseModel} from "../types/purchase.types.js";

const purchaseSchema = new mongoose.Schema<IPurchaseModel>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    note: { type: String, required: false },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{
    timestamps: true,
});

export const Purchase = mongoose.model<IPurchaseModel>("Purchase", purchaseSchema);