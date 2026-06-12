import mongoose from "mongoose";
import type { IMachineModel } from "../types/machine.types.js";

const machineSchema = new mongoose.Schema<IMachineModel>({
    number: {
        type: String,
        required: true,
        trim: true,
    },
    teamId: {
        type: String,
        required: false,
        trim: true,
    },
    wells: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ["ACTIVE", "REPAIRING"],
        default: "ACTIVE",
    },
},{
    timestamps: true,
});

export const MachineModel = mongoose.model("Machine", machineSchema);