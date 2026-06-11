export type TransactionCurrency = "UZS" | "USD";
export type TransactionType = "INCOME" | "OUTCOME";

export interface Transaction {
  _id: string;
  amount: number;
  currency: TransactionCurrency;
  type: TransactionType;
  note?: string;
  transferredX?: string;
  createdAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  currency: TransactionCurrency;
  type: TransactionType;
  note?: string;
  transferredX?: string;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}
