import { Well } from "../models/well.model.js";
import { TeamModel } from "../models/team.model.js";
import type { Request, Response, NextFunction } from "express";
import { MachineModel } from "../models/machine.model.js";

export const createWell = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const well = await Well.create(req.body);
        if (well._id && well.team) {
            await TeamModel.findByIdAndUpdate(well.team, {
                $addToSet: { wells: well._id }
            });

            await MachineModel.findOneAndUpdate({
                teamId: well.team,
            }, {
                $addToSet: { wells: well._id }
            });
        }
        res.status(201).json({ success: true, data: well });
    } catch (error) {
        next(error);
    }
};

export const getAllWells = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const wells = await Well.find().sort({ createdAt: -1 });
        res.json({ success: true, data: wells });
    } catch (error) {
        next(error);
    }
};

export const getWellById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const well = await Well.findById(id);
        if (!well) {
            return res.status(404).json({ success: false, error: "Well not found" });
        }
        res.json({ success: true, data: well });
    } catch (error) {
        next(error);
    }
};

export const updateWell = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const oldWell = await Well.findById(id);
        if (!oldWell) {
            return res.status(404).json({ success: false, error: "Well not found" });
        }
        const well = await Well.findByIdAndUpdate(id, req.body, { new: true });

        if (req.body.team && req.body.team !== oldWell.team) {
            if (oldWell.team) {
                await TeamModel.findByIdAndUpdate(oldWell.team, {
                    $pull: { wells: id }
                });
            }
            await TeamModel.findByIdAndUpdate(req.body.team, {
                $addToSet: { wells: id }
            });
        }

        res.json({ success: true, data: well });
    } catch (error) {
        next(error);
    }
};

export const deleteWell = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const well = await Well.findByIdAndDelete(id);
        if (!well) {
            return res.status(404).json({ success: false, error: "Well not found" });
        }
        if (well.team) {
            await TeamModel.findByIdAndUpdate(well.team, {
                $pull: { wells: id }
            });
        }
        res.json({ success: true, data: well });
    } catch (error) {
        next(error);
    }
};
