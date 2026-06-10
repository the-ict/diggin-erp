import mongoose from "mongoose";
import type { IWareItemModel } from "../types/wareitem.types.js";

const wareItemSchema = new mongoose.Schema<IWareItemModel>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const WareItem = mongoose.model<IWareItemModel>("WareItem", wareItemSchema);