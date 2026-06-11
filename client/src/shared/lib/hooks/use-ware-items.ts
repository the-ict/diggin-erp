import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wareItemRequests } from "@/shared/config/api/wareItem.request";
import { CreateWareItemDto, UpdateWareItemDto } from "@/shared/config/api/wareItem.model";

export const WARE_ITEM_KEYS = {
  all: ["wareItems"] as const,
  one: (id: string) => ["wareItems", id] as const,
};

export function useWareItems() {
  return useQuery({ queryKey: WARE_ITEM_KEYS.all, queryFn: wareItemRequests.getAll });
}

export function useWareItem(id: string) {
  return useQuery({ queryKey: WARE_ITEM_KEYS.one(id), queryFn: () => wareItemRequests.getOne(id) });
}

export function useCreateWareItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wareItemRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_ITEM_KEYS.all }),
  });
}

export function useUpdateWareItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWareItemDto }) =>
      wareItemRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_ITEM_KEYS.all }),
  });
}

export function useDeleteWareItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wareItemRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: WARE_ITEM_KEYS.all }),
  });
}
