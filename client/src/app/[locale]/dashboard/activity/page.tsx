'use client';

import { useActivity } from '@/shared/hooks/useDashboard';

export default function ActivityPage() {
  const { data: activity, isLoading, error } = useActivity(50);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Activity Log</h1>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Activity Log</h1>
        <div className="rounded-lg border bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-600">Failed to load activity</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Activity Log</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {activity && activity.length > 0 ? (
          <div className="space-y-3">
            {activity.map((item, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No activity found</p>
        )}
      </div>
    </div>
  );
}
