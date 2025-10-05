"use client";

import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  teamNumber?: number;
  teamMembers?: string[];
  category?: string;
  createdAt: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  status,
  teamNumber,
  teamMembers,
  category,
  createdAt,
}: ProjectCardProps) {
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

  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.pending;
  const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.tools;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {teamNumber && (
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  T{teamNumber}
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {teamMembers && teamMembers.length > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team:</span>
            {teamMembers.map((member, index) => (
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
            {category && (
              <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColor}`}>
                {category}
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Created {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <Link
            href={`/dashboard/projects/${id}`}
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
  );
}
