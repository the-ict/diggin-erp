import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900">Dribbling ERP</h1>
          </div>
          <nav className="flex-1 px-4 py-2">
            <div className="space-y-1">
              <a
                href={`/${locale}/dashboard`}
                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100"
              >
                Dashboard
              </a>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Operations
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`/${locale}/dashboard/workers`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Workers
                  </a>
                  <a
                    href={`/${locale}/dashboard/brigades`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Brigades
                  </a>
                  <a
                    href={`/${locale}/dashboard/machines`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Machines
                  </a>
                  <a
                    href={`/${locale}/dashboard/wells`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Wells
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Inventory
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`/${locale}/dashboard/warehouse`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Warehouse
                  </a>
                  <a
                    href={`/${locale}/dashboard/purchases`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Purchases
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Reports
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`/${locale}/dashboard/activity`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Activity Log
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Settings
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`/${locale}/dashboard/settings`}
                    className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Mobile Header */}
          <header className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
            <h1 className="text-lg font-semibold text-gray-900">Dribbling ERP</h1>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8 pb-24 lg:pb-8">
            {children}
          </div>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 border-t bg-white lg:hidden">
            <div className="flex items-center justify-around py-2">
              <a
                href={`/${locale}/dashboard`}
                className="flex flex-col items-center px-4 py-2 text-xs font-medium text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
              <a
                href={`/${locale}/dashboard/workers`}
                className="flex flex-col items-center px-4 py-2 text-xs font-medium text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Workers
              </a>
              <a
                href={`/${locale}/dashboard/wells`}
                className="flex flex-col items-center px-4 py-2 text-xs font-medium text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Wells
              </a>
              <a
                href={`/${locale}/dashboard/warehouse`}
                className="flex flex-col items-center px-4 py-2 text-xs font-medium text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Warehouse
              </a>
              <a
                href={`/${locale}/dashboard/more`}
                className="flex flex-col items-center px-4 py-2 text-xs font-medium text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                More
              </a>
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
}
