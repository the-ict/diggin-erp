import { URLS } from "./URLs";
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from "./purchase.model";

const headers = { "Content-Type": "application/json" };

export const purchaseRequests = {
  getAll: async (): Promise<{
    success: boolean;
    data: Purchase[];
  }> => {
    const res = await fetch(URLS.purchases);
    if (!res.ok) throw new Error("Failed to fetch purchases");
    return res.json();
  },

  getOne: async (id: string): Promise<Purchase> => {
    const res = await fetch(URLS.purchase(id));
    if (!res.ok) throw new Error("Failed to fetch purchase");
    return res.json();
  },

  create: async (data: CreatePurchaseDto): Promise<Purchase> => {
    const res = await fetch(URLS.purchases, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create purchase");
    return res.json();
  },

  update: async (id: string, data: UpdatePurchaseDto): Promise<Purchase> => {
    const res = await fetch(URLS.purchase(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update purchase");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.purchase(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete purchase");
  },
};
