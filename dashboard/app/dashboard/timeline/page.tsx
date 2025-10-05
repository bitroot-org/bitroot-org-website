export default function TimelinePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Timeline
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track milestones and deadlines for your projects
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              No timeline events
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Project milestones and deadlines will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}