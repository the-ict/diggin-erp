'use client';

import { useState } from 'react';
import { useWarehouseItems, useLowStockItems, useCreateWarehouseItem } from '@/shared/hooks/useWarehouse';
import { WarehouseItem } from '@/shared/config/api/warehouse';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/shared/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#dc2626', '#16a34a'];

export default function WarehousePage() {
  const { data: items, isLoading, error } = useWarehouseItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createWarehouseItem = useCreateWarehouseItem();
  const { data: lowStockItems } = useLowStockItems();
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    quantity: 0,
    minimumQuantity: 0,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Warehouse</h1>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Warehouse</h1>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load items</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWarehouseItem.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', unit: '', quantity: 0, minimumQuantity: 0 });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const totalItems = items ? items.length : 0;
  const lowStockCount = lowStockItems ? lowStockItems.length : 0;
  const healthyStockCount = totalItems - lowStockCount;
  const stockHealthData = [
    { name: 'Low Stock', value: lowStockCount },
    { name: 'Healthy', value: healthyStockCount },
  ];
  const stockLevelData = items ? items.slice(0, 8).map(item => ({
    name: item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name,
    quantity: item.quantity,
    minimum: item.minimumQuantity,
  })) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Warehouse</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>
      
      {/* Statistics Cards */}
      {items && items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Items</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{totalItems}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Low Stock</p>
            <p className="mt-2 text-2xl font-semibold text-red-600">{lowStockCount}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Healthy Stock</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">{healthyStockCount}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      {items && items.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Stock Health</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stockHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stockHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Stock Levels (Top 8)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: WarehouseItem) => (
            <div key={item._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.unit}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.quantity} in stock
                  </p>
                </div>
                {item.quantity < item.minimumQuantity && (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800">
                    Low Stock
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No items found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity</label>
              <input
                type="number"
                required
                value={formData.minimumQuantity}
                onChange={(e) => setFormData({ ...formData, minimumQuantity: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createWarehouseItem.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createWarehouseItem.isPending ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};