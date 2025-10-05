import { getUserProjects } from "@/lib/actions/projects";
import ProjectCard from "@/components/ProjectCard";

export default async function ProjectsPage() {
  const projects = await getUserProjects();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Projects
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View and manage your assigned projects
        </p>
      </div>

      {projects.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your assigned projects will appear here once allocated.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              status={project.status}
              teamNumber={project.team_number}
              teamMembers={project.team_members}
              category={project.category}
              createdAt={project.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}