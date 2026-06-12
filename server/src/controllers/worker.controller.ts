import { WorkerModel } from "../models/worker.model.js";
import { TeamModel } from "../models/team.model.js";
import type { Request, Response, NextFunction } from "express";

export const createWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const worker = await WorkerModel.create(req.body);
        if (worker._id && worker.teamId && worker.teamId !== "") {
            await TeamModel.findByIdAndUpdate(worker.teamId, {
                $addToSet: { workersIds: worker._id }
            });
        }
        res.status(201).json({ success: true, data: worker });
    } catch (error) {
        next(error);
    }
};

export const getAllWorkers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await WorkerModel.find().sort({ name: 1 });
        res.json({ success: true, data: workers });
    } catch (error) {
        next(error);
    }
};

export const getWorkerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const worker = await WorkerModel.findById(id);
        if (!worker) {
            return res.status(404).json({ success: false, error: "Worker not found" });
        }
        res.json({ success: true, data: worker });
    } catch (error) {
        next(error);
    }
};

export const updateWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const oldWorker = await WorkerModel.findById(id);
        if (!oldWorker) {
            return res.status(404).json({ success: false, error: "Worker not found" });
        }
        const worker = await WorkerModel.findByIdAndUpdate(id, req.body, { new: true });
        
        // Handle team change
        if (req.body.teamId && req.body.teamId !== oldWorker.teamId && req.body.teamId !== "") {
            // Remove from old team
            if (oldWorker.teamId && oldWorker.teamId !== "") {
                await TeamModel.findByIdAndUpdate(oldWorker.teamId, {
                    $pull: { workersIds: id }
                });
            }
            // Add to new team
            await TeamModel.findByIdAndUpdate(req.body.teamId, {
                $addToSet: { workersIds: id }
            });
        }
        
        res.json({ success: true, data: worker });
    } catch (error) {
        next(error);
    }
};

export const deleteWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const worker = await WorkerModel.findByIdAndDelete(id);
        if (!worker) {
            return res.status(404).json({ success: false, error: "Worker not found" });
        }
        // Remove from team
        if (worker.teamId && worker.teamId !== "") {
            await TeamModel.findByIdAndUpdate(worker.teamId, {
                $pull: { workersIds: id }
            });
        }
        res.json({ success: true, data: worker });
    } catch (error) {
        next(error);
    }
};

