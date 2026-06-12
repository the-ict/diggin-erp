import mongoose from "mongoose";
import type { ITeamModel } from "../types/team.types.js";

const teamSchema = new mongoose.Schema<ITeamModel>({
    workersIds: [String],
    name: {
        type: String,
        required: true,
        trim: true,
    },
    machine: {
        type: String,
        required: true,
        trim: true,
    },
    wells: [{
        type: String,
        required: false,
    }]
},{
    timestamps: true,
});

export const TeamModel = mongoose.model("Team", teamSchema);