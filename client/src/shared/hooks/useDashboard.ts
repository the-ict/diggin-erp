import { useQuery } from '@tanstack/react-query';
import { dashboardApi, KPIs, Activity } from '../config/api/dashboard';

export const useKPIs = () => {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: dashboardApi.getKPIs,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => dashboardApi.getActivity(limit),
    refetchInterval: 60000, // Refetch every minute
  });
};
