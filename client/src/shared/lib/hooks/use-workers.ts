import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workerRequests } from "@/shared/config/api/worker.request";
import { CreateWorkerDto, UpdateWorkerDto } from "@/shared/config/api/worker.model";

export const WORKER_KEYS = {
  all: ["workers"] as const,
  one: (id: string) => ["workers", id] as const,
};

export function useWorkers() {
  return useQuery({ queryKey: WORKER_KEYS.all, queryFn: workerRequests.getAll });
}

export function useWorker(id: string) {
  return useQuery({ queryKey: WORKER_KEYS.one(id), queryFn: () => workerRequests.getOne(id) });
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workerRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: WORKER_KEYS.all }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkerDto }) =>
      workerRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: WORKER_KEYS.all }),
  });
}

export function useDeleteWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: workerRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: WORKER_KEYS.all }),
  });
}
