const BASE_URL = "http://localhost:5000/api";

export const URLS = {
  workers: `${BASE_URL}/workers`,
  worker: (id: string) => `${BASE_URL}/workers/${id}`,
  
  teams: `${BASE_URL}/teams`,
  team: (id: string) => `${BASE_URL}/teams/${id}`,
  
  machines: `${BASE_URL}/machines`,
  machine: (id: string) => `${BASE_URL}/machines/${id}`,
  
  wells: `${BASE_URL}/wells`,
  well: (id: string) => `${BASE_URL}/wells/${id}`,
  
  wareItems: `${BASE_URL}/ware-items`,
  wareItem: (id: string) => `${BASE_URL}/ware-items/${id}`,
  
  wareTransactions: `${BASE_URL}/ware-transactions`,
  wareTransaction: (id: string) => `${BASE_URL}/ware-transactions/${id}`,
  
  purchases: `${BASE_URL}/purchases`,
  purchase: (id: string) => `${BASE_URL}/purchases/${id}`,
  
  transactions: `${BASE_URL}/transactions`,
  transaction: (id: string) => `${BASE_URL}/transactions/${id}`,
};
