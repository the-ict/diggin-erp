'use client';

import { useKPIs, useActivity } from '@/shared/hooks/useDashboard';
import { useWorkers } from '@/shared/hooks/useWorkers';
import { useBrigades } from '@/shared/hooks/useBrigades';
import { useMachines } from '@/shared/hooks/useMachines';
import { useWells } from '@/shared/hooks/useWells';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#ca8a04', '#dc2626'];

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: activity, isLoading: activityLoading } = useActivity();
  const { data: workers } = useWorkers();
  const { data: brigades } = useBrigades();
  const { data: machines } = useMachines();
  const { data: wells } = useWells();

  const workerStatusData = workers ? [
    { name: 'Active', value: workers.filter(w => w.status === 'active').length },
    { name: 'Inactive', value: workers.filter(w => w.status === 'inactive').length },
    { name: 'Vacation', value: workers.filter(w => w.status === 'vacation').length },
  ] : [];

  const machineStatusData = machines ? [
    { name: 'Active', value: machines.filter(m => m.status === 'active').length },
    { name: 'Maintenance', value: machines.filter(m => m.status === 'maintenance').length },
    { name: 'Idle', value: machines.filter(m => m.status === 'idle').length },
  ] : [];

  const wellStatusData = wells ? [
    { name: 'Active', value: wells.filter(w => w.status === 'active').length },
    { name: 'Planned', value: wells.filter(w => w.status === 'planned').length },
    { name: 'Completed', value: wells.filter(w => w.status === 'completed').length },
  ] : [];

  const brigadeWorkerData = brigades ? brigades.map(b => ({
    name: b.name,
    workers: b.workers.length,
  })) : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Wells</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {kpisLoading ? '...' : kpis?.activeWells ?? 0}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Machines</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {kpisLoading ? '...' : kpis?.activeMachines ?? 0}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Drilled This Month</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {kpisLoading ? '...' : kpis?.totalDrilledMeters ?? 0}m
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Low Stock Alerts</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {kpisLoading ? '...' : kpis?.lowStockItems ?? 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Worker Status</h3>
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

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Machine Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={machineStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {machineStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Well Status</h3>
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
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Workers per Brigade</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={brigadeWorkerData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="workers" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          {activityLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : activity && activity.length > 0 ? (
            <div className="space-y-2">
              {activity.map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-2 border-b last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
