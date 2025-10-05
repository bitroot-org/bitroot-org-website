import { requireAdmin } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminUniversitiesPage() {
  await requireAdmin();

  const supabase = createAdminClient();

  // Fetch all universities with interview session counts
  const { data: universities, error } = await supabase
    .from("universities")
    .select(`
      *,
      interview_sessions(count)
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching universities:", error);
  }

  const totalUniversities = universities?.length || 0;
  const activeUniversities = universities?.filter((u) => u.is_active).length || 0;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Universities
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage universities and their interview schedules
          </p>
        </div>
        <Link
          href="/dashboard/admin/universities/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add University
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Total Universities
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalUniversities}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Active
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {activeUniversities}
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities?.map((university: any) => (
          <div
            key={university.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {university.name}
                  </h3>
                  {university.location && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {university.location}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  university.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  {university.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {university.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {university.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {university.interview_sessions?.[0]?.count || 0} sessions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/admin/interviews?university=${university.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Sessions
                  </Link>
                  <Link
                    href={`/dashboard/admin/universities/${university.id}/edit`}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {universities?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No universities</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started by adding a university.
          </p>
        </div>
      )}
    </div>
  );
}
