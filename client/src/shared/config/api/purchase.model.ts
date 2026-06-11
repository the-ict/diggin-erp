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
  note?: string;
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {}
