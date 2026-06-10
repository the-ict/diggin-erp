import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesApi, Purchase } from '../config/api/purchases';

export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: purchasesApi.getAll,
  });
};

export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchasesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchasesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Purchase> }) =>
      purchasesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchasesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};
