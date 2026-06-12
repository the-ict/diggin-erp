import type { IUser } from "../types/user.types.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "MANAGER", "WORKER", "WAREHOUSEMAN"],
        required: true,
        default: "WORKER",
    },
    teamId: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function() {
    try {
        const user = this as any;
        if (!user.isModified("password")) {
            return;
        }
        const password = user.password;
        user.password = await bcrypt.hash(password, 10);
    } catch (error) {
        throw error;
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        const user = this as any;
        return bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
        return false;
    }
};

export const User = mongoose.model<IUser>("User", userSchema);
