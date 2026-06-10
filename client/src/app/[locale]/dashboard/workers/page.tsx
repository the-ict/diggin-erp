'use client';

import { useState } from 'react';
import { useWorkers, useCreateWorker } from '@/shared/hooks/useWorkers';
import { Worker } from '@/shared/config/api/workers';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/shared/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#2563eb', '#6b7280', '#ca8a04'];

export default function WorkersPage() {
  const { data: workers, isLoading, error } = useWorkers();
  const createWorker = useCreateWorker();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    position: '',
    status: 'active' as 'active' | 'inactive' | 'vacation',
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Workers</h1>
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
          <h1 className="text-2xl font-semibold text-gray-900">Workers</h1>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load workers</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWorker.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ fullName: '', phone: '', position: '', status: 'active' });
    } catch (error) {
      console.error('Failed to create worker:', error);
    }
  };

  const assignedCount = workers ? workers.filter(w => w.brigadeId).length : 0;
  const unassignedCount = workers ? workers.filter(w => !w.brigadeId).length : 0;
  const workerStatusData = workers ? [
    { name: 'Active', value: workers.filter(w => w.status === 'active').length },
    { name: 'Inactive', value: workers.filter(w => w.status === 'inactive').length },
    { name: 'Vacation', value: workers.filter(w => w.status === 'vacation').length },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Workers</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Worker
        </button>
      </div>
      
      {/* Statistics Cards */}
      {workers && workers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Workers</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{workers.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">{assignedCount}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Unassigned</p>
            <p className="mt-2 text-2xl font-semibold text-gray-600">{unassignedCount}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {workers && workers.length > 0 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={workerStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {workerStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {workers && workers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker: Worker) => (
            <div key={worker._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{worker.fullName}</h3>
                  <p className="text-sm text-gray-600">{worker.position}</p>
                  <p className="text-sm text-gray-500 mt-1">{worker.phone}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  worker.status === 'active' ? 'bg-green-100 text-green-800' :
                  worker.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {worker.status}
                </span>
              </div>
              {worker.brigadeId && (
                <p className="text-xs text-gray-500 mt-2">Assigned to brigade</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No workers found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vacation">Vacation</option>
              </select>
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
                disabled={createWorker.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createWorker.isPending ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
