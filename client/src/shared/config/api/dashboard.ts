import api from './client';

export interface KPIs {
  activeWells: number;
  activeMachines: number;
  totalDrilledMeters: number;
  totalWorkers: number;
  totalBrigades: number;
  lowStockItems: number;
}

export interface Activity {
  type: string;
  action: string;
  description: string;
  timestamp: Date;
}

export const dashboardApi = {
  getKPIs: async () => {
    const response = await api.get<{ success: boolean; data: KPIs }>('/dashboard/kpis');
    return response.data.data;
  },
  
  getActivity: async (limit: number = 10) => {
    const response = await api.get<{ success: boolean; data: Activity[] }>(`/dashboard/activity?limit=${limit}`);
    return response.data.data;
  },
};
