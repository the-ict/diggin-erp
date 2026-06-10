import { Purchase } from "../models/purchase.model.js";
import type { Request, Response, NextFunction } from "express";

export const createPurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const purchase = await Purchase.create(req.body);
        res.status(201).json({ success: true, data: purchase });
    } catch (error) {
        next(error);
    }
};

export const getAllPurchases = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const purchases = await Purchase.find().sort({ createdAt: -1 });
        res.json({ success: true, data: purchases });
    } catch (error) {
        next(error);
    }
};

export const getPurchaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ success: false, error: "Purchase not found" });
        }
        res.json({ success: true, data: purchase });
    } catch (error) {
        next(error);
    }
};

export const updatePurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const purchase = await Purchase.findByIdAndUpdate(id, req.body, { new: true });
        if (!purchase) {
            return res.status(404).json({ success: false, error: "Purchase not found" });
        }
        res.json({ success: true, data: purchase });
    } catch (error) {
        next(error);
    }
};

export const deletePurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const purchase = await Purchase.findByIdAndDelete(id);
        if (!purchase) {
            return res.status(404).json({ success: false, error: "Purchase not found" });
        }
        res.json({ success: true, data: purchase });
    } catch (error) {
        next(error);
    }
};
