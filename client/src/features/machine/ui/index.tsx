"use client";

import { useState } from "react";
import { Truck, MoreVertical, Plus, AlertCircle } from "lucide-react";
import { useMachines, useCreateMachine } from "@/shared/lib/hooks/use-machines";
import { useTeams } from "@/shared/lib/hooks/use-teams";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Machine, MachineStatus } from "@/shared/config/api/machine.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function MachinePage() {
  const { data: machines, isLoading } = useMachines();
  const { data: teams } = useTeams();
  const createMachine = useCreateMachine();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({ number: "", status: "ACTIVE" as MachineStatus, teamId: "", wells: [] as string[] });

  const filteredMachines = Array.isArray(machines) ? machines.filter(machine => 
    filterStatus === "ALL" || machine.status === filterStatus
  ) : [];

  const statuses: (MachineStatus | "ALL")[] = ["ALL", "ACTIVE", "REPAIRING"];

  const statusLabels: Record<MachineStatus | "ALL", string> = {
    "ALL": "Ҳаммаси",
    "ACTIVE": "Фаол",
    "REPAIRING": "Таъмирда"
  };

  const handleAddMachine = async () => {
    try {
      await createMachine.mutateAsync(newMachine);
      setIsAddModalOpen(false);
      setNewMachine({ number: "", status: "ACTIVE", teamId: "", wells: [] });
    } catch (error) {
      console.error("Failed to add machine:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Машиналар</h1>
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Машиналар</h1>
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Янги машина қўшиш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Машина рақами</label>
                <Input
                  value={newMachine.number}
                  onChange={(e) => setNewMachine({ ...newMachine, number: e.target.value })}
                  placeholder="Машина рақамини киритинг"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Жамоа</label>
                <select
                  value={newMachine.teamId}
                  onChange={(e) => setNewMachine({ ...newMachine, teamId: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Жамоани танланг</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ҳолати</label>
                <select
                  value={newMachine.status}
                  onChange={(e) => setNewMachine({ ...newMachine, status: e.target.value as MachineStatus })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="ACTIVE">Фаол</option>
                  <option value="REPAIRING">Таъмирда</option>
                </select>
              </div>
              <Button onClick={handleAddMachine} className="w-full">
                Қўшиш
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-indigo-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {statusLabels[status]}
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
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-mono text-xl font-semibold text-gray-900 mt-3">{machine.number}</h3>
                <StatusBadge status={machine.status} className="mt-2" />
                <div className="mt-4 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{machine.wells.length} ta quduq qazilgan</span>
                  </div>
                  <div className="mt-1">{team?.name ?? "Jamoa yo'q"}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Mashinalar topilmadi"
          description="Hozircha hech qanday mashina qo'shilmagan"
        />
      )}
    </div>
  );
}
