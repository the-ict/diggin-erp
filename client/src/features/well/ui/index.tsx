"use client";

import { useState } from "react";
import {  MoreVertical, Plus } from "lucide-react";
import { useWells, useCreateWell, useUpdateWell, useDeleteWell } from "@/shared/lib/hooks/use-wells";
import { useTeams } from "@/shared/lib/hooks/use-teams";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Well, WellStatus } from "@/shared/config/api/well.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function WellPage() {
  const { data: wells, isLoading } = useWells();
  const { data: teams } = useTeams();
  const createWell = useCreateWell();
  const updateWell = useUpdateWell();
  const deleteWell = useDeleteWell();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWell, setEditingWell] = useState<Well | null>(null);
  const [newWell, setNewWell] = useState({ team: "", length: 0, except_length: 0, status: "DUGGING" as WellStatus });

  const filteredWells = Array.isArray(wells) ? wells.filter(well => 
    filterStatus === "ALL" || well.status === filterStatus
  ) : [];

  const statuses: (WellStatus | "ALL")[] = ["ALL", "DUGGING", "FINISHED", "SUCCESSFUL", "FAILED"];

  const statusLabels: Record<WellStatus | "ALL", string> = {
    "ALL": "Ҳаммаси",
    "DUGGING": "Қазилмоқда",
    "FINISHED": "Тугалланган",
    "SUCCESSFUL": "Мувваффақиятли",
    "FAILED": "Мувваффақиятсиз"
  };

  const handleAddWell = async () => {
    try {
      await createWell.mutateAsync({ ...newWell, length: 0 });
      setIsAddModalOpen(false);
      setNewWell({ team: "", length: 0, except_length: 0, status: "DUGGING" });
    } catch (error) {
      console.error("Failed to add well:", error);
    }
  };

  const handleEditWell = (well: Well) => {
    setEditingWell(well);
    setNewWell({ team: well.team, length: well.length, except_length: well.except_length, status: well.status });
    setIsEditModalOpen(true);
  };

  const handleUpdateWell = async () => {
    if (!editingWell) return;
    try {
      await updateWell.mutateAsync({ id: editingWell._id, data: newWell });
      setIsEditModalOpen(false);
      setEditingWell(null);
      setNewWell({ team: "", length: 0, except_length: 0, status: "DUGGING" });
    } catch (error) {
      console.error("Failed to update well:", error);
    }
  };

  const handleDeleteWell = async (well: Well) => {
    if (!confirm(`${well.team} жамоасидаги қудуқни ўчирмоқчимисиз?`)) return;
    try {
      await deleteWell.mutateAsync(well._id);
    } catch (error) {
      console.error("Failed to delete well:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Қудуқлар</h1>
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Қудуқлар</h1>
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Янги қудуқ қўшиш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Жамоа</label>
                <select
                  value={newWell.team}
                  onChange={(e) => setNewWell({ ...newWell, team: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Жамоани танланг</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Кутилаётган узунлик (м)</label>
                <Input
                  value={newWell.except_length}
                  onChange={(e) => setNewWell({ ...newWell, except_length: Number(e.target.value) })}
                  placeholder="Кутилаётган узунликни киритинг"
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ҳолати</label>
                <select
                  value={newWell.status}
                  onChange={(e) => setNewWell({ ...newWell, status: e.target.value as WellStatus })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="DUGGING">Қазилмоқда</option>
                  <option value="FINISHED">Тугалланган</option>
                  <option value="SUCCESSFUL">Мувваффақиятли</option>
                  <option value="FAILED">Мувваффақиятсиз</option>
                </select>
              </div>
              <Button onClick={handleAddWell} className="w-full">
                Қўшиш
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Well Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Қудуқни таҳрирлаш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Жамоа</label>
                <select
                  value={newWell.team}
                  onChange={(e) => setNewWell({ ...newWell, team: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Жамоани танланг</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Кутилаётган узунлик (м)</label>
                <Input
                  value={newWell.except_length}
                  onChange={(e) => setNewWell({ ...newWell, except_length: Number(e.target.value) })}
                  placeholder="Кутилаётган узунликни киритинг"
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ҳолати</label>
                <select
                  value={newWell.status}
                  onChange={(e) => setNewWell({ ...newWell, status: e.target.value as WellStatus })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="DUGGING">Қазилмоқда</option>
                  <option value="FINISHED">Тугалланган</option>
                  <option value="SUCCESSFUL">Мувваффақиятли</option>
                  <option value="FAILED">Мувваффақиятсиз</option>
                </select>
              </div>
              <Button onClick={handleUpdateWell} className="w-full">
                Сақлаш
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

      {/* Wells Table */}
      {filteredWells && filteredWells.length > 0 ? (
        <div className="border py-5 border-gray-200 bg-gray-50 rounded-xl overflow-x-auto shadow-sm">
          <table className="overflow-x-auto w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">Jamoa</th>
                <th className="pb-3 text-left px-6">Кутилаётган узунлик</th>
                <th className="pb-3 text-left px-6">Status</th>
                <th className="pb-3 text-right px-6">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredWells.map((well: Well) => {
                const team = Array.isArray(teams) ? teams.find(t => t._id === well.team) : undefined;
                return (
                  <tr key={well._id} className="border-b border-gray-100 hover:bg-gray-100">
                    <td className="py-3.5 text-sm text-gray-900 px-6">{team?.name ?? well.team}</td>
                    <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{well.except_length}m</td>
                    <td className="py-3.5 px-6"><StatusBadge status={well.status} /></td>
                    <td className="py-3.5 text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditWell(well)}>Таҳрирлаш</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteWell(well)}>Ўчириш</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Quduqlar topilmadi"
          description="Hozircha hech qanday quduq qo'shilmagan"
        />
      )}
    </div>
  );
}
