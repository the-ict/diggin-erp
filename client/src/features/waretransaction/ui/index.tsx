"use client";

import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { useWareTransactions } from "@/shared/lib/hooks/use-ware-transactions";
import { useWareItems } from "@/shared/lib/hooks/use-ware-items";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { WareTransaction, WareTransactionType } from "@/shared/config/api/wareTransaction.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function WareTransactionPage() {
  const { data: transactions, isLoading } = useWareTransactions();
  const [filterType, setFilterType] = useState<string>("ALL");
  const { data: wareItems } = useWareItems();
  const [editingTransaction, setEditingTransaction] = useState<WareTransaction | null>(null);
  const [isEditingModal, setIsEditingModal] = useState<boolean>(false);
  const [newTransaction, setNewTransaction] = useState({

  });

  const filteredTransactions = transactions?.filter(transaction => 
    filterType === "ALL" || transaction.type === filterType
  );

  const types: (WareTransactionType | "ALL")[] = ["ALL", "INCOME", "OUTCOME"];

  const handleUpdateTransaction = (transaction: WareTransaction) => {
    // TODO: Implement update transaction logic
    console.log("Updating transaction:", transaction);
  };

  const handleDeleteTransaction = (transaction: WareTransaction) => {
    // TODO: Implement delete transaction logic
    console.log("Deleting transaction:", transaction);
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Омбор Транзакциялари</h1>
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Омбор Транзакциялари</h1>
        <button className="flex items-center gap-2 px-4 py-1 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Qo'shish</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === type
                ? "bg-indigo-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">Mahsulot</th>
                <th className="pb-3 text-left px-6">Miqdor</th>
                <th className="pb-3 text-left px-6">Tur</th>
                <th className="pb-3 text-left px-6">Sana</th>
                <th className="pb-3 text-right px-6">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction: WareTransaction) => {
                const wareItem = wareItems?.find(w => w._id === transaction.wareItemId);
                return (
                  <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3.5 text-sm text-gray-900 px-6">{wareItem?.name ?? transaction.wareItemId}</td>
                    <td className="py-3.5 font-mono text-sm text-gray-900 px-6">{transaction.quantity}</td>
                    <td className="py-3.5 px-6"><StatusBadge status={transaction.type} /></td>
                    <td className="py-3.5 text-sm text-gray-500 px-6">
                      {new Date(transaction.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
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
          title="Tranzaksiyalar topilmadi"
          description="Hozircha hech qanday tranzaksiya qo'shilmagan"
        />
      )}
    </div>
  );
}
