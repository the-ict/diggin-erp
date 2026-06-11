export interface WareItem {
  _id: string;
  name: string;
  quantity: number;
}

export interface CreateWareItemDto {
  name: string;
  quantity: number;
}

export interface UpdateWareItemDto extends Partial<CreateWareItemDto> {}
