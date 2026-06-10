'use client';

import { 
  useState
} from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter
} from '@/shared/ui/dialog';
import {
  useMachines,
  useCreateMachine
} from '@/shared/hooks/useMachines';
import {
  Machine
} from '@/shared/config/api/machines';

export default function MachinesPage() {
  const { data: machines, isLoading, error } = useMachines();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    status: 'active' as 'active' | 'maintenance' | 'idle',
  });
  const createMachine = useCreateMachine();

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Machines</h1>
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
          <h1 className="text-2xl font-semibold text-gray-900">Machines</h1>
        </div>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load machines</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMachine.mutateAsync(formData);
      setIsDialogOpen(false);
      setFormData({ name: '', serialNumber: '', status: 'active' });
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  };

  const assignedCount = machines ? machines.filter(m => m.currentWell).length : 0;
  const unassignedCount = machines ? machines.filter(m => !m.currentWell).length : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Machines</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Machine
        </button>
      </div>

      {/* Statistics Cards */}
      {machines && machines.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Machines</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{machines.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Assigned to Wells</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">{assignedCount}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Unassigned</p>
            <p className="mt-2 text-2xl font-semibold text-gray-600">{unassignedCount}</p>
          </div>
        </div>
      )}

      {machines && machines.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine: Machine) => (
            <div key={machine._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{machine.name}</h3>
                  <p className="text-sm text-gray-600">{machine.serialNumber}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${machine.status === 'active' ? 'bg-green-100 text-green-800' :
                  machine.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {machine.status}
                </span>
              </div>
              {machine.currentWell && (
                <p className="text-xs text-gray-500 mt-2">Assigned to well</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">No machines found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add New Machine</DialogTitle>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input
                type="text"
                required
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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
                <option value="maintenance">Maintenance</option>
                <option value="idle">Idle</option>
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
                disabled={createMachine.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createMachine.isPending ? 'Creating...' : 'Create'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
