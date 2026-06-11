export type WareTransactionType = "INCOME" | "OUTCOME";

export interface WareTransaction {
  _id: string;
  wareItemId: string;
  quantity: number;
  type: WareTransactionType;
  createdAt: string;
}

export interface CreateWareTransactionDto {
  wareItemId: string;
  quantity: number;
  type: WareTransactionType;
}

export interface UpdateWareTransactionDto extends Partial<CreateWareTransactionDto> {}
