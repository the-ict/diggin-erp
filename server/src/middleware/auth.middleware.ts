import { verifyToken, type JWTPayload } from "../utils/auth.utils.js";
import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
    userId?: string;
    username?: string;
    role?: string;
    team?: string | undefined;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "No token provided" });
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token) as JWTPayload;

        console.log("decoded: ", decoded);

        req.userId = decoded.userId;
        req.username = decoded.username;
        req.role = decoded.role;
        req.team = decoded.teamId;

        console.log("Authenticated user:", req.userId, req.username, req.role, req.team);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Invalid token" });
    }
};

export const authorize = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.role) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }

        if (!allowedRoles.includes(req.role)) {
            return res.status(403).json({ success: false, error: "Not authorized" });
        }

        next();
    };
};

export const authorizeOwnTeam = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !req.body.team) {
        return res.status(401).json({ success: false, error: "Not authenticated" });
    };

    if (req.role !== "ADMIN" && req.role !== "WORKER") {
        return res.status(403).json({ success: false, error: "Not authorized" });
    }

    next();
};
