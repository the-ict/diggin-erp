import { URLS } from "./URLs";
import { Purchase, CreatePurchaseDto, UpdatePurchaseDto } from "./purchase.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const purchaseRequests = {
  getAll: async (): Promise<{
    success: boolean;
    data: Purchase[];
  }> => {
    const res = await fetch(URLS.purchases, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch purchases");
    return res.json();
  },

  getOne: async (id: string): Promise<Purchase> => {
    const res = await fetch(URLS.purchase(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch purchase");
    return res.json();
  },

  create: async (data: CreatePurchaseDto): Promise<Purchase> => {
    const res = await fetch(URLS.purchases, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create purchase");
    return res.json();
  },

  update: async (id: string, data: UpdatePurchaseDto): Promise<Purchase> => {
    const res = await fetch(URLS.purchase(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update purchase");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.purchase(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete purchase");
  },
};
