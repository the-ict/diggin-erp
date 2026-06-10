import api from './client';

export interface Well {
  _id: string;
  code: string;
  location: string;
  plannedDepth: number;
  actualDepth: number;
  status: 'active' | 'planned' | 'completed';
  startDate?: Date | null;
  endDate?: Date | null;
  machineId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const wellsApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Well[] }>('/wells');
    return response.data.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Well }>(`/wells/${id}`);
    return response.data.data;
  },
  
  create: async (data: Omit<Well, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Well }>('/wells', data);
    return response.data.data;
  },
  
  update: async (id: string, data: Partial<Well>) => {
    const response = await api.put<{ success: boolean; data: Well }>(`/wells/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; data: Well }>(`/wells/${id}`);
    return response.data.data;
  },
};
