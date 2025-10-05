"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {error.message || "An error occurred while loading the dashboard"}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors inline-block"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}