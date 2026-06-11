import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseRequests } from "@/shared/config/api/purchase.request";
import { CreatePurchaseDto, UpdatePurchaseDto } from "@/shared/config/api/purchase.model";

export const PURCHASE_KEYS = {
  all: ["purchases"] as const,
  one: (id: string) => ["purchases", id] as const,
};

export function usePurchases() {
  return useQuery({ queryKey: PURCHASE_KEYS.all, queryFn: purchaseRequests.getAll });
}

export function usePurchase(id: string) {
  return useQuery({ queryKey: PURCHASE_KEYS.one(id), queryFn: () => purchaseRequests.getOne(id) });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: purchaseRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: PURCHASE_KEYS.all }),
  });
}

export function useUpdatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseDto }) =>
      purchaseRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PURCHASE_KEYS.all }),
  });
}

export function useDeletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: purchaseRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: PURCHASE_KEYS.all }),
  });
}
