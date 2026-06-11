export type WorkerPosition = "DRIVER" | "OPERATOR" | "WORKER" | "SUPERVISOR" | "MASTER";

export interface Worker {
  _id: string;
  name: string;
  phone: string;
  teamId: string;
  position: WorkerPosition;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkerDto {
  name: string;
  phone: string;
  teamId: string;
  position: WorkerPosition;
}

export interface UpdateWorkerDto extends Partial<CreateWorkerDto> {}
