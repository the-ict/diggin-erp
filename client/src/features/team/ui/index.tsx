"use client";

import { useState, useEffect } from "react";
import { Users, Truck, MoreVertical, Plus } from "lucide-react";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from "@/shared/lib/hooks/use-teams";
import { useWorkers } from "@/shared/lib/hooks/use-workers";
import { useMachines } from "@/shared/lib/hooks/use-machines";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Team } from "@/shared/config/api/team.model";
import { Worker } from "@/shared/config/api/worker.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useTranslations } from "next-intl";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const t = useTranslations("Teams");
  const tCommon = useTranslations("Common");
  const tWorkers = useTranslations("Workers");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: workers } = useWorkers();
  const { data: machines } = useMachines();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({ name: "", workersIds: [] as string[], machine: "", wells: [] as string[] });

  const handleAddTeam = async () => {
    try {
      await createTeam.mutateAsync(newTeam);
      setIsAddModalOpen(false);
      setNewTeam({ name: "", workersIds: [], machine: "", wells: [] });
    } catch (error) {
      console.error("Failed to add team:", error);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setNewTeam({ name: team.name, workersIds: team.workersIds, machine: team.machine, wells: team.wells });
    setIsEditModalOpen(true);
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;
    try {
      await updateTeam.mutateAsync({ id: editingTeam._id, data: newTeam });
      setIsEditModalOpen(false);
      setEditingTeam(null);
      setNewTeam({ name: "", workersIds: [], machine: "", wells: [] });
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleDeleteTeam = async (team: Team) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteTeam.mutateAsync(team._id);
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  if (teamsLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>{t("addTeam")}</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("addTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("name")}</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder={t("placeholderName")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("machine")}</label>
                <select
                  value={newTeam.machine}
                  onChange={(e) => setNewTeam({ ...newTeam, machine: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectMachine")}</option>
                  {Array.isArray(machines) && machines.map(machine => (
                    <option key={machine._id} value={machine._id}>{machine.number}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddTeam} className="w-full">
                {tCommon("add")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Team Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("editTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("name")}</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder={t("placeholderName")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("machine")}</label>
                <select
                  value={newTeam.machine}
                  onChange={(e) => setNewTeam({ ...newTeam, machine: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectMachine")}</option>
                  {Array.isArray(machines) && machines.map(machine => (
                    <option key={machine._id} value={machine._id}>{machine.number}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleUpdateTeam} className="w-full">
                {tCommon("save")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {Array.isArray(teams) && teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team: Team) => {
            const teamWorkers = Array.isArray(workers) ? workers.filter(w => team.workersIds.includes(w._id)) : [];
            const teamMachine = Array.isArray(machines) ? machines.find(m => m._id === team.machine) : undefined;

            return (
              <div key={team._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                    <p className="text-xs text-gray-500">
                      {team.workersIds.length} {tWorkers("team").toLowerCase()} · {team.wells.length} quduq
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditTeam(team)}>{tCommon("edit")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTeam(team)}>{tCommon("delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Machine */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{teamMachine?.number ?? "Mashina yo'q"}</span>
                  {teamMachine && <StatusBadge status={teamMachine.status} />}
                </div>

                {/* Workers */}
                <div className="grid grid-cols-2 gap-2">
                  {teamWorkers.slice(0, 4).map((worker: Worker) => (
                    <div key={worker._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center text-xs text-indigo-600">
                        {worker.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{worker.name}</p>
                        <p className="text-xs text-gray-500">{tWorkers(`positions.${worker.position}`)}</p>
                      </div>
                    </div>
                  ))}
                  {teamWorkers.length === 0 && (
                    <p className="text-xs text-gray-500 col-span-2">Ishchilar yo'q</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={tCommon("empty")}
          description=""
        />
      )}
    </div>
  );
}
