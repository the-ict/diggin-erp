import { WareItem } from "../models/wareitem.model.js";
import type { Request, Response, NextFunction } from "express";

export const createWareItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wareItem = await WareItem.create(req.body);
        res.status(201).json({ success: true, data: wareItem });
    } catch (error) {
        next(error);
    }
};

export const getAllWareItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wareItems = await WareItem.find().sort({ name: 1 });
        res.json({ success: true, data: wareItems });
    } catch (error) {
        next(error);
    }
};

export const getWareItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareItem = await WareItem.findById(id);
        if (!wareItem) {
            return res.status(404).json({ success: false, error: "WareItem not found" });
        }
        res.json({ success: true, data: wareItem });
    } catch (error) {
        next(error);
    }
};

export const updateWareItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareItem = await WareItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!wareItem) {
            return res.status(404).json({ success: false, error: "WareItem not found" });
        }
        res.json({ success: true, data: wareItem });
    } catch (error) {
        next(error);
    }
};

export const deleteWareItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareItem = await WareItem.findByIdAndDelete(id);
        if (!wareItem) {
            return res.status(404).json({ success: false, error: "WareItem not found" });
        }
        res.json({ success: true, data: wareItem });
    } catch (error) {
        next(error);
    }
};
