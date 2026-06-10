import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseApi, WarehouseItem, WarehouseTransaction } from '../config/api/warehouse';

export const useWarehouseItems = () => {
  return useQuery({
    queryKey: ['warehouse', 'items'],
    queryFn: warehouseApi.getAllItems,
  });
};

export const useWarehouseItem = (id: string) => {
  return useQuery({
    queryKey: ['warehouse', 'items', id],
    queryFn: () => warehouseApi.getItemById(id),
    enabled: !!id,
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['warehouse', 'low-stock'],
    queryFn: warehouseApi.getLowStockItems,
  });
};

export const useWarehouseTransactions = () => {
  return useQuery({
    queryKey: ['warehouse', 'transactions'],
    queryFn: warehouseApi.getAllTransactions,
  });
};

export const useCreateWarehouseItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: warehouseApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
};

export const useUpdateWarehouseItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WarehouseItem> }) =>
      warehouseApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
};

export const useDeleteWarehouseItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: warehouseApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
};

export const useCreateWarehouseTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: warehouseApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse'] });
    },
  });
};
