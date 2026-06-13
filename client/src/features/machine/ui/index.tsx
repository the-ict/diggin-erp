"use client";

import { useState, useEffect } from "react";
import { Truck, MoreVertical, Plus, AlertCircle } from "lucide-react";
import { useMachines, useCreateMachine, useUpdateMachine, useDeleteMachine } from "@/shared/lib/hooks/use-machines";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Machine, MachineStatus } from "@/shared/config/api/machine.model";
import { useTeams } from "@/shared/lib/hooks/use-teams";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useTranslations } from "next-intl";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function MachinePage() {
  const t = useTranslations("Machines");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Call ALL hooks before any early returns
  const { data: machines, isLoading } = useMachines();
  const { data: teams } = useTeams();
  const createMachine = useCreateMachine();
  const updateMachine = useUpdateMachine();
  const deleteMachine = useDeleteMachine();

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({ number: "", status: "ACTIVE" as MachineStatus, teamId: "", wells: [] as string[] });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

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

  const filteredMachines = Array.isArray(machines) ? machines.filter(machine =>
    filterStatus === "ALL" || machine.status === filterStatus
  ) : [];

  const statuses: (MachineStatus | "ALL")[] = ["ALL", "ACTIVE", "REPAIRING"];

  const handleAddMachine = async () => {
    try {
      await createMachine.mutateAsync(newMachine);
      setIsAddModalOpen(false);
      setNewMachine({ number: "", status: "ACTIVE", teamId: "", wells: [] });
    } catch (error) {
      console.error("Failed to add machine:", error);
    }
  };

  const handleUpdateMachine = async () => {
    if(!editingMachine) return;
    try {
      await updateMachine.mutateAsync({ id: editingMachine._id, data: newMachine });
      setIsEditModalOpen(false);
      setEditingMachine(null);
      setNewMachine({ number: "", status: "ACTIVE", teamId: "", wells: [] });
    } catch (error) {
      console.log("Failed to update machine:", error);
    };
  };

  const handleDeleteMachine = async (machine: Machine) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteMachine.mutateAsync(machine._id);
      setEditingMachine(null);
      setIsEditModalOpen(false);
      setNewMachine({ number: "", status: "ACTIVE", teamId: "", wells: [] });
    } catch (error) {
      console.log("Failed to delete machine:", error);
    };
  }

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
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
              <span>{tCommon("add")}</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("addTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("number")}</label>
                <Input
                  value={newMachine.number}
                  onChange={(e) => setNewMachine({ ...newMachine, number: e.target.value })}
                  placeholder={t("placeholderNumber")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("team")}</label>
                <select
                  value={newMachine.teamId}
                  onChange={(e) => setNewMachine({ ...newMachine, teamId: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectTeam")}</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("status")}</label>
                <select
                  value={newMachine.status}
                  onChange={(e) => setNewMachine({ ...newMachine, status: e.target.value as MachineStatus })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="ACTIVE">{t("statuses.ACTIVE")}</option>
                  <option value="REPAIRING">{t("statuses.REPAIRING")}</option>
                </select>
              </div>
              <Button onClick={handleAddMachine} className="w-full">
                {tCommon("add")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Machine Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("editTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("number")}</label>
                <Input
                  type="text"
                  value={newMachine.number}
                  onChange={(e) => setNewMachine({ ...newMachine, number: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("status")}</label>
                <select
                  value={newMachine.status}
                  onChange={(e) => setNewMachine({ ...newMachine, status: e.target.value as MachineStatus })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="ACTIVE">{t("statuses.ACTIVE")}</option>
                  <option value="REPAIRING">{t("statuses.REPAIRING")}</option>
                </select>
              </div>
              <Button onClick={handleUpdateMachine} className="w-full">
                {tCommon("save")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
              ? "bg-indigo-500 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {status === "ALL" ? t("all") : t(`statuses.${status}`)}
          </button>
        ))}
      </div>

      {/* Machines Grid */}
      {filteredMachines && filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((machine: Machine) => {
            const team = Array.isArray(teams) ? teams.find(t => t._id === machine.teamId) : undefined;
            return (
              <div key={machine._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gray-500" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setIsEditModalOpen(true);
                        setEditingMachine(machine);
                        setNewMachine({
                          number: machine.number,
                          status: machine.status,
                          teamId: machine.teamId,
                          wells: machine.wells,
                        } as any);
                      }}>{tCommon("edit")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMachine(machine)}>{tCommon("delete")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-mono text-xl font-semibold text-gray-900 mt-3">{machine.number}</h3>
                <StatusBadge status={machine.status} className="mt-2" />
                <div className="mt-4 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t("wellsCount", { count: machine.wells.length })}</span>
                  </div>
                  <div className="mt-1">{team?.name ?? "Jamoa yo'q"}</div>
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
