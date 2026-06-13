import { URLS } from "./URLs";
import { WareItem, CreateWareItemDto, UpdateWareItemDto, CreateWareTransaction } from "./wareItem.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const wareItemRequests = {
  getAll: async (): Promise<WareItem[]> => {
    const res = await fetch(URLS.wareItems, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch ware items");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<WareItem> => {
    const res = await fetch(URLS.wareItem(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch ware item");
    return res.json();
  },

  create: async (data: CreateWareItemDto): Promise<WareItem> => {
    const res = await fetch(URLS.wareItems, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create ware item: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json();
  },

  update: async (id: string, data: UpdateWareItemDto): Promise<WareItem> => {
    const res = await fetch(URLS.wareItem(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update ware item");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.wareItem(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete ware item");
  },
  createTransaction: async(id:string,data: CreateWareTransaction) => {
    const res  = await fetch(URLS.wareTransaction(id), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create ware transaction");
    return res.json();
  }
};