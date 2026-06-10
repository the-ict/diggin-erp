'use client';

import { useState } from 'react';
import { useWells, useCreateWell } from '@/shared/hooks/useWells';
import { Well } from '@/shared/config/api/wells';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/shared/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2563eb', '#6b7280', '#16a34a'];

export default function WellsPage() {
  const { data: wells, isLoading, error } = useWells();
  const createWell = useCreateWell();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    location: '',
    plannedDepth: 0,
    actualDepth: 0,
    status: 'planned' as 'active' | 'planned' | 'completed',
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Wells</h1>
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
          <h1 className="text-2xl font-semibold text-gray-900">Wells</h1>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load wells</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWell.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ code: '', location: '', plannedDepth: 0, actualDepth: 0, status: 'planned' });
    } catch (error) {
      console.error('Failed to create well:', error);
    }
  };

  const totalPlannedDepth = wells ? wells.reduce((sum, w) => sum + w.plannedDepth, 0) : 0;
  const totalActualDepth = wells ? wells.reduce((sum, w) => sum + w.actualDepth, 0) : 0;
  const completionRate = totalPlannedDepth > 0 ? ((totalActualDepth / totalPlannedDepth) * 100).toFixed(1) : 0;
  const wellStatusData = wells ? [
    { name: 'Active', value: wells.filter(w => w.status === 'active').length },
    { name: 'Planned', value: wells.filter(w => w.status === 'planned').length },
    { name: 'Completed', value: wells.filter(w => w.status === 'completed').length },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Wells</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Well
        </button>
      </div>
      
      {/* Statistics Cards */}
      {wells && wells.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Wells</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{wells.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Drilled</p>
            <p className="mt-2 text-2xl font-semibold text-blue-600">{totalActualDepth}m</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completion Rate</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">{completionRate}%</p>
          </div>
        </div>
      )}

      {/* Charts */}
      {wells && wells.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={wellStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wellStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Depth Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Planned', depth: totalPlannedDepth },
                { name: 'Actual', depth: totalActualDepth },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="depth" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {wells && wells.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wells.map((well: Well) => (
            <div key={well._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{well.code}</h3>
                  <p className="text-sm text-gray-600">{well.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {well.actualDepth} / {well.plannedDepth}m
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  well.status === 'active' ? 'bg-green-100 text-green-800' :
                  well.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {well.status}
                </span>
              </div>
              {well.machineId && (
                <p className="text-xs text-gray-500 mt-2">Machine assigned</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No wells found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add New Well</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Depth (m)</label>
              <input
                type="number"
                required
                value={formData.plannedDepth}
                onChange={(e) => setFormData({ ...formData, plannedDepth: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Actual Depth (m)</label>
              <input
                type="number"
                value={formData.actualDepth}
                onChange={(e) => setFormData({ ...formData, actualDepth: Number(e.target.value) })}
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
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
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
                disabled={createWell.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createWell.isPending ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
