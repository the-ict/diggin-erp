import { WorkerModel } from "../models/worker.model.js";
import type { Request, Response, NextFunction } from "express";

export const createWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const worker = await WorkerModel.create(req.body);
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
        const worker = await WorkerModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!worker) {
            return res.status(404).json({ success: false, error: "Worker not found" });
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
        res.json({ success: true, data: worker });
    } catch (error) {
        next(error);
    }
};

