import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionRequests } from "@/shared/config/api/transaction.request";
import { CreateTransactionDto, UpdateTransactionDto } from "@/shared/config/api/transaction.model";

export const TRANSACTION_KEYS = {
  all: ["transactions"] as const,
  one: (id: string) => ["transactions", id] as const,
};

export function useTransactions() {
  return useQuery({ queryKey: TRANSACTION_KEYS.all, queryFn: transactionRequests.getAll });
}

export function useTransaction(id: string) {
  return useQuery({ queryKey: TRANSACTION_KEYS.one(id), queryFn: () => transactionRequests.getOne(id) });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: TRANSACTION_KEYS.all }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TRANSACTION_KEYS.all }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: transactionRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: TRANSACTION_KEYS.all }),
  });
}
