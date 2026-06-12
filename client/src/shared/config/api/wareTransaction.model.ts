export type WareTransactionType = "INCOME" | "OUTCOME";

export interface WareTransaction {
  _id: string;
  wareItemId: string;
  quantity: number;
  type: WareTransactionType;
  givenToWorker: string;
  createdAt: string;
}

export interface CreateWareTransactionDto {
  wareItemId: string;
  quantity: number;
  type: WareTransactionType;
  givenToWorker: string;
}

export interface UpdateWareTransactionDto extends Partial<CreateWareTransactionDto> {}
