export type UserRole = "ADMIN" | "MANAGER" | "WORKER" | "WAREHOUSEMAN";

export interface IUser {
    _id: string;
    username: string;
    password: string;
    role: UserRole;
    teamId?: string;
    createdAt: Date;
    updatedAt: Date;
};