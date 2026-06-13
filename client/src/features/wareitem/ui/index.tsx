"use client";

import { useState, useMemo, useEffect } from "react";
import { Package, MoreVertical, Plus, AlertTriangle, Check, ArrowDownUp } from "lucide-react";
import { useWareItems, useCreateWareItem, useUpdateWareItem, useDeleteWareItem } from "@/shared/lib/hooks/use-ware-items";
import { useWareTransactions, useCreateWareTransaction } from "@/shared/lib/hooks/use-ware-transactions";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { WareItem } from "@/shared/config/api/wareItem.model";
import { CreateWareTransactionDto, WareTransaction } from "@/shared/config/api/wareTransaction.model";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useWorkers } from "@/shared/lib/hooks/use-workers";
import { useTranslations } from "next-intl";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Cell } from "recharts";
import { useAuth } from "@/shared/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function WareItemPage() {
  const t = useTranslations("WareItems");
  const tCommon = useTranslations("Common");
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Call ALL hooks before any early returns
  const { data: wareItems, isLoading } = useWareItems();
  const { data: wareTransactions, isLoading: isTransactionsLoading } = useWareTransactions();
  const { data: workerItems } = useWorkers();
  const createWareItem = useCreateWareItem();
  const updateWareItem = useUpdateWareItem();
  const deleteWareItem = useDeleteWareItem();
  const createWareTransaction = useCreateWareTransaction();

  const [filterStock, setFilterStock] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false);
  const [editingWareItem, setEditingWareItem] = useState<WareItem | null>(null);
  const [newWareItem, setNewWareItem] = useState({ name: "", quantity: 0 });
  const [wareTransaction, setWareTransaction] = useState<CreateWareTransactionDto>({
    quantity: 0,
    type: "OUTCOME",
    givenToWorker: "",
    wareItemId: "",
  });

  // Construct stock chart data
  const stockChartData = useMemo(() => {
    if (!Array.isArray(wareItems)) return [];
    return wareItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    }));
  }, [wareItems]);

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

  const MINIMUM_QUANTITY = 10;
  const stockOptions = ["ALL", "LOW", "NORMAL"] as const;

  const getWareItemName = (id: string) =>
    Array.isArray(wareItems) ? wareItems.find((item) => item._id === id)?.name ?? id : id;

  const getWorkerName = (id: string) =>
    Array.isArray(workerItems) ? workerItems.find((worker) => worker._id === id)?.name ?? id : id;

  const filteredItems = Array.isArray(wareItems)
    ? wareItems.filter((item) => {
        if (filterStock === "ALL") return true;
        if (filterStock === "LOW") return item.quantity <= MINIMUM_QUANTITY;
        if (filterStock === "NORMAL") return item.quantity > MINIMUM_QUANTITY;
        return true;
      })
    : [];

  const resetTransactionForm = () => {
    setWareTransaction({
      quantity: 0,
      type: "OUTCOME",
      wareItemId: Array.isArray(wareItems) && wareItems.length > 0 ? wareItems[0]._id : "",
      givenToWorker: Array.isArray(workerItems) && workerItems.length > 0 ? workerItems[0]._id : "",
    });
  };

  const handleTransactionSheetChange = (open: boolean) => {
    setIsTransactionSheetOpen(open);
    if (open) resetTransactionForm();
  };

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
    if (!confirm(tCommon("confirmDelete"))) return;
    try {
      await deleteWareItem.mutateAsync(item._id);
    } catch (error) {
      console.error("Failed to delete ware item:", error);
    }
  };

  const handleAddTransaction = async () => {
    if (!wareTransaction.wareItemId || !wareTransaction.givenToWorker || wareTransaction.quantity <= 0) return;

    try {
      await createWareTransaction.mutateAsync(wareTransaction);
      setIsTransactionSheetOpen(false);
      resetTransactionForm();
    } catch (error) {
      console.error("Failed to add ware transaction:", error);
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
    quantity: {
      label: t("quantity"),
      color: "#6366f1",
    },
  };

  return (
    <div className="custom-container space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl max-lg:text-[20px] font-semibold tracking-tight text-gray-900">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <Sheet open={isTransactionSheetOpen} onOpenChange={handleTransactionSheetChange}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                {t("addTransaction")}
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("transactionTitle")}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="transaction-ware-item">
                    {t("product")}
                  </label>
                  <select
                    id="transaction-ware-item"
                    value={wareTransaction.wareItemId}
                    onChange={(e) => setWareTransaction({ ...wareTransaction, wareItemId: e.target.value })}
                    className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">{t("selectProduct")}</option>
                    {Array.isArray(wareItems) &&
                      wareItems.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="transaction-quantity">
                    {t("quantity")}
                  </label>
                  <Input
                    id="transaction-quantity"
                    value={wareTransaction.quantity || ""}
                    onChange={(e) =>
                      setWareTransaction({ ...wareTransaction, quantity: Number(e.target.value) })
                    }
                    placeholder={t("placeholderQuantity")}
                    type="number"
                    min={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="transaction-worker">
                    {t("worker")}
                  </label>
                  <select
                    id="transaction-worker"
                    value={wareTransaction.givenToWorker}
                    onChange={(e) => setWareTransaction({ ...wareTransaction, givenToWorker: e.target.value })}
                    className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">{t("selectWorker")}</option>
                    {Array.isArray(workerItems) &&
                      workerItems.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <Button
                  onClick={handleAddTransaction}
                  disabled={
                    createWareTransaction.isPending ||
                    !wareTransaction.wareItemId ||
                    !wareTransaction.givenToWorker ||
                    wareTransaction.quantity <= 0
                  }
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/80 hover:bg-black text-white rounded-lg transition-colors text-sm w-full"
                >
                  <Check className="w-4 h-4" />
                  <span>{createWareTransaction.isPending ? tCommon("save") + "..." : tCommon("save")}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
              >
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
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("product")}</label>
                  <Input
                    value={newWareItem.name}
                    onChange={(e) => setNewWareItem({ ...newWareItem, name: e.target.value })}
                    placeholder={t("placeholderName")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("quantity")}</label>
                  <Input
                    value={newWareItem.quantity || ""}
                    onChange={(e) => setNewWareItem({ ...newWareItem, quantity: Number(e.target.value) })}
                    placeholder={t("placeholderQuantity")}
                    type="number"
                  />
                </div>
                <Button onClick={handleAddWareItem} className="w-full">
                  {tCommon("add")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stock Levels Chart */}
      {stockChartData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("chartStock")}</h2>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                data={stockChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="quantity" name={t("quantity")} fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {stockChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.quantity <= MINIMUM_QUANTITY ? "#ef4444" : "#6366f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}

      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("editTitle")}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t("product")}</label>
              <Input
                value={newWareItem.name}
                onChange={(e) => setNewWareItem({ ...newWareItem, name: e.target.value })}
                placeholder={t("placeholderName")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{t("quantity")}</label>
              <Input
                value={newWareItem.quantity || ""}
                onChange={(e) => setNewWareItem({ ...newWareItem, quantity: Number(e.target.value) })}
                placeholder={t("placeholderQuantity")}
                type="number"
              />
            </div>
            <Button onClick={handleUpdateWareItem} className="w-full">
              {tCommon("save")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          {stockOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStock(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStock === status
                  ? "bg-indigo-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status === "ALL" ? tCommon("all") : t(`${status.toLowerCase()}Stock`)}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item: WareItem) => {
              const isLowStock = item.quantity <= MINIMUM_QUANTITY;
              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Menu"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleEditWareItem(item)}>{tCommon("edit")}</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => handleDeleteWareItem(item)}>
                          {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{t("quantity")}</span>
                      <span className="font-mono text-lg font-semibold text-gray-900">{item.quantity}</span>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-2 text-xs text-red-600">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t("lowStock")}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={tCommon("empty")}
            description=""
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900">{t("recentWareTransactions")}</h2>
        </div>

        {isTransactionsLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : Array.isArray(wareTransactions) && wareTransactions.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6 text-left">{t("product")}</th>
                    <th className="py-3 px-6 text-left">{t("quantity")}</th>
                    <th className="py-3 px-6 text-left">{t("type")}</th>
                    <th className="py-3 px-6 text-left">{t("worker")}</th>
                    <th className="py-3 px-6 text-left">Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {wareTransactions.map((transaction: WareTransaction) => (
                    <tr key={transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3.5 px-6 text-sm text-gray-900">
                        {getWareItemName(transaction.wareItemId)}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-sm text-gray-900">{transaction.quantity}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            transaction.type === "INCOME"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {t(`types.${transaction.type}`)}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-sm text-gray-900">
                        {getWorkerName(transaction.givenToWorker)}
                      </td>
                      <td className="py-3.5 px-6 text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title={tCommon("empty")}
            description=""
          />
        )}
      </section>
    </div>
  );
}
