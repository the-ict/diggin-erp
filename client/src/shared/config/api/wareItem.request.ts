import { URLS } from "./URLs";
import { WareItem, CreateWareItemDto, UpdateWareItemDto } from "./wareItem.model";

const headers = { "Content-Type": "application/json" };

export const wareItemRequests = {
  getAll: async (): Promise<WareItem[]> => {
    const res = await fetch(URLS.wareItems);
    if (!res.ok) throw new Error("Failed to fetch ware items");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<WareItem> => {
    const res = await fetch(URLS.wareItem(id));
    if (!res.ok) throw new Error("Failed to fetch ware item");
    return res.json();
  },

  create: async (data: CreateWareItemDto): Promise<WareItem> => {
    const res = await fetch(URLS.wareItems, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create ware item");
    return res.json();
  },

  update: async (id: string, data: UpdateWareItemDto): Promise<WareItem> => {
    const res = await fetch(URLS.wareItem(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update ware item");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.wareItem(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete ware item");
  },
};
