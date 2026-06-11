import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wellRequests } from "@/shared/config/api/well.request";
import { CreateWellDto, UpdateWellDto } from "@/shared/config/api/well.model";

export const WELL_KEYS = {
  all: ["wells"] as const,
  one: (id: string) => ["wells", id] as const,
};

export function useWells() {
  return useQuery({ queryKey: WELL_KEYS.all, queryFn: wellRequests.getAll });
}

export function useWell(id: string) {
  return useQuery({ queryKey: WELL_KEYS.one(id), queryFn: () => wellRequests.getOne(id) });
}

export function useCreateWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wellRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: WELL_KEYS.all }),
  });
}

export function useUpdateWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWellDto }) =>
      wellRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WELL_KEYS.all }),
  });
}

export function useDeleteWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wellRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: WELL_KEYS.all }),
  });
}
