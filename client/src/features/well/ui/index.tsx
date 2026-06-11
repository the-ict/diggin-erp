"use client";

import { useState } from "react";
import { MapPin, Ruler, MoreVertical, Plus } from "lucide-react";
import { useWells } from "@/shared/lib/hooks/use-wells";
import { useTeams } from "@/shared/lib/hooks/use-teams";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Well, WellStatus } from "@/shared/config/api/well.model";
import { Team } from "@/shared/config/api/team.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function WellPage() {
  const { data: wells, isLoading } = useWells();
  const { data: teams } = useTeams();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWell, setNewWell] = useState({ location: "", depth: "", status: "DUGGING" as WellStatus });

  const filteredWells = wells?.filter(well => 
    filterStatus === "ALL" || well.status === filterStatus
  );

  const statuses: (WellStatus | "ALL")[] = ["ALL", "DUGGING", "FINISHED", "SUCCESSFUL", "FAILED"];

  const handleAddWell = () => {
    console.log("Adding well:", newWell);
    setIsAddModalOpen(false);
    setNewWell({ location: "", depth: "", status: "DUGGING" });
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
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">Манзил</label>
                <Input
                  value={newWell.location}
                  onChange={(e) => setNewWell({ ...newWell, location: e.target.value })}
                  placeholder="Қудуқ манзилини киритинг"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Чуқурлик (м)</label>
                <Input
                  value={newWell.depth}
                  onChange={(e) => setNewWell({ ...newWell, depth: e.target.value })}
                  placeholder="Чуқурликни киритинг"
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
            {status}
          </button>
        ))}
      </div>

      {/* Wells Table */}
      {filteredWells && filteredWells.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">Jamoa</th>
                <th className="pb-3 text-left px-6">Uzunlik</th>
                <th className="pb-3 text-left px-6">Kutilgan</th>
                <th className="pb-3 text-left px-6">Status</th>
                <th className="pb-3 text-right px-6">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredWells.map((well: Well) => {
                const team = teams?.find(t => t._id === well.team);
                return (
                  <tr key={well._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3.5 text-sm text-gray-900 px-6">{team?.name ?? well.team}</td>
                    <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{well.length}m</td>
                    <td className="py-3.5 font-mono text-sm text-gray-500 px-6">{well.except_length}m</td>
                    <td className="py-3.5 px-6"><StatusBadge status={well.status} /></td>
                    <td className="py-3.5 text-right px-6">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
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
