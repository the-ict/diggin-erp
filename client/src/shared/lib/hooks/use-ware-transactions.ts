import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wareTransactionRequests } from "@/shared/config/api/wareTransaction.request";
import { CreateWareTransactionDto, UpdateWareTransactionDto } from "@/shared/config/api/wareTransaction.model";

export const WARE_TRANSACTION_KEYS = {
  all: ["wareTransactions"] as const,
  one: (id: string) => ["wareTransactions", id] as const,
};

export function useWareTransactions() {
  return useQuery({ queryKey: WARE_TRANSACTION_KEYS.all, queryFn: wareTransactionRequests.getAll });
}

export function useWareTransaction(id: string) {
  return useQuery({ queryKey: WARE_TRANSACTION_KEYS.one(id), queryFn: () => wareTransactionRequests.getOne(id) });
}

export function useCreateWareTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wareTransactionRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_TRANSACTION_KEYS.all }),
  });
}

export function useUpdateWareTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWareTransactionDto }) =>
      wareTransactionRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_TRANSACTION_KEYS.all }),
  });
}

export function useDeleteWareTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wareTransactionRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_TRANSACTION_KEYS.all }),
  });
}
