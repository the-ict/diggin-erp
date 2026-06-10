import { WareTransaction } from "../models/waretransaction.model.js";
import { WareItem } from "../models/wareitem.model.js";
import type { Request, Response, NextFunction } from "express";

export const createWareTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wareTransaction = await WareTransaction.create(req.body);
        
        if (wareTransaction.wareItemId) {
            const item = await WareItem.findById(wareTransaction.wareItemId);
            if (item) {
                if (wareTransaction.type === "INCOME") {
                    item.quantity += wareTransaction.quantity;
                } else if (wareTransaction.type === "OUTCOME") {
                    item.quantity -= wareTransaction.quantity;
                    if (item.quantity < 0) item.quantity = 0;
                };
                await item.save();
            }
        }
        
        res.status(201).json({ success: true, data: wareTransaction });
    } catch (error) {
        next(error);
    }
};

export const getAllWareTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wareTransactions = await WareTransaction.find().sort({ createdAt: -1 });
        res.json({ success: true, data: wareTransactions });
    } catch (error) {
        next(error);
    }
};

export const getWareTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareTransaction = await WareTransaction.findById(id);
        if (!wareTransaction) {
            return res.status(404).json({ success: false, error: "WareTransaction not found" });
        }
        res.json({ success: true, data: wareTransaction });
    } catch (error) {
        next(error);
    }
};

export const updateWareTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareTransaction = await WareTransaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!wareTransaction) {
            return res.status(404).json({ success: false, error: "WareTransaction not found" });
        }
        res.json({ success: true, data: wareTransaction });
    } catch (error) {
        next(error);
    }
};

export const deleteWareTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const wareTransaction = await WareTransaction.findByIdAndDelete(id);
        if (!wareTransaction) {
            return res.status(404).json({ success: false, error: "WareTransaction not found" });
        }
        res.json({ success: true, data: wareTransaction });
    } catch (error) {
        next(error);
    }
};
