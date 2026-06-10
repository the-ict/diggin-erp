import api from './client';

export interface Brigade {
  _id: string;
  name: string;
  machineId?: string | null;
  workers: string[];
  createdAt: string;
  updatedAt: string;
}

export const brigadesApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Brigade[] }>('/brigades');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Brigade }>(`/brigades/${id}`);
    return response.data.data;
  },
  
  create: async (data: Omit<Brigade, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Brigade }>('/brigades', data);
    return response.data.data;
  },
  
  update: async (id: string, data: Partial<Brigade>) => {
    const response = await api.put<{ success: boolean; data: Brigade }>(`/brigades/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Brigade }>(`/brigades/${id}`);
    return response.data.data;
  },
};
