import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamRequests } from "@/shared/config/api/team.request";
import { CreateTeamDto, UpdateTeamDto } from "@/shared/config/api/team.model";

export const TEAM_KEYS = {
  all: ["teams"] as const,
  one: (id: string) => ["teams", id] as const,
};

export function useTeams() {
  return useQuery({ queryKey: TEAM_KEYS.all, queryFn: teamRequests.getAll });
}

export function useTeam(id: string) {
  return useQuery({ queryKey: TEAM_KEYS.one(id), queryFn: () => teamRequests.getOne(id) });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teamRequests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEAM_KEYS.all }),
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamDto }) =>
      teamRequests.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TEAM_KEYS.all }),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teamRequests.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: TEAM_KEYS.all }),
  });
}
