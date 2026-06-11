export type MachineStatus = "ACTIVE" | "REPAIRING";

export interface Machine {
  _id: string;
  number: string;
  teamId: string;
  wells: string[];
  status: MachineStatus;
}

export interface CreateMachineDto {
  number: string;
  teamId: string;
  wells: string[];
  status: MachineStatus;
}

export interface UpdateMachineDto extends Partial<CreateMachineDto> {}
