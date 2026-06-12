import { URLS } from "./URLs";
import { Worker, CreateWorkerDto, UpdateWorkerDto } from "./worker.model";

const headers = { "Content-Type": "application/json" };

export const workerRequests = {
  getAll: async (): Promise<Worker[]> => {
    const res = await fetch(URLS.workers);
    if (!res.ok) throw new Error("Failed to fetch workers");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Worker> => {
    const res = await fetch(URLS.worker(id));
    if (!res.ok) throw new Error("Failed to fetch worker");
    return res.json();
  },

  create: async (data: CreateWorkerDto): Promise<Worker> => {
    const res = await fetch(URLS.workers, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create worker");
    return res.json();
  },

  update: async (id: string, data: UpdateWorkerDto): Promise<Worker> => {
    const res = await fetch(URLS.worker(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update worker");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.worker(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete worker");
  },
};
