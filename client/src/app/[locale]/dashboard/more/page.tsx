export default function MorePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">More</h1>
      <div className="space-y-3">
        <a
          href="/uz/dashboard/brigades"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Brigades</p>
              <p className="text-sm text-gray-500">Manage drilling teams</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
        <a
          href="/uz/dashboard/machines"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Machines</p>
              <p className="text-sm text-gray-500">Manage drilling equipment</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
        <a
          href="/uz/dashboard/purchases"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Purchases</p>
              <p className="text-sm text-gray-500">Track procurement</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
        <a
          href="/uz/dashboard/activity"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Activity Log</p>
              <p className="text-sm text-gray-500">View system activity</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
        <a
          href="/uz/dashboard/settings"
          className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500">Configure system</p>
            </div>
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
