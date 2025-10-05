export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-700 flex items-center">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-8">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}