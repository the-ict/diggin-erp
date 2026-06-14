import jwt from "jsonwebtoken";
import type { IUser } from "../types/user.types.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "15d";

export interface JWTPayload {
    userId: string;
    username: string;
    role: string;
    teamId?: string | undefined;
}

export function generateToken(user: IUser): string {
    const payload: JWTPayload = {
        userId: user._id.toString(),
        username: user.username,
        role: user.role,
        teamId: user.teamId,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
