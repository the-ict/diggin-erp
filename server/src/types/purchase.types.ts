export interface IPurchaseModel {
    name: string;
    quantity: number;
    price: number;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
};
