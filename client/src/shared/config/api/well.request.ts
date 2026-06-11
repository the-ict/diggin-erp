import { URLS } from "./URLs";
import { Well, CreateWellDto, UpdateWellDto } from "./well.model";

const headers = { "Content-Type": "application/json" };

export const wellRequests = {
  getAll: async (): Promise<Well[]> => {
    const res = await fetch(URLS.wells);
    if (!res.ok) throw new Error("Failed to fetch wells");
    return res.json();
  },

  getOne: async (id: string): Promise<Well> => {
    const res = await fetch(URLS.well(id));
    if (!res.ok) throw new Error("Failed to fetch well");
    return res.json();
  },

  create: async (data: CreateWellDto): Promise<Well> => {
    const res = await fetch(URLS.wells, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create well");
    return res.json();
  },

  update: async (id: string, data: UpdateWellDto): Promise<Well> => {
    const res = await fetch(URLS.well(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update well");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.well(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete well");
  },
};
