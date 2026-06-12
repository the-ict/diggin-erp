import mongoose from "mongoose";
import type { IWell } from "../types/well.types.js";

const wellSchema = new mongoose.Schema<IWell>({
    team: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: false,
    },
    except_length: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
},{
    timestamps: true,
});

export const Well = mongoose.model<IWell>("Well", wellSchema);