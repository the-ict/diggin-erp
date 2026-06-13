import { URLS } from "./URLs";
import { Well, CreateWellDto, UpdateWellDto } from "./well.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const wellRequests = {
  getAll: async (): Promise<Well[]> => {
    const res = await fetch(URLS.wells, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch wells");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Well> => {
    const res = await fetch(URLS.well(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch well");
    return res.json();
  },

  create: async (data: CreateWellDto): Promise<Well> => {
    const res = await fetch(URLS.wells, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create well");
    return res.json();
  },

  update: async (id: string, data: UpdateWellDto): Promise<Well> => {
    const res = await fetch(URLS.well(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update well");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.well(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete well");
  },
};
