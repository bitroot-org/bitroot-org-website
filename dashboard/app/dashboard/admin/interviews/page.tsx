import { requireAdmin } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminInterviewsPage({
  searchParams,
}: {
  searchParams: { university?: string };
}) {
  await requireAdmin();

  const supabase = createAdminClient();

  // Build query
  let query = supabase
    .from("interview_sessions")
    .select(`
      *,
      university:universities(id, name, location),
      interview_participants(count)
    `)
    .order("scheduled_date", { ascending: false });

  // Filter by university if specified
  if (searchParams.university) {
    query = query.eq("university_id", searchParams.university);
  }

  const { data: sessions, error } = await query;

  if (error) {
    console.error("Error fetching interview sessions:", error);
  }

  // Fetch all universities for filter
  const { data: universities } = await supabase
    .from("universities")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const totalSessions = sessions?.length || 0;
  const upcomingSessions = sessions?.filter((s) => new Date(s.scheduled_date) > new Date()).length || 0;
  const completedSessions = sessions?.filter((s) => s.status === "completed").length || 0;

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Interview Sessions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage interview schedules across universities
          </p>
        </div>
        <Link
          href="/dashboard/admin/interviews/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule Interview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Total Sessions
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalSessions}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Upcoming
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {upcomingSessions}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Completed
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {completedSessions}
          </div>
        </div>
      </div>

      {/* University Filter */}
      {universities && universities.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by University:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/dashboard/admin/interviews"
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                !searchParams.university
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              All
            </Link>
            {universities.map((uni: any) => (
              <Link
                key={uni.id}
                href={`/dashboard/admin/interviews?university=${uni.id}`}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  searchParams.university === uni.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {uni.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {sessions?.map((session: any) => {
                const sessionDate = new Date(session.scheduled_date);
                const isUpcoming = sessionDate > new Date();

                return (
                  <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {session.university?.name || "Unknown"}
                        </div>
                        {session.university?.location && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {session.university.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {sessionDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        {session.interview_format || "Not specified"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {session.interview_participants?.[0]?.count || 0} students
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[session.status as keyof typeof statusColors] || statusColors.scheduled
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/interviews/${session.id}`}
                          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/admin/interviews/${session.id}/edit`}
                          className="font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {sessions?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mt-6">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No interview sessions</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started by scheduling an interview session.
          </p>
        </div>
      )}
    </div>
  );
}
