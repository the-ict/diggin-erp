"use client";

import { useState } from "react";
import { ArrowLeftRight, MoreVertical, Plus, DollarSign } from "lucide-react";
import { useTransactions } from "@/shared/lib/hooks/use-transactions";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Transaction, TransactionType } from "@/shared/config/api/transaction.model";

export default function TransactionPage() {
  const { data: transactions, isLoading } = useTransactions();
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredTransactions = transactions?.filter(transaction => 
    filterType === "ALL" || transaction.type === filterType
  );

  const types: (TransactionType | "ALL")[] = ["ALL", "INCOME", "OUTCOME"];

  const totalIncome = transactions?.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalOutcome = transactions?.filter(t => t.type === "OUTCOME").reduce((sum, t) => sum + t.amount, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Транзакциялар</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="custom-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Транзакциялар</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Qo'shish</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jami kirim</p>
              <p className="text-xl font-mono font-semibold text-green-600">{formatCurrency(totalIncome)} UZS</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jami chiqim</p>
              <p className="text-xl font-mono font-semibold text-red-600">{formatCurrency(totalOutcome)} UZS</p>
            </div>
          </div>
        </div>
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
                <th className="pb-3 text-left px-6">Izoh</th>
                <th className="pb-3 text-left px-6">Tur</th>
                <th className="pb-3 text-left px-6">Summa</th>
                <th className="pb-3 text-left px-6">Sana</th>
                <th className="pb-3 text-right px-6">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction: Transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3.5 text-sm text-gray-900 px-6">{transaction.note ?? "-"}</td>
                  <td className="py-3.5 px-6"><StatusBadge status={transaction.type} /></td>
                  <td className={`py-3.5 font-mono text-sm px-6 ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(transaction.amount)} {transaction.currency}
                  </td>
                  <td className="py-3.5 text-sm text-gray-500 px-6">
                    {new Date(transaction.createdAt).toLocaleDateString('uz-UZ')}
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
          title="Tranzaksiyalar topilmadi"
          description="Hozircha hech qanday tranzaksiya qo'shilmagan"
        />
      )}
    </div>
  );
}
