import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();

  // Fetch project details
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const statusColors = {
    active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const categoryColors = {
    finance: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    marketing: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    devops: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    crm: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    tools: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  };

  const statusColor = statusColors[project.status as keyof typeof statusColors] || statusColors.pending;
  const categoryColor = categoryColors[project.category as keyof typeof categoryColors] || categoryColors.tools;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {project.team_number && (
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  T{project.team_number}
                </div>
              )}
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {project.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              {project.category && (
                <span className={`px-3 py-1 text-sm font-medium rounded ${categoryColor}`}>
                  {project.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      {project.team_members && project.team_members.length > 0 && (
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Team Members</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {project.team_members.map((member: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {member.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {member}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Project Description</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* PDF Viewer */}
      {project.pdf_file && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Project Brief
            </h2>
            <a
              href={project.pdf_file}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
          <div className="w-full h-[800px]">
            <iframe
              src={project.pdf_file}
              className="w-full h-full"
              title="Project Brief PDF"
            />
          </div>
        </div>
      )}

      {!project.pdf_file && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                No Project Brief Available
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                The project brief PDF has not been uploaded yet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
