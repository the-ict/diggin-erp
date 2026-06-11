export type WellStatus = "DUGGING" | "FINISHED" | "SUCCESSFUL" | "FAILED";

export interface Well {
  _id: string;
  team: string;
  length: number;
  except_length: number;
  status: WellStatus;
}

export interface CreateWellDto {
  team: string;
  length: number;
  except_length: number;
  status: WellStatus;
}

export interface UpdateWellDto extends Partial<CreateWellDto> {}
