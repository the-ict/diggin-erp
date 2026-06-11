export interface ITransaction {
    amount: number;
    currency: ITransacitonCurrency;
    type: ITransactionType;
    note?: string;
    transferredX: string;
};


export type ITransacitonCurrency = "UZS" | "USD";

export type ITransactionType = "INCOME" | "OUTCOME";