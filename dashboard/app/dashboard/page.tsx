import { currentUser } from "@clerk/nextjs/server";
import CountdownTimer from "@/components/CountdownTimer";
import { getActiveProjectsCount, getTotalProjectsCount, getMyAssignedProject, getRound1Submission, isRound2Participant } from "@/lib/actions/projects";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const isBkcStudent = email.endsWith("@bkc.met.edu");
  const firstName = user?.firstName || "Student";

  const activeProjectsCount = await getActiveProjectsCount();
  const totalProjectsCount = await getTotalProjectsCount();
  const myProject = await getMyAssignedProject();
  const round1Submission = await getRound1Submission();
  const { isParticipant: isRound2, teamId } = await isRound2Participant();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {isBkcStudent
            ? "Here's an overview of your BKC projects and timelines."
            : "Here's an overview of your projects and timelines."}
        </p>
      </div>

      {/* Stats and Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                My Active Projects
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {activeProjectsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Assigned to you
              </div>
            </div>
            <div className="h-16 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Total Projects
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {totalProjectsCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                All teams
              </div>
            </div>
          </div>
        </div>

        <CountdownTimer />
      </div>

      {/* Round 2 Badge */}
      {isRound2 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R2</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Round 2 Participant - Team {teamId}
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                You've been selected for Round 2! Check your team project below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Assigned Project (Round 2) */}
      {myProject && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Round 2 Team Project
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {myProject.team_number && (
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        T{myProject.team_number}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {myProject.title}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Active
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                {myProject.description}
              </p>

              {myProject.team_members && myProject.team_members.length > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team:</span>
                  {myProject.team_members.map((member: string, index: number) => (
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
                <div className="flex items-center gap-2">
                  {myProject.category && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {myProject.category}
                    </span>
                  )}
                </div>
                <Link
                  href={`/dashboard/projects/${myProject.id}`}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  View Details
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Round 1 Submission */}
      {round1Submission && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Round 1 Submission
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {round1Submission.project_title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {round1Submission.chosen_usecase}
                  </p>
                </div>
                {round1Submission.reviewed ? (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Reviewed
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                    Pending Review
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {round1Submission.short_description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {round1Submission.models_or_apis_used && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">APIs/Models Used</span>
                    <p className="text-sm text-slate-900 dark:text-white mt-1">
                      {round1Submission.models_or_apis_used}
                    </p>
                  </div>
                )}
                {round1Submission.submission_date && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Submitted On</span>
                    <p className="text-sm text-slate-900 dark:text-white mt-1">
                      {new Date(round1Submission.submission_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {round1Submission.github_repo_url && (
                  <a
                    href={round1Submission.github_repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {round1Submission.deployed_demo_link && round1Submission.deployed_demo_link !== 'N/A' && !round1Submission.deployed_demo_link.includes('issue') && !round1Submission.deployed_demo_link.includes('Not Deployed') && (
                  <a
                    href={round1Submission.deployed_demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {round1Submission.demo_video_link && (
                  <a
                    href={round1Submission.demo_video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Demo Video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
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
              No recent activity
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your activity will appear here once you start working on projects.
            </p>
          </div>
        </div>
      </div>

      {/* BKC Student Extra Info */}
      {isBkcStudent && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                BKC Student Access
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                As a BKC student, you have access to additional features including
                Analytics, Resources, and Settings. Explore the sidebar to see
                all available options.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}