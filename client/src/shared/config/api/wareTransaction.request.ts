import { URLS } from "./URLs";
import { WareTransaction, CreateWareTransactionDto, UpdateWareTransactionDto } from "./wareTransaction.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const wareTransactionRequests = {
  getAll: async (): Promise<WareTransaction[]> => {
    const res = await fetch(URLS.wareTransactions, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch ware transactions");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<WareTransaction> => {
    const res = await fetch(URLS.wareTransaction(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch ware transaction");
    return res.json();
  },

  create: async (data: CreateWareTransactionDto): Promise<WareTransaction> => {
    const res = await fetch(URLS.wareTransactions, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create ware transaction");
    return res.json();
  },

  update: async (id: string, data: UpdateWareTransactionDto): Promise<WareTransaction> => {
    const res = await fetch(URLS.wareTransaction(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update ware transaction");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.wareTransaction(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete ware transaction");
  },
};
