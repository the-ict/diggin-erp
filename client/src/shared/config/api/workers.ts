import api from './client';

export interface Worker {
  _id: string;
  fullName: string;
  phone: string;
  position: string;
  brigadeId?: string | null;
  status: 'active' | 'inactive' | 'vacation';
  createdAt: string;
  updatedAt: string;
}

export const workersApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Worker[] }>('/workers');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Worker }>(`/workers/${id}`);
    return response.data.data;
  },
  
  create: async (data: Omit<Worker, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Worker }>('/workers', data);
    return response.data.data;
  },
  
  update: async (id: string, data: Partial<Worker>) => {
    const response = await api.put<{ success: boolean; data: Worker }>(`/workers/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Worker }>(`/workers/${id}`);
    return response.data.data;
  },
  
  assignToBrigade: async (id: string, brigadeId: string) => {
    const response = await api.post<{ success: boolean; data: Worker }>(`/workers/${id}/assign-brigade`, { brigadeId });
    return response.data.data;
  },
  
  removeFromBrigade: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Worker }>(`/workers/${id}/brigade`);
    return response.data.data;
  },
};
