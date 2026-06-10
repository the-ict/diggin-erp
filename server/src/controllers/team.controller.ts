import { TeamModel } from "../models/team.model.js";
import { WorkerModel } from "../models/worker.model.js";
import { MachineModel } from "../models/machine.model.js";
import type { Request, Response, NextFunction } from "express";

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const team = await TeamModel.create(req.body);
        if (team._id) {
            if (team.workersIds && team.workersIds.length > 0) {
                await WorkerModel.updateMany(
                    { _id: { $in: team.workersIds } },
                    { teamId: team._id }
                );
            }
            if (team.machine) {
                await MachineModel.findByIdAndUpdate(team.machine, {
                    teamId: team._id
                });
            }
        }
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
        const oldTeam = await TeamModel.findById(id);
        if (!oldTeam) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }
        const team = await TeamModel.findByIdAndUpdate(id, req.body, { new: true });
        
        // Handle workers change
        if (req.body.workersIds) {
            // Remove from old workers
            if (oldTeam.workersIds && oldTeam.workersIds.length > 0) {
                await WorkerModel.updateMany(
                    { _id: { $in: oldTeam.workersIds } },
                    { teamId: null }
                );
            }
            // Add to new workers
            if (req.body.workersIds.length > 0) {
                await WorkerModel.updateMany(
                    { _id: { $in: req.body.workersIds } },
                    { teamId: id }
                );
            }
        }
        
        // Handle machine change
        if (req.body.machine && req.body.machine !== oldTeam.machine) {
            // Remove from old machine
            if (oldTeam.machine) {
                await MachineModel.findByIdAndUpdate(oldTeam.machine, {
                    teamId: null
                });
            }
            // Add to new machine
            await MachineModel.findByIdAndUpdate(req.body.machine, {
                teamId: id
            });
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
        // Remove from workers
        if (team.workersIds && team.workersIds.length > 0) {
            await WorkerModel.updateMany(
                { _id: { $in: team.workersIds } },
                { teamId: null }
            );
        }
        // Remove from machine
        if (team.machine) {
            await MachineModel.findByIdAndUpdate(team.machine, {
                teamId: null
            });
        }
        res.json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};
