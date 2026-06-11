"use client";

import { ShoppingCart, MoreVertical, Plus, DollarSign } from "lucide-react";
import { usePurchases } from "@/shared/lib/hooks/use-purchases";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Purchase } from "@/shared/config/api/purchase.model";

export default function PurchasePage() {
  const { data: purchases, isLoading } = usePurchases();

  const totalCost = purchases?.reduce((sum, p) => sum + (p.quantity * p.price), 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Харидлар</h1>
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Харидлар</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Qo'shish</span>
        </button>
      </div>

      {/* Total Cost Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Jami xarajat</p>
            <p className="text-2xl font-mono font-semibold text-green-600">{formatCurrency(totalCost)} UZS</p>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      {purchases && purchases.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">Nomi</th>
                <th className="pb-3 text-left px-6">Miqdor</th>
                <th className="pb-3 text-left px-6">Narxi</th>
                <th className="pb-3 text-left px-6">Jami</th>
                <th className="pb-3 text-left px-6">Izoh</th>
                <th className="pb-3 text-left px-6">Sana</th>
                <th className="pb-3 text-right px-6">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase: Purchase) => (
                <tr key={purchase._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3.5 text-sm text-gray-900 px-6">{purchase.name}</td>
                  <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{purchase.quantity}</td>
                  <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{formatCurrency(purchase.price)}</td>
                  <td className="py-3.5 font-mono text-sm text-green-600 px-6">{formatCurrency(purchase.quantity * purchase.price)}</td>
                  <td className="py-3.5 text-sm text-gray-500 px-6">{purchase.note ?? "-"}</td>
                  <td className="py-3.5 text-sm text-gray-500 px-6">
                    {new Date(purchase.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="py-3.5 text-right px-6">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Haridlar topilmadi"
          description="Hozircha hech qanday xarid qo'shilmagan"
        />
      )}
    </div>
  );
}
