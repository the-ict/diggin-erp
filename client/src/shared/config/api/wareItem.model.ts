export interface WareItem {
  _id: string;
  name: string;
  quantity: number;
}

export interface CreateWareItemDto {
  name: string;
  quantity: number;
}

export interface CreateWareTransaction {
  wareItemId: string;
  quantity: number;
  type: "INCOME" | "OUTCOME";
  givenToWorker: string;
}

export interface UpdateWareItemDto extends Partial<CreateWareItemDto> { }
