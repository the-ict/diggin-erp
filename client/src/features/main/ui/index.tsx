"use client";

import { useTransactions } from "@/shared/lib/hooks/use-transactions";
import { useWareTransactions } from "@/shared/lib/hooks/use-ware-transactions";
import { TrendingUp, TrendingDown } from "lucide-react";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { Transaction } from "@/shared/config/api/transaction.model";
import { WareTransaction } from "@/shared/config/api/wareTransaction.model";

export default function MainPage() {
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: wareTransactions, isLoading: wareTransactionsLoading } = useWareTransactions();

  // Calculate current month income/outcome
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = Array.isArray(transactions) ? transactions.filter((t: Transaction) => {
    const d = new Date(t.createdAt);
    return t.type === "INCOME" &&
           d.getMonth() === currentMonth &&
           d.getFullYear() === currentYear;
  }).reduce((sum: number, t: Transaction) => sum + t.amount, 0) : 0;

  const monthlyOutcome = Array.isArray(transactions) ? transactions.filter((t: Transaction) => {
    const d = new Date(t.createdAt);
    return t.type === "OUTCOME" &&
           d.getMonth() === currentMonth &&
           d.getFullYear() === currentYear;
  }).reduce((sum: number, t: Transaction) => sum + t.amount, 0) : 0;

  const incomeCount = Array.isArray(transactions) ? transactions.filter((t: Transaction) => {
    const d = new Date(t.createdAt);
    return t.type === "INCOME" &&
           d.getMonth() === currentMonth &&           d.getFullYear() === currentYear;
  }).length : 0;

  const outcomeCount = Array.isArray(transactions) ? transactions.filter((t: Transaction) => {
    const d = new Date(t.createdAt);
    return t.type === "OUTCOME" &&
           d.getMonth() === currentMonth &&
           d.getFullYear() === currentYear;
  }).length : 0;

  // Calculate last 6 months data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { 
      month: d.toLocaleString('uz', { month: 'short' }), 
      income: 0, 
      outcome: 0 
    };
  });

  Array.isArray(transactions) && transactions.forEach((t: Transaction) => {
    const d = new Date(t.createdAt);
    const monthData = last6Months.find(m => {
      const md = new Date();
      md.setMonth(md.getMonth() - (5 - last6Months.indexOf(m)));
      return d.getMonth() === md.getMonth() && d.getFullYear() === md.getFullYear();
    });
    if (monthData) {
      if (t.type === "INCOME") {
        monthData.income += t.amount;
      } else {
        monthData.outcome += t.amount;
      }
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  if (transactionsLoading || wareTransactionsLoading) {
    return (
      <div className="custom-container space-y-6 py-10">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="custom-container space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
      
      {/* Income/Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Oylik Daromad</span>
          </div>
          <p className="text-2xl font-mono font-semibold text-green-600">
            {formatCurrency(monthlyIncome)} UZS
          </p>
          <p className="text-xs text-gray-500 mt-1">{incomeCount} ta tranzaksiya</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">Oylik Xarajat</span>
          </div>
          <p className="text-2xl font-mono font-semibold text-red-600">
            {formatCurrency(monthlyOutcome)} UZS
          </p>
          <p className="text-xs text-gray-500 mt-1">{outcomeCount} ta tranzaksiya</p>
        </div>
      </div>

      {/* Line Chart placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">So'nggi 6 oy — Daromad vs Xarajat</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart component will be added here
        </div>
      </div>

      {/* Recent Ware Transactions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Oxirgi Ombor Tranzaksiyalari</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left">Mahsulot</th>
                <th className="pb-3 text-left">Miqdor</th>
                <th className="pb-3 text-left">Tur</th>
                <th className="pb-3 text-left">Sana</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(wareTransactions) && wareTransactions.slice(0, 5).map((transaction: WareTransaction) => (
                <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3.5 text-sm text-gray-900">{transaction.wareItemId}</td>
                  <td className="py-3.5 font-mono text-sm text-gray-900">{transaction.quantity}</td>
                  <td className="py-3.5"><StatusBadge status={transaction.type} /></td>
                  <td className="py-3.5 text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}