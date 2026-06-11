export interface Team {
  _id: string;
  name: string;
  workersIds: string[];
  machine: string;
  wells: string[];
}

export interface CreateTeamDto {
  name: string;
  workersIds: string[];
  machine: string;
  wells: string[];
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {}
