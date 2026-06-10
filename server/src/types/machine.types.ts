export interface IMachineModel {
    number: string;
    teamId: string;
    status: IMachineStatus;
    wells?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type IMachineStatus = "ACTIVE" | "REPAIRING";