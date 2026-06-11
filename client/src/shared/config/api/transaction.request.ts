import { URLS } from "./URLs";
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from "./transaction.model";

const headers = { "Content-Type": "application/json" };

export const transactionRequests = {
  getAll: async (): Promise<Transaction[]> => {
    const res = await fetch(URLS.transactions);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  },

  getOne: async (id: string): Promise<Transaction> => {
    const res = await fetch(URLS.transaction(id));
    if (!res.ok) throw new Error("Failed to fetch transaction");
    return res.json();
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const res = await fetch(URLS.transactions, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create transaction");
    return res.json();
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const res = await fetch(URLS.transaction(id), {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update transaction");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(URLS.transaction(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete transaction");
  },
};
