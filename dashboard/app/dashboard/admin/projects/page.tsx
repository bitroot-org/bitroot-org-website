import { requireAdmin } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminProjectsPage() {
  await requireAdmin();

  const supabase = createAdminClient();

  // Fetch all projects with student details
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      student:students(first_name, last_name, email)
    `)
    .order("team_number", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === "active").length || 0;
  const completedProjects = projects?.filter((p) => p.status === "completed").length || 0;

  const statusColors = {
    active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const categoryColors: Record<string, string> = {
    finance: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    marketing: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    devops: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    crm: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    tools: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Project Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage all team projects
          </p>
        </div>
        <Link
          href="/dashboard/admin/projects/create"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Total Projects
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalProjects}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Active
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {activeProjects}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Completed
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {completedProjects}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        {projects?.map((project: any) => (
          <div
            key={project.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {project.team_number && (
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      T{project.team_number}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.student && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Assigned to: {project.student.first_name} {project.student.last_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    statusColors[project.status as keyof typeof statusColors] || statusColors.pending
                  }`}>
                    {project.status}
                  </span>
                  {project.category && (
                    <span className={`px-3 py-1 text-xs font-medium rounded ${
                      categoryColors[project.category] || categoryColors.tools
                    }`}>
                      {project.category}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {project.description}
              </p>

              {project.team_members && project.team_members.length > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team:</span>
                  {project.team_members.map((member: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/admin/projects/${project.id}/edit`}
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

      {projects?.length === 0 && (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No projects</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started by creating a new project.
          </p>
        </div>
      )}
    </div>
  );
}
