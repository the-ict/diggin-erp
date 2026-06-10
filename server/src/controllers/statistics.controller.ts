import type { Request, Response, NextFunction } from "express"
import { WorkerModel } from "../models/worker.model.js";
import { MachineModel } from "../models/machine.model.js";
import { Purchase } from "../models/purchase.model.js";
import { WareTransaction } from "../models/waretransaction.model.js";
import { WareItem } from "../models/wareitem.model.js";
import { TeamModel } from "../models/team.model.js";
import { Well } from "../models/well.model.js";

export const workersByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {month, year} = req.body;

        const workers = await WorkerModel.find({
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });
        
        res.json({ success: true, data: workers });
    } catch (error) {
        next(error);
    }
};

export const machinesByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {month, year} = req.body;

        const machines = await MachineModel.find({
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });
        
        res.json({ success: true, data: machines });
    } catch (error) {
        next(error);
    }
};

export const purchasesByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {month, year} = req.body;

        const purchases = await Purchase.find({
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });
        
        res.json({ success: true, data: purchases });
    } catch (error) {
        next(error);
    }
};

export const wareTransactionsByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {month, year} = req.body;

        const transactions = await WareTransaction.find({
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });
        
        res.json({ success: true, data: transactions });
    } catch (error) {
        next(error);
    }
};

export const wareItemsByMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {month, year} = req.body;

        const items = await WareItem.find({
            createdAt: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });
        
        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

export const totalMachines12Month = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const machines = await MachineModel.find({
            createdAt: {
                $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                $lt: new Date()
            }
        });
        
        res.json({ success: true, data: machines });
    } catch (error) {
        next(error);
    }
};

export const totalWorkers12Month = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await WorkerModel.find({
            createdAt: {
                $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                $lt: new Date()
            }
        });
        
        res.json({ success: true, data: workers });
    } catch (error) {
        next(error);
    }
};

export const totalTeams12Month = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teams = await TeamModel.find({
            createdAt: {
                $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                $lt: new Date()
            }
        });
        
        res.json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

export const wells12Month = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wells = await Well.find({
            createdAt: {
                $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
                $lt: new Date()
            }
        });
        
        res.json({ success: true, data: wells });
    } catch (error) {
        next(error);
    }
};