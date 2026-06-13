"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical, Plus } from "lucide-react";
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
import { useTranslations } from "next-intl";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function WellPage() {
  const t = useTranslations("Wells");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Call ALL hooks before any early returns
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

  // Construct chart data comparing expected vs actual depth
  const wellChartData = useMemo(() => {
    if (!Array.isArray(wells)) return [];
    return wells.map((well) => {
      const team = Array.isArray(teams) ? teams.find((t) => t._id === well.team) : undefined;
      return {
        name: team?.name ?? well.team,
        expected: well.except_length,
        actual: well.length,
      };
    });
  }, [wells, teams]);

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

  const filteredWells = Array.isArray(wells)
    ? wells.filter((well) => filterStatus === "ALL" || well.status === filterStatus)
    : [];

  const statuses: (WellStatus | "ALL")[] = ["ALL", "DUGGING", "FINISHED", "SUCCESSFUL", "FAILED"];

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
    setNewWell({
      team: well.team,
      length: well.length,
      except_length: well.except_length,
      status: well.status,
    });
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
    const team = Array.isArray(teams) ? teams.find((t) => t._id === well.team) : undefined;
    const teamName = team?.name ?? well.team;
    if (!confirm(tCommon("confirmDelete"))) return;
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const chartConfig = {
    expected: {
      label: t("chartExpected"),
      color: "#3b82f6",
    },
    actual: {
      label: t("chartActual"),
      color: "#10b981",
    },
  };

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
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("team")}</label>
                <select
                  value={newWell.team}
                  onChange={(e) => setNewWell({ ...newWell, team: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectTeam")}</option>
                  {Array.isArray(teams) &&
                    teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("expectedLength")} (m)
                </label>
                <Input
                  value={newWell.except_length || ""}
                  onChange={(e) => setNewWell({ ...newWell, except_length: Number(e.target.value) })}
                  placeholder={t("placeholderExpectedLength")}
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("status")}</label>
                <select
                  value={newWell.status}
                  onChange={(e) =>
                    setNewWell({ ...newWell, status: e.target.value as WellStatus })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="DUGGING">{t("statuses.DUGGING")}</option>
                  <option value="FINISHED">{t("statuses.FINISHED")}</option>
                  <option value="SUCCESSFUL">{t("statuses.SUCCESSFUL")}</option>
                  <option value="FAILED">{t("statuses.FAILED")}</option>
                </select>
              </div>
              <Button onClick={handleAddWell} className="w-full">
                {tCommon("add")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Well Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("editTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("team")}</label>
                <select
                  value={newWell.team}
                  onChange={(e) => setNewWell({ ...newWell, team: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t("selectTeam")}</option>
                  {Array.isArray(teams) &&
                    teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("expectedLength")} (m)
                </label>
                <Input
                  value={newWell.except_length || ""}
                  onChange={(e) => setNewWell({ ...newWell, except_length: Number(e.target.value) })}
                  placeholder={t("placeholderExpectedLength")}
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t("length")} (m)
                </label>
                <Input
                  value={newWell.length || ""}
                  onChange={(e) => setNewWell({ ...newWell, length: Number(e.target.value) })}
                  placeholder={t("length")}
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("status")}</label>
                <select
                  value={newWell.status}
                  onChange={(e) =>
                    setNewWell({ ...newWell, status: e.target.value as WellStatus })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="DUGGING">{t("statuses.DUGGING")}</option>
                  <option value="FINISHED">{t("statuses.FINISHED")}</option>
                  <option value="SUCCESSFUL">{t("statuses.SUCCESSFUL")}</option>
                  <option value="FAILED">{t("statuses.FAILED")}</option>
                </select>
              </div>
              <Button onClick={handleUpdateWell} className="w-full">
                {tCommon("save")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Progress Chart */}
      {wellChartData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("chartProgress")}</h2>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                data={wellChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}m`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar
                  dataKey="expected"
                  name={t("chartExpected")}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="actual" name={t("chartActual")} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto">
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
            {status === "ALL" ? tCommon("all") : t(`statuses.${status}`)}
          </button>
        ))}
      </div>

      {/* Wells Table */}
      {filteredWells && filteredWells.length > 0 ? (
        <div className="border py-5 border-gray-200 bg-gray-50 rounded-xl overflow-x-auto shadow-sm">
          <table className="overflow-x-auto w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">{t("team")}</th>
                <th className="pb-3 text-left px-6">{t("expectedLength")}</th>
                <th className="pb-3 text-left px-6">{t("length")}</th>
                <th className="pb-3 text-left px-6">{t("status")}</th>
                <th className="pb-3 text-right px-6">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredWells.map((well: Well) => {
                const team = Array.isArray(teams) ? teams.find((t) => t._id === well.team) : undefined;
                return (
                  <tr key={well._id} className="border-b border-gray-100 hover:bg-gray-100">
                    <td className="py-3.5 text-sm text-gray-900 px-6">{team?.name ?? well.team}</td>
                    <td className="py-3.5 font-mono text-sm text-gray-900 px-6">
                      {well.except_length}m
                    </td>
                    <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{well.length}m</td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={well.status} />
                    </td>
                    <td className="py-3.5 text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditWell(well)}>
                            {tCommon("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteWell(well)}
                          >
                            {tCommon("delete")}
                          </DropdownMenuItem>
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
        <EmptyState title={tCommon("empty")} description="" />
      )}
    </div>
  );
}
