import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brigadesApi, Brigade } from '../config/api/brigades';

export const useBrigades = () => {
  return useQuery({
    queryKey: ['brigades'],
    queryFn: brigadesApi.getAll,
  });
};

export const useBrigade = (id: string) => {
  return useQuery({
    queryKey: ['brigades', id],
    queryFn: () => brigadesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBrigade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brigadesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brigades'] });
    },
  });
};

export const useUpdateBrigade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brigade> }) =>
      brigadesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brigades'] });
    },
  });
};

export const useDeleteBrigade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brigadesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brigades'] });
    },
  });
};
