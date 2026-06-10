import api from './client';

export interface WarehouseItem {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseTransaction {
  _id: string;
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  note?: string | null;
  createdAt: string;
}

export const warehouseApi = {
  getAllItems: async () => {
    const response = await api.get<{ success: boolean; data: WarehouseItem[] }>('/warehouse/items');
    return response.data.data;
  },
  
  getItemById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: WarehouseItem }>(`/warehouse/items/${id}`);
    return response.data.data;
  },
  
  createItem: async (data: Omit<WarehouseItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: WarehouseItem }>('/warehouse/items', data);
    return response.data.data;
  },
  
  updateItem: async (id: string, data: Partial<WarehouseItem>) => {
    const response = await api.put<{ success: boolean; data: WarehouseItem }>(`/warehouse/items/${id}`, data);
    return response.data.data;
  },
  
  deleteItem: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: WarehouseItem }>(`/warehouse/items/${id}`);
    return response.data.data;
  },
  
  getLowStockItems: async () => {
    const response = await api.get<{ success: boolean; data: WarehouseItem[] }>('/warehouse/items/low-stock');
    return response.data.data;
  },
  
  getAllTransactions: async () => {
    const response = await api.get<{ success: boolean; data: WarehouseTransaction[] }>('/warehouse/transactions');
    return response.data.data;
  },
  
  getTransactionsByItem: async (id: string) => {
    const response = await api.get<{ success: boolean; data: WarehouseTransaction[] }>(`/warehouse/transactions/item/${id}`);
    return response.data.data;
  },
  
  createTransaction: async (data: Omit<WarehouseTransaction, '_id' | 'createdAt'>) => {
    const response = await api.post<{ success: boolean; data: WarehouseTransaction }>('/warehouse/transactions', data);
    return response.data.data;
  },
  
  deleteTransaction: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: WarehouseTransaction }>(`/warehouse/transactions/${id}`);
    return response.data.data;
  },
};
