import { TeamModel } from "../models/team.model.js";
import type { Request, Response, NextFunction } from "express";

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await TeamModel.create(req.body);
        res.status(201).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

export const getAllTeams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await TeamModel.find().sort({ name: 1 });
        res.json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const team = await TeamModel.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }
        res.json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const team = await TeamModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!team) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }
        res.json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const team = await TeamModel.findByIdAndDelete(id);
        if (!team) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }
        res.json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};
