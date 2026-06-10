import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workersApi, Worker } from '../config/api/workers';

export const useWorkers = () => {
  return useQuery({
    queryKey: ['workers'],
    queryFn: workersApi.getAll,
  });
};

export const useWorker = (id: string) => {
  return useQuery({
    queryKey: ['workers', id],
    queryFn: () => workersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

export const useUpdateWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Worker> }) =>
      workersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

export const useDeleteWorker = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

export const useAssignWorkerToBrigade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, brigadeId }: { id: string; brigadeId: string }) =>
      workersApi.assignToBrigade(id, brigadeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};

export const useRemoveWorkerFromBrigade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workersApi.removeFromBrigade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });
};
