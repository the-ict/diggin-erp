"use client";

import { useState } from "react";
import { Package, MoreVertical, Plus, AlertTriangle } from "lucide-react";
import { useWareItems } from "@/shared/lib/hooks/use-ware-items";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { WareItem } from "@/shared/config/api/wareItem.model";

export default function WareItemPage() {
  const { data: wareItems, isLoading } = useWareItems();
  const [filterStock, setFilterStock] = useState<string>("ALL");

  const MINIMUM_QUANTITY = 10;

  const filteredItems = wareItems?.filter(item => {
    if (filterStock === "ALL") return true;
    if (filterStock === "LOW") return item.quantity <= MINIMUM_QUANTITY;
    if (filterStock === "NORMAL") return item.quantity > MINIMUM_QUANTITY;
    return true;
  });

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
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Qo'shish</span>
        </button>
      </div>

      {/* Stock Filter */}
      <div className="flex items-center gap-2">
        {["ALL", "LOW", "NORMAL"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStock(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStock === status
                ? "bg-indigo-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status}
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
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
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
