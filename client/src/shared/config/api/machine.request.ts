import { URLS } from "./URLs";
import { Machine, CreateMachineDto, UpdateMachineDto } from "./machine.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const machineRequests = {
  getAll: async (): Promise<Machine[]> => {
    const res = await fetch(URLS.machines, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch machines");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Machine> => {
    const res = await fetch(URLS.machine(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch machine");
    return res.json();
  },

  create: async (data: CreateMachineDto): Promise<Machine> => {
    const res = await fetch(URLS.machines, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create machine");
    return res.json();
  },

  update: async (id: string, data: UpdateMachineDto): Promise<Machine> => {
    const res = await fetch(URLS.machine(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update machine");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.machine(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete machine");
  },
};
