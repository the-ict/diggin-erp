"use client";

import { MoreVertical, Plus, DollarSign } from "lucide-react";
import { useCreatePurchase, useDeletePurchase, usePurchases, useUpdatePurchase } from "@/shared/lib/hooks/use-purchases";
import { SkeletonCard } from "@/shared/ui/SkeletonCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { CreatePurchaseDto, Purchase } from "@/shared/config/api/purchase.model";
import React, { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

export default function PurchasePage() {
  const { data: purchases, isLoading } = usePurchases();
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const deletePurchase = useDeletePurchase();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [newPurchase, setNewPurchase] = useState<CreatePurchaseDto>({
    name: "",
    quantity: 0,
    price: 0,
    type: "INCOME",
    note: "",
  });

  const totalCost: number = useMemo(() => Array.isArray(purchases?.data) && purchases.data.reduce((sum, p) => sum + (p.quantity * p.price), 0) || 0, [purchases]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  console.log("purchases: ", purchases);

  const handleAddPurchase = async () => {
    try {
      await createPurchase.mutateAsync(newPurchase);
      setNewPurchase({
        name: "",
        quantity: 0,
        price: 0,
        type: "INCOME",
        note: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.log("failed to add purchase: ", error);
    }
  };

  const handleUpdatePurchase = async () => {
    if(!newPurchase || !editingPurchase) return;
    try {
      await updatePurchase.mutateAsync({id: editingPurchase._id, data: newPurchase});
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("failed to update purchase: ", error);
    }
  };

  const handleDeletePurchase = async (purchase: Purchase) => {
    try {
      await deletePurchase.mutateAsync(purchase._id);
    } catch (error) {
      console.log("failed to delete purchase: ", error);
    }
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
        <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Янги xarid қўшиш</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4 text-[16px]">
              <label>Maxsulot nomini kiritng</label>
              <Input placeholder="Nomi" className="mt-1" onChange={(e) => { setNewPurchase({ ...newPurchase, name: e.target.value }) }} />
              <label>Sonini kiriting</label>
              <Input placeholder="Soni" className="mt-1" type="number" onChange={(e) => { setNewPurchase({ ...newPurchase, quantity: Number(e.target.value) }) }} />
              <label>Xarid turi</label>
              <select name="purchase_type" className="block mt-1 w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" onChange={(e) => setNewPurchase({ ...newPurchase, type: e.target.value as "INCOME" | "OUTCOME" })} id="">
                <option value="INCOME">Sotib olindi</option>
                <option value="OUTCOME">Sotildi</option>
              </select>
              <label>Narxi</label>
              <Input placeholder="Narxi" className="mt-1" onChange={(e) => setNewPurchase({ ...newPurchase, price: Number(e.target.value) })} type="number" />
              <label>Eslatma</label>
              <Input placeholder="Eslatma" className="mt-1" onChange={(e) => setNewPurchase({ ...newPurchase, note: e.target.value })} />
              <Button onClick={handleAddPurchase} className="w-full">
                Қўшиш
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Qo'shish</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Xarid o'zgartirish</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4 text-[16px]">
              <label>Maxsulot nomi</label>
              <Input placeholder="Nomi" className="mt-1" value={newPurchase.name} onChange={(e) => { setNewPurchase({ ...newPurchase, name: e.target.value }) }} />
              <label>Sonini kiriting</label>
              <Input placeholder="Soni" className="mt-1" type="number" value={newPurchase.quantity} onChange={(e) => { setNewPurchase({ ...newPurchase, quantity: Number(e.target.value) }) }} />
              <label>Xarid turi</label>
              <select name="purchase_type" value={newPurchase.type} className="block mt-1 w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" onChange={(e) => setNewPurchase({ ...newPurchase, type: e.target.value as "INCOME" | "OUTCOME" })} id="">
                <option value="INCOME">Sotib olindi</option>
                <option value="OUTCOME">Sotildi</option>
              </select>
              <label>Narxi</label>
              <Input placeholder="Narxi" className="mt-1" value={newPurchase.price} onChange={(e) => setNewPurchase({ ...newPurchase, price: Number(e.target.value) })} type="number" />
              <label>Eslatma</label>
              <Input placeholder="Eslatma" className="mt-1" value={newPurchase.note} onChange={(e) => setNewPurchase({ ...newPurchase, note: e.target.value })} />
              <Button onClick={handleUpdatePurchase} className="w-full">
                O'zgartirish
              </Button>
            </div>
          </SheetContent>
        </Sheet>
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
      {purchases?.data && purchases.data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
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
              {purchases.data.map((purchase: Purchase) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setEditingPurchase(purchase);
                          setIsEditModalOpen(true);
                          setNewPurchase({
                            name: purchase.name,
                            quantity: purchase.quantity,
                            price: purchase.price,
                            type: purchase.type,
                            note: purchase.note || "",
                          });
                        }}>Таҳрирлаш</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePurchase(purchase)}>Ўчириш</DropdownMenuItem>
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
          title="Haridlar topilmadi"
          description="Hozircha hech qanday xarid qo'shilmagan"
        />
      )}
    </div>
  );
}
