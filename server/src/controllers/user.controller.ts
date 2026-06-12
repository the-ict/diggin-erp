import { User } from "../models/user.model.js";
import { generateToken } from "../utils/auth.utils.js";
import type { Request, Response, NextFunction } from "express";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, role, teamId } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Username already exists" });
        }

        const user = await User.create({
            username,
            password,
            role: role || "WORKER",
            teamId,
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    teamId: user.teamId,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isPasswordValid = await (user as any).comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    teamId: user.teamId,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
