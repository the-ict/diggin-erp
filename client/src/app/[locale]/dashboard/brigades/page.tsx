'use client';

import { useState } from 'react';
import { Brigade } from '@/shared/config/api/brigades';
import { useBrigades, useCreateBrigade } from '@/shared/hooks/useBrigades';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/shared/ui/dialog';

export default function BrigadesPage() {
  const { data: brigades, isLoading, error } = useBrigades();
  const createBrigade = useCreateBrigade();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    workers: [] as string[],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Brigades</h1>
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
          <h1 className="text-2xl font-semibold text-gray-900">Brigades</h1>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load brigades</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBrigade.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', workers: [] });
    } catch (error) {
      console.error('Failed to create brigade:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Brigades</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Brigade
        </button>
      </div>
      
      {brigades && brigades.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brigades.map((brigade: Brigade) => (
            <div key={brigade._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="font-medium text-gray-900">{brigade.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{brigade.workers.length} workers</p>
              {brigade.machineId && (
                <p className="text-xs text-gray-500 mt-2">Machine assigned</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No brigades found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add New Brigade</DialogTitle>
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
                disabled={createBrigade.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createBrigade.isPending ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
