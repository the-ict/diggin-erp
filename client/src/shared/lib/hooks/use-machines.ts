import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { machineRequests } from "@/shared/config/api/machine.request";
import { CreateMachineDto, UpdateMachineDto } from "@/shared/config/api/machine.model";

export const MACHINE_KEYS = {
  all: ["machines"] as const,
  one: (id: string) => ["machines", id] as const,
};

export function useMachines() {
  return useQuery({ queryKey: MACHINE_KEYS.all, queryFn: machineRequests.getAll });
}

export function useMachine(id: string) {
  return useQuery({ queryKey: MACHINE_KEYS.one(id), queryFn: () => machineRequests.getOne(id) });
}

export function useCreateMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: machineRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: MACHINE_KEYS.all }),
  });
}

export function useUpdateMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMachineDto }) =>
      machineRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MACHINE_KEYS.all }),
  });
}

export function useDeleteMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: machineRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: MACHINE_KEYS.all }),
  });
}
