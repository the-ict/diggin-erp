import { URLS } from "./URLs";
import { Team, CreateTeamDto, UpdateTeamDto } from "./team.model";

const headers = { "Content-Type": "application/json" };

export const teamRequests = {
  getAll: async (): Promise<Team[]> => {
    const res = await fetch(URLS.teams);
    if (!res.ok) throw new Error("Failed to fetch teams");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Team> => {
    const res = await fetch(URLS.team(id));
    if (!res.ok) throw new Error("Failed to fetch team");
    return res.json();
  },

  create: async (data: CreateTeamDto): Promise<Team> => {
    const res = await fetch(URLS.teams, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create team");
    return res.json();
  },

  update: async (id: string, data: UpdateTeamDto): Promise<Team> => {
    const res = await fetch(URLS.team(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update team");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.team(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete team");
  },
};
