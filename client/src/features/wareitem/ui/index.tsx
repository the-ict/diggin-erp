"use client";

import { useState } from "react";
import { Package, MoreVertical, Plus, AlertTriangle } from "lucide-react";
import { useWareItems, useCreateWareItem, useUpdateWareItem, useDeleteWareItem } from "@/shared/lib/hooks/use-ware-items";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { WareItem } from "@/shared/config/api/wareItem.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function WareItemPage() {
  const { data: wareItems, isLoading } = useWareItems();
  const createWareItem = useCreateWareItem();
  const updateWareItem = useUpdateWareItem();
  const deleteWareItem = useDeleteWareItem();
  const [filterStock, setFilterStock] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWareItem, setEditingWareItem] = useState<WareItem | null>(null);
  const [newWareItem, setNewWareItem] = useState({ name: "", quantity: 0 });

  const MINIMUM_QUANTITY = 10;

  const stockOptions = ["ALL", "LOW", "NORMAL"] as const;

  const stockLabels: Record<typeof stockOptions[number], string> = {
    "ALL": "Ҳаммаси",
    "LOW": "Кам миқдор",
    "NORMAL": "Нормал"
  };

  const filteredItems = Array.isArray(wareItems) ? wareItems.filter(item => {
    if (filterStock === "ALL") return true;
    if (filterStock === "LOW") return item.quantity <= MINIMUM_QUANTITY;
    if (filterStock === "NORMAL") return item.quantity > MINIMUM_QUANTITY;
    return true;
  }) : [];

  const handleAddWareItem = async () => {
    try {
      await createWareItem.mutateAsync(newWareItem);
      setIsAddModalOpen(false);
      setNewWareItem({ name: "", quantity: 0 });
    } catch (error) {
      console.error("Failed to add ware item:", error);
    }
  };

  const handleEditWareItem = (item: WareItem) => {
    setEditingWareItem(item);
    setNewWareItem({ name: item.name, quantity: item.quantity });
    setIsEditModalOpen(true);
  };

  const handleUpdateWareItem = async () => {
    if (!editingWareItem) return;
    try {
      await updateWareItem.mutateAsync({ id: editingWareItem._id, data: newWareItem });
      setIsEditModalOpen(false);
      setEditingWareItem(null);
      setNewWareItem({ name: "", quantity: 0 });
    } catch (error) {
      console.error("Failed to update ware item:", error);
    }
  };

  const handleDeleteWareItem = async (item: WareItem) => {
    if (!confirm(`${item.name} маҳсулотини ўчирмоқчимисиз?`)) return;
    try {
      await deleteWareItem.mutateAsync(item._id);
    } catch (error) {
      console.error("Failed to delete ware item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Омбор Махсулотлари</h1>
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Омбор Махсулотлари</h1>
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Янги махсулот қўшиш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Махсулот номи</label>
                <Input
                  value={newWareItem.name}
                  onChange={(e) => setNewWareItem({ ...newWareItem, name: e.target.value })}
                  placeholder="Махсулот номини киритинг"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Миқдор</label>
                <Input
                  value={newWareItem.quantity.toString()}
                  onChange={(e) => setNewWareItem({ ...newWareItem, quantity: Number(e.target.value) })}
                  placeholder="Миқдорни киритинг"
                  type="number"
                />
              </div>
              <Button onClick={handleAddWareItem} className="w-full">
                Қўшиш
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Ware item Modal */}
        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Махсулотни таҳрирлаш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Махсулот номи</label>
                <input
                  value={newWareItem.name}
                  onChange={(e) => setNewWareItem({ ...newWareItem, name: e.target.value })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Миқдор</label>
                <Input
                  value={newWareItem.quantity}
                  onChange={(e) => setNewWareItem({ ...newWareItem, quantity: Number(e.target.value) })}
                  placeholder="Миқдорни киритинг"
                  type="number"
                />
              </div>

              <Button onClick={handleUpdateWareItem} className="w-full">
                Сақлаш
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stock Filter */}
      <div className="flex items-center gap-2">
        {stockOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStock(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStock === status
              ? "bg-indigo-500 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {stockLabels[status]}
          </button>
        ))}
      </div>

      {/* WareItems Grid */}
      {filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: WareItem) => {
            const isLowStock = item.quantity <= MINIMUM_QUANTITY;
            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditWareItem(item)}>Таҳрирлаш</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteWareItem(item)}>Ўчириш</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="mt-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Miqdor</span>
                    <span className="font-mono text-lg font-semibold text-gray-900">{item.quantity}</span>
                  </div>
                  {isLowStock && (
                    <div className="flex items-center gap-2 text-xs text-red-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Kam miqdor</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Mahsulotlar topilmadi"
          description="Hozircha hech qanday mahsulot qo'shilmagan"
        />
      )}
    </div>
  );
}
