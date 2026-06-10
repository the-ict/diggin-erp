import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machinesApi, Machine } from '../config/api/machines';

export const useMachines = () => {
  return useQuery({
    queryKey: ['machines'],
    queryFn: machinesApi.getAll,
  });
};

export const useMachine = (id: string) => {
  return useQuery({
    queryKey: ['machines', id],
    queryFn: () => machinesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateMachine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: machinesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });
};

export const useUpdateMachine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Machine> }) =>
      machinesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });
};

export const useDeleteMachine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: machinesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });
};
