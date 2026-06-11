import { Transaction } from "../models/transaction.model.js";
import type { Request, Response, NextFunction } from "express";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    };
};

export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json({ success: true, data: transactions });
    } catch (error) {
        next(error);
    }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const transaction = await Transaction.findById(id);
        if (!transaction) {
            return res.status(404).json({ success: false, error: "Transaction not found" });
        }
        res.json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ success: false, error: "Transaction not found" });
        }
        res.json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ success: false, error: "Transaction not found" });
        }
        res.json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};
