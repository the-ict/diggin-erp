"use client";

import { useState, useEffect } from "react";
import { Phone, MoreVertical, Plus } from "lucide-react";
import { useWorkers, useCreateWorker, useUpdateWorker, useDeleteWorker } from "@/shared/lib/hooks/use-workers";
import { useTeams } from "@/shared/lib/hooks/use-teams";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Worker, WorkerPosition } from "@/shared/config/api/worker.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useTranslations } from "next-intl";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function WorkerPage() {
  const t = useTranslations("Workers");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Call ALL hooks before any early returns
  const { data: workers, isLoading } = useWorkers();
  const { data: teams } = useTeams();
  const createWorker = useCreateWorker();
  const updateWorker = useUpdateWorker();
  const deleteWorker = useDeleteWorker();

  const [filterPosition, setFilterPosition] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [newWorker, setNewWorker] = useState({ name: "", phone: "", position: "WORKER" as WorkerPosition, teamId: "" });

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

  const filteredWorkers = Array.isArray(workers) ? workers.filter(worker => 
    filterPosition === "ALL" || worker.position === filterPosition
  ) : [];

  const positions: (WorkerPosition | "ALL")[] = ["ALL", "DRIVER", "OPERATOR", "WORKER", "SUPERVISOR", "MASTER"];

  const handleAddWorker = async () => {
    try {
      await createWorker.mutateAsync(newWorker);
      setIsAddModalOpen(false);
      setNewWorker({ name: "", phone: "", position: "WORKER", teamId: "" });
    } catch (error) {
      console.error("Failed to add worker:", error);
    }
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setNewWorker({ name: worker.name, phone: worker.phone, position: worker.position, teamId: worker.teamId });
    setIsEditModalOpen(true);
  };

  const handleUpdateWorker = async () => {
    if (!editingWorker) return;
    try {
      await updateWorker.mutateAsync({ id: editingWorker._id, data: newWorker });
      setIsEditModalOpen(false);
      setEditingWorker(null);
      setNewWorker({ name: "", phone: "", position: "WORKER", teamId: "" });
    } catch (error) {
      console.error("Failed to update worker:", error);
    }
  };

  const handleDeleteWorker = async (worker: Worker) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteWorker.mutateAsync(worker._id);
    } catch (error) {
      console.error("Failed to delete worker:", error);
    }
  };

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
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("name")}</label>
                <Input
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  placeholder={t("placeholderName")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("phone")}</label>
                <Input
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                  placeholder={t("placeholderPhone")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("team")}</label>
                <select
                  value={newWorker.teamId}
                  onChange={(e) => setNewWorker({ ...newWorker, teamId: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectTeam")}</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("position")}</label>
                <select
                  value={newWorker.position}
                  onChange={(e) => setNewWorker({ ...newWorker, position: e.target.value as WorkerPosition })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {positions.filter(pos => pos !== "ALL").map(pos => (
                    <option key={pos} value={pos}>{t(`positions.${pos}`)}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddWorker} className="w-full">
                {tCommon("add")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Worker Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("editTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("name")}</label>
                <Input
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  placeholder={t("placeholderName")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("phone")}</label>
                <Input
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                  placeholder={t("placeholderPhone")}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("team")}</label>
                <select
                  value={newWorker.teamId}
                  onChange={(e) => setNewWorker({ ...newWorker, teamId: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectTeam")}</option>
                  {Array.isArray(teams) && teams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("position")}</label>
                <select
                  value={newWorker.position}
                  onChange={(e) => setNewWorker({ ...newWorker, position: e.target.value as WorkerPosition })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {positions.filter(pos => pos !== "ALL").map(pos => (
                    <option key={pos} value={pos}>{t(`positions.${pos}`)}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleUpdateWorker} className="w-full">
                {tCommon("save")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Position Filter */}
      <div className="flex items-center gap-2">
        {positions.map((position) => (
          <button
            key={position}
            onClick={() => setFilterPosition(position)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterPosition === position
                ? "bg-indigo-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {position === "ALL" ? t("all") : t(`positions.${position}`)}
          </button>
        ))}
      </div>

      {/* Workers Grid */}
      {filteredWorkers && filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((worker: Worker) => (
            <div key={worker._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-600">
                    {worker.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditWorker(worker)}>{tCommon("edit")}</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteWorker(worker)}>{tCommon("delete")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{worker.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-600 border-indigo-200">
                {t(`positions.${worker.position}`)}
              </span>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <Phone className="w-3.5 h-3.5" />
                {worker.phone}
              </div>
            </div>
          ))}
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