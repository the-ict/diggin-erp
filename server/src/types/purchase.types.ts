export interface IPurchaseModel {
    name: string;
    quantity: number;
    price: number;
    note?: string;
    type: IPurchaseType;
    createdAt: Date;
    updatedAt: Date;
};

export type IPurchaseType = "DEBT" | "PAID";