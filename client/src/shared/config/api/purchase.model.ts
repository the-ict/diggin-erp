export interface Purchase {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
  createdAt: string;
}

export interface CreatePurchaseDto {
  name: string;
  quantity: number;
  price: number;
  type: "INCOME" | "OUTCOME";
  note?: string;
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {}
