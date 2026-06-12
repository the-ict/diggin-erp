"use client";

import { useTransactions } from "@/shared/lib/hooks/use-transactions";
import { useWareTransactions } from "@/shared/lib/hooks/use-ware-transactions";
import { useWells } from "@/shared/lib/hooks/use-wells";
import { useWareItems } from "@/shared/lib/hooks/use-ware-items";
import { TrendingUp, TrendingDown, Layers, MapPin, Package } from "lucide-react";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { Transaction } from "@/shared/config/api/transaction.model";
import { WareTransaction } from "@/shared/config/api/wareTransaction.model";
import { useTranslations } from "next-intl";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from "recharts";

export default function MainPage() {
  const t = useTranslations("Dashboard");
  const tWells = useTranslations("Wells");
  const tCommon = useTranslations("Common");

  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: wareTransactions, isLoading: wareTransactionsLoading } = useWareTransactions();
  const { data: wells, isLoading: wellsLoading } = useWells();
  const { data: wareItems, isLoading: wareItemsLoading } = useWareItems();

  // Calculate current month income/outcome
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = Array.isArray(transactions)
    ? transactions
        .filter((t: Transaction) => {
          const d = new Date(t.createdAt);
          return (
            t.type === "INCOME" &&
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        })
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    : 0;

  const monthlyOutcome = Array.isArray(transactions)
    ? transactions
        .filter((t: Transaction) => {
          const d = new Date(t.createdAt);
          return (
            t.type === "OUTCOME" &&
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        })
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    : 0;

  const incomeCount = Array.isArray(transactions)
    ? transactions.filter((t: Transaction) => {
        const d = new Date(t.createdAt);
        return (
          t.type === "INCOME" &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      }).length
    : 0;

  const outcomeCount = Array.isArray(transactions)
    ? transactions.filter((t: Transaction) => {
        const d = new Date(t.createdAt);
        return (
          t.type === "OUTCOME" &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      }).length
    : 0;

  // Calculate last 6 months data
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleString("uz", { month: "short" }),
      income: 0,
      outcome: 0,
    };
  });

  Array.isArray(transactions) &&
    transactions.forEach((t: Transaction) => {
      const d = new Date(t.createdAt);
      const monthData = last6Months.find((m) => {
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

  // Calculate well status data
  const wellStatusCounts = Array.isArray(wells)
    ? wells.reduce((acc: Record<string, number>, w) => {
        acc[w.status] = (acc[w.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const wellStatusData = Object.entries(wellStatusCounts).map(([status, count]) => ({
    name: tWells(`statuses.${status}`) || status,
    value: count,
    status,
  }));

  const wellColors: Record<string, string> = {
    DUGGING: "#f59e0b", // amber-500
    FINISHED: "#3b82f6", // blue-500
    SUCCESSFUL: "#10b981", // emerald-500
    FAILED: "#ef4444", // red-500
  };

  // Calculate top warehouse items
  const stockData = Array.isArray(wareItems)
    ? wareItems.slice(0, 6).map((item) => ({
        name: item.name,
        quantity: item.quantity,
      }))
    : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount);
  };

  if (transactionsLoading || wareTransactionsLoading || wellsLoading || wareItemsLoading) {
    return (
      <div className="custom-container space-y-6 py-10">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const transactionConfig = {
    income: {
      label: t("income"),
      color: "#10b981",
    },
    outcome: {
      label: t("outcome"),
      color: "#ef4444",
    },
  };

  const wellConfig = {
    wells: {
      label: t("wellStatusDistribution"),
    },
  };

  const stockConfig = {
    quantity: {
      label: t("quantity"),
      color: "#6366f1",
    },
  };

  return (
    <div className="custom-container space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("title")}</h1>

      {/* Income/Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-600">{t("monthlyIncome")}</span>
          </div>
          <p className="text-2xl font-mono font-semibold text-emerald-600">
            {formatCurrency(monthlyIncome)} UZS
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("transactions", { count: incomeCount })}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">{t("monthlyOutcome")}</span>
          </div>
          <p className="text-2xl font-mono font-semibold text-red-600">
            {formatCurrency(monthlyOutcome)} UZS
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {t("transactions", { count: outcomeCount })}
          </p>
        </div>
      </div>

      {/* Monthly Finance Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("incomeVsOutcome")}</h2>
        <div className="h-80">
          <ChartContainer config={transactionConfig} className="w-full h-full">
            <BarChart data={last6Months} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${formatCurrency(value)} UZS`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="income" name={t("income")} fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outcome" name={t("outcome")} fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Grid for Well Status and Stock charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart for Well Status */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t("wellStatusDistribution")}</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {wellStatusData.length > 0 ? (
              <ChartContainer config={wellConfig} className="w-full h-full">
                <PieChart>
                  <Pie
                    data={wellStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {wellStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={wellColors[entry.status] || "#6366f1"}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-gray-500">{tCommon("empty")}</p>
            )}
          </div>
        </div>

        {/* Bar Chart for Warehouse Stock */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">{t("wareitemStockDistribution")}</h2>
          </div>
          <div className="h-64">
            {stockData.length > 0 ? (
              <ChartContainer config={stockConfig} className="w-full h-full">
                <BarChart
                  data={stockData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quantity" name={t("quantity")} fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">{tCommon("empty")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Ware Transactions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("recentWareTransactions")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 text-left">{t("product")}</th>
                <th className="pb-3 text-left">{t("quantity")}</th>
                <th className="pb-3 text-left">{t("type")}</th>
                <th className="pb-3 text-left">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(wareTransactions) && wareTransactions.length > 0 ? (
                wareTransactions.slice(0, 5).map((transaction: WareTransaction) => (
                  <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3.5 text-sm text-gray-900">{transaction.wareItemId}</td>
                    <td className="py-3.5 font-mono text-sm text-gray-900">{transaction.quantity}</td>
                    <td className="py-3.5">
                      <StatusBadge status={transaction.type} />
                    </td>
                    <td className="py-3.5 text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                    {tCommon("empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}