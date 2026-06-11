export interface IWorkerModel {
    name: string;
    phone: string;
    teamId: string;
    position: IWorkerPosition;
};

export type IWorkerPosition = "DRIVER" | "OPERATOR" | "WORKER" | "SUPERVISOR" | "MASTER";