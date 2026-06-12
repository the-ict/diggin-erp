import mongoose from "mongoose";
import type { IWorkerModel } from "../types/worker.types.js";

const workerSchema = new mongoose.Schema<IWorkerModel>({
    name: String,
    phone: String,
    teamId: {
        type: String,
        required: false,
    },
    position: String,
}, {
    timestamps: true,
});

export const WorkerModel = mongoose.model("Worker", workerSchema);
