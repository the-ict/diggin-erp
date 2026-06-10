import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wellsApi, Well } from '../config/api/wells';

export const useWells = () => {
  return useQuery({
    queryKey: ['wells'],
    queryFn: wellsApi.getAll,
  });
};

export const useWell = (id: string) => {
  return useQuery({
    queryKey: ['wells', id],
    queryFn: () => wellsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateWell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wellsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
    },
  });
};

export const useUpdateWell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Well> }) =>
      wellsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
    },
  });
};

export const useDeleteWell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: wellsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wells'] });
    },
  });
};
