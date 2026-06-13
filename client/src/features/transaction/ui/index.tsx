"use client";

import { useState, useMemo, useEffect } from "react";
import { MoreVertical, Plus, DollarSign } from "lucide-react";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/shared/lib/hooks/use-transactions";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  CreateTransactionDto,
  Transaction,
  TransactionType,
} from "@/shared/config/api/transaction.model";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useTranslations } from "next-intl";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function TransactionPage() {
  const t = useTranslations("Transactions");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

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

  const { data: transactions, isLoading } = useTransactions();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [editingTransaction, setEditingTransaction] = useState<Transaction>();
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<CreateTransactionDto>({
    amount: 0,
    currency: "UZS",
    type: "INCOME",
    note: "",
  });
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredTransactions = transactions?.filter(
    (transaction) => filterType === "ALL" || transaction.type === filterType
  );

  const types = ["ALL", "INCOME", "OUTCOME"] as const;

  const totalIncome =
    transactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalOutcome =
    transactions
      ?.filter((t) => t.type === "OUTCOME")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction?._id) return;
    try {
      await updateTransaction.mutateAsync({
        id: editingTransaction?._id,
        data: newTransaction,
      });
      setIsEditTransactionModalOpen(false);
    } catch (error) {
      console.log("failed to update transaction: ", error);
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteTransaction.mutateAsync(transaction._id);
    } catch (error) {
      console.log("failed to delete transaction: ", error);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await createTransaction.mutateAsync(newTransaction);
      setIsAddTransactionModalOpen(false);
      setNewTransaction({
        amount: 0,
        currency: "UZS",
        type: "INCOME",
        note: "",
      });
    } catch (error) {
      console.log("failed to add transaction: ", error);
    }
  };

  // Group transactions by date for flow chart
  const flowChartData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const groups: Record<string, { date: string; income: number; outcome: number }> = {};

    transactions.forEach((t) => {
      const dateStr = new Date(t.createdAt).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
      });
      if (!groups[dateStr]) {
        groups[dateStr] = { date: dateStr, income: 0, outcome: 0 };
      }
      if (t.type === "INCOME") {
        groups[dateStr].income += t.amount;
      } else {
        groups[dateStr].outcome += t.amount;
      }
    });

    return Object.values(groups)
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split(".").map(Number);
        const [dayB, monthB] = b.date.split(".").map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      })
      .slice(-15); // Show last 15 active days
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="custom-container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const chartConfig = {
    income: {
      label: t("types.INCOME"),
      color: "#10b981",
    },
    outcome: {
      label: t("types.OUTCOME"),
      color: "#ef4444",
    },
  };

  return (
    <div className="custom-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>

        <Sheet open={isAddTransactionModalOpen} onOpenChange={setIsAddTransactionModalOpen}>
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("amount")}</label>
                <Input
                  value={newTransaction.amount || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
                  }
                  placeholder={t("placeholderAmount")}
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("type")}</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="INCOME">{t("types.INCOME")}</option>
                  <option value="OUTCOME">{t("types.OUTCOME")}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("currency")}</label>
                <select
                  value={newTransaction.currency}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      currency: e.target.value as "USD" | "UZS",
                    })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="USD">{t("currencies.USD")}</option>
                  <option value="UZS">{t("currencies.UZS")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("note")}</label>
                <Input
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                  placeholder={t("placeholderNote")}
                />
              </div>
              <Button onClick={handleAddTransaction} className="w-full">
                {tCommon("add")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Transaction Modal */}
        <Sheet open={isEditTransactionModalOpen} onOpenChange={setIsEditTransactionModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("editTitle")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("amount")}</label>
                <Input
                  value={newTransaction.amount || ""}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
                  }
                  placeholder={t("placeholderAmount")}
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("type")}</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="INCOME">{t("types.INCOME")}</option>
                  <option value="OUTCOME">{t("types.OUTCOME")}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("currency")}</label>
                <select
                  value={newTransaction.currency}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      currency: e.target.value as "USD" | "UZS",
                    })
                  }
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="USD">{t("currencies.USD")}</option>
                  <option value="UZS">{t("currencies.UZS")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t("note")}</label>
                <Input
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                  placeholder={t("placeholderNote")}
                />
              </div>
              <Button onClick={handleUpdateTransaction} className="w-full">
                {tCommon("save")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("totalIncome")}</p>
              <p className="text-xl font-mono font-semibold text-green-600">
                {formatCurrency(totalIncome)} UZS
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("totalOutcome")}</p>
              <p className="text-xl font-mono font-semibold text-red-600">
                {formatCurrency(totalOutcome)} UZS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      {flowChartData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("chartFlow")}</h2>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <AreaChart data={flowChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${formatCurrency(val)}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="income"
                  name={t("types.INCOME")}
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="outcome"
                  name={t("types.OUTCOME")}
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorOutcome)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      )}

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
            {type === "ALL" ? tCommon("all") : t(`types.${type}`)}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg py-5 overflow-x-auto shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left px-6">{t("note")}</th>
                <th className="pb-3 text-left px-6">{t("type")}</th>
                <th className="pb-3 text-left px-6">{t("amount")}</th>
                <th className="pb-3 text-left px-6">{t("date")}</th>
                <th className="pb-3 text-right px-6">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction: Transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3.5 text-sm text-gray-900 px-6">{transaction.note || "-"}</td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={transaction.type} />
                  </td>
                  <td
                    className={`py-3.5 font-mono text-sm px-6 ${
                      transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}{" "}
                    {t(`currencies.${transaction.currency}`) || transaction.currency}
                  </td>
                  <td className="py-3.5 text-sm text-gray-500 px-6">
                    {new Date(transaction.createdAt).toLocaleDateString("uz-UZ")}
                  </td>
                  <td className="py-3.5 text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setNewTransaction({
                              amount: transaction.amount,
                              currency: transaction.currency,
                              type: transaction.type,
                              note: transaction.note || "",
                            });
                            setEditingTransaction(transaction);
                            setIsEditTransactionModalOpen(true);
                          }}
                        >
                          {tCommon("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteTransaction(transaction)}
                        >
                          {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title={tCommon("empty")} description="" />
      )}
    </div>
  );
}
