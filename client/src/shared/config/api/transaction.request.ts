import { URLS } from "./URLs";
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from "./transaction.model";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const transactionRequests = {
  getAll: async (): Promise<Transaction[]> => {
    const res = await fetch(URLS.transactions, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const json = await res.json();
    return json.data || [];
  },

  getOne: async (id: string): Promise<Transaction> => {
    const res = await fetch(URLS.transaction(id), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch transaction");
    return res.json();
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const res = await fetch(URLS.transactions, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const res = await fetch(URLS.transaction(id), {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.transaction(id), {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },
};
