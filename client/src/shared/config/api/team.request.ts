import { URLS } from "./URLs";
import { Team, CreateTeamDto, UpdateTeamDto } from "./team.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const teamRequests = {
  getAll: async (): Promise<Team[]> => {
    const res = await fetch(URLS.teams, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch teams");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Team> => {
    const res = await fetch(URLS.team(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch team");
    return res.json();
  },

  create: async (data: CreateTeamDto): Promise<Team> => {
    const res = await fetch(URLS.teams, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create team");
    return res.json();
  },

  update: async (id: string, data: UpdateTeamDto): Promise<Team> => {
    const res = await fetch(URLS.team(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update team");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.team(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete team");
  },
};
