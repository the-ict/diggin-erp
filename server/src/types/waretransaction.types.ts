export interface IWareTransactionModel {
    wareItemId: string;
    quantity: number;
    type: "INCOME" | "OUTCOME";
    givenToWorker: string;
};