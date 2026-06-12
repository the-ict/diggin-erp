import type { Request, Response, NextFunction } from "express";
import { MachineModel } from "../models/machine.model.js";
import { TeamModel } from "../models/team.model.js";

export const createMachine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const machine = await MachineModel.create(req.body);
        if(machine._id && machine.teamId && machine.teamId !== "") {
            await TeamModel.findByIdAndUpdate(machine.teamId, {
                $set: { machine: machine._id }
            })
        };
        res.status(201).json({ success: true, data: machine });
    } catch (error) {
        next(error);
    }
};

export const getAllMachines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const machines = await MachineModel.find().sort({ number: 1 });
        res.json({ success: true, data: machines });
    } catch (error) {
        next(error);
    }
};

export const getMachineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const machine = await MachineModel.findById(id);
        if (!machine) {
            return res.status(404).json({ success: false, error: "Machine not found" });
        }
        res.json({ success: true, data: machine });
    } catch (error) {
        next(error);
    }
};

export const updateMachine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const oldMachine = await MachineModel.findById(id);
        if (!oldMachine) {
            return res.status(404).json({ success: false, error: "Machine not found" });
        }
        const machine = await MachineModel.findByIdAndUpdate(id, req.body, { new: true });
        
        if (req.body.teamId && req.body.teamId !== oldMachine.teamId && req.body.teamId !== "") {
            if (oldMachine.teamId && oldMachine.teamId !== "") {
                await TeamModel.findByIdAndUpdate(oldMachine.teamId, {
                    $set: { machine: null }
                });
            }
            await TeamModel.findByIdAndUpdate(req.body.teamId, {
                $set: { machine: id }
            });
        }
        
        res.json({ success: true, data: machine });
    } catch (error) {
        next(error);
    }
};

export const deleteMachine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: "ID is required" });
        }
        const machine = await MachineModel.findByIdAndDelete(id);
        if (!machine) {
            return res.status(404).json({ success: false, error: "Machine not found" });
        }
        if (machine.teamId && machine.teamId !== "") {
            await TeamModel.findByIdAndUpdate(machine.teamId, {
                $set: { machine: null }
            });
        };
        res.json({ success: true, data: machine });
    } catch (error) {
        next(error);
    }
};
