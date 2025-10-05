"use client";

import { useState, useTransition } from "react";
import SubmissionCard from "./SubmissionCard";
import { useRouter } from "next/navigation";

interface Submission {
  number: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "in-progress";
  projectId: string;
  requirementId: string;
  submissionId?: string;
  fileName?: string;
  fileUrl?: string;
}

interface Progress {
  completed: number;
  total: number;
  percentage: number;
}

interface SubmissionsClientProps {
  initialSubmissions: Submission[];
  initialProgress: Progress;
}

export default function SubmissionsClient({
  initialSubmissions,
  initialProgress,
}: SubmissionsClientProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [progress, setProgress] = useState(initialProgress);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUploadSuccess = (requirementId: string, fileName: string) => {
    // Optimistically update UI
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.requirementId === requirementId
          ? { ...sub, status: "completed" as const, fileName }
          : sub
      )
    );

    // Update progress optimistically
    const newCompleted = progress.completed + 1;
    setProgress({
      completed: newCompleted,
      total: progress.total,
      percentage: (newCompleted / progress.total) * 100,
    });

    // Refresh server data in background
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDeleteSuccess = (requirementId: string) => {
    // Optimistically update UI
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.requirementId === requirementId
          ? { ...sub, status: "pending" as const, fileName: undefined, fileUrl: undefined, submissionId: undefined }
          : sub
      )
    );

    // Update progress optimistically
    const newCompleted = progress.completed - 1;
    setProgress({
      completed: newCompleted,
      total: progress.total,
      percentage: (newCompleted / progress.total) * 100,
    });

    // Refresh server data in background
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Submission Requirements
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Complete all submission requirements to successfully finish your project
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Overall Progress
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {progress.completed} / {progress.total}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Submission Cards - Vertical Stack */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.number}
            number={submission.number}
            title={submission.title}
            description={submission.description}
            status={submission.status}
            projectId={submission.projectId}
            requirementId={submission.requirementId}
            submissionId={submission.submissionId}
            fileName={submission.fileName}
            fileUrl={submission.fileUrl}
            onUploadSuccess={(fileName) => handleUploadSuccess(submission.requirementId, fileName)}
            onDeleteSuccess={() => handleDeleteSuccess(submission.requirementId)}
          />
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
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
              Need Help?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you have questions about any submission requirement, reach out to your project
              mentor or check the Resources section for detailed guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
