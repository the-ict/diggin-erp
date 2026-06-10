import api from './client';

export interface Purchase {
  _id: string;
  itemName: string;
  quantity: number;
  price: number;
  supplier: string;
  purchaseDate: Date;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const purchasesApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Purchase[] }>('/purchases');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Purchase }>(`/purchases/${id}`);
    return response.data.data;
  },
  
  create: async (data: Omit<Purchase, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Purchase }>('/purchases', data);
    return response.data.data;
  },
  
  update: async (id: string, data: Partial<Purchase>) => {
    const response = await api.put<{ success: boolean; data: Purchase }>(`/purchases/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Purchase }>(`/purchases/${id}`);
    return response.data.data;
  },
};
