export interface IWareTransactionModel {
    wareItemId: string;
    quantity: number;
    type: "INCOME" | "OUTCOME";
    createdAt: Date;
    updatedAt: Date;
};