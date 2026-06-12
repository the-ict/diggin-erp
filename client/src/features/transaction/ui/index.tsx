"use client";

import { useState } from "react";
import { MoreVertical, Plus, DollarSign } from "lucide-react";
import { useCreateTransaction, useDeleteTransaction, useTransactions, useUpdateTransaction } from "@/shared/lib/hooks/use-transactions";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { CreateTransactionDto, Transaction, TransactionType } from "@/shared/config/api/transaction.model";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function TransactionPage() {
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

  const filteredTransactions = transactions?.filter(transaction =>
    filterType === "ALL" || transaction.type === filterType
  );

  const types: (TransactionType | "ALL")[] = ["ALL", "INCOME", "OUTCOME"];

  const totalIncome = transactions?.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalOutcome = transactions?.filter(t => t.type === "OUTCOME").reduce((sum, t) => sum + t.amount, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction?._id) return;
    try {
      await updateTransaction.mutateAsync({ id: editingTransaction?._id, data: newTransaction })
      setIsEditTransactionModalOpen(false);
    } catch (error) {
      console.log("failed to update transaction: ", error);
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
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
    } catch (error) {
      console.log("failed to add transaction: ", error);
    }
  }

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
  };

  return (
    <div className="custom-container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Транзакциялар</h1>

        <Sheet open={isAddTransactionModalOpen} onOpenChange={setIsAddTransactionModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Транзакция қўшиш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Narxi</label>
                <Input
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  placeholder="Кутилаётган узунликни киритинг"
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Turi</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Жамоани танланг</option>
                  {["INCOME", "OUTCOME"].map(type => (
                    <option key={type} value={type}>{type == "INCOME" ? "Кирим" : "Чиқим"}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pul turi</label>
                <select
                  value={newTransaction.currency}
                  onChange={(e) => setNewTransaction({ ...newTransaction, currency: e.target.value as "USD" | "UZS" })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="USD">Dollar</option>
                  <option value="UZS">O'zbek so'mi</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Eslatma</label>
                <Input
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                  placeholder="Eslatma"
                />
              </div>
              <Button onClick={handleAddTransaction} className="w-full">
                Қўшиш
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Well Modal */}
        <Sheet open={isEditTransactionModalOpen} onOpenChange={setIsEditTransactionModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Транзакцияни таҳрирлаш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Narxi</label>
                <Input
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  placeholder="Кутилаётган узунликни киритинг"
                  type="number"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Turi</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as TransactionType })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Жамоани танланг</option>
                  {["INCOME", "OUTCOME"].map(type => (
                    <option key={type} value={type}>{type == "INCOME" ? "Кирим" : "Чиқим"}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Pul turi</label>
                <select
                  value={newTransaction.currency}
                  onChange={(e) => setNewTransaction({ ...newTransaction, currency: e.target.value as "USD" | "UZS" })}
                  className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="USD">Dollar</option>
                  <option value="UZS">O'zbek soni</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Eslatma</label>
                <Input
                  value={newTransaction.note}
                  onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                  placeholder="Eslatma"
                />
              </div>
              <Button onClick={handleUpdateTransaction} className="w-full">
                Tаҳрирлаш
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === type
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
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setNewTransaction({
                            amount: transaction.amount,
                            currency: transaction.currency,
                            type: transaction.type,
                            note: transaction.note || "",
                          });
                          setEditingTransaction(transaction);
                          setIsEditTransactionModalOpen(true);
                        }}>Таҳрирлаш</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTransaction(transaction)}>Ўчириш</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
