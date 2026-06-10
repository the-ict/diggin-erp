import api from './client';

export interface Machine {
  _id: string;
  name: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'idle';
  currentWell?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const machinesApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Machine[] }>('/machines');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Machine }>(`/machines/${id}`);
    return response.data.data;
  },
  
  create: async (data: Omit<Machine, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Machine }>('/machines', data);
    return response.data.data;
  },
  
  update: async (id: string, data: Partial<Machine>) => {
    const response = await api.put<{ success: boolean; data: Machine }>(`/machines/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Machine }>(`/machines/${id}`);
    return response.data.data;
  },
};
