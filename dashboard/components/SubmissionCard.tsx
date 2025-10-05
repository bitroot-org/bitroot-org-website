"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { deleteSubmissionFile } from "@/lib/actions/submissions";

interface SubmissionCardProps {
  number: string;
  title: string;
  description: string;
  imageUrl?: string;
  status?: "pending" | "completed" | "in-progress";
  projectId?: string;
  requirementId?: string;
  submissionId?: string;
  fileName?: string;
  fileUrl?: string;
  onUploadSuccess?: (fileName: string) => void;
  onDeleteSuccess?: () => void;
}

export default function SubmissionCard({
  number,
  title,
  description,
  imageUrl,
  status = "pending",
  projectId,
  requirementId,
  submissionId,
  fileName,
  fileUrl,
  onUploadSuccess,
  onDeleteSuccess,
}: SubmissionCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColors = {
    pending: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  const handleDelete = async () => {
    if (!submissionId || !fileUrl) return;

    setIsDeleting(true);
    setShowDeleteModal(false);

    // Call optimistic update immediately
    if (onDeleteSuccess) onDeleteSuccess();

    try {
      await deleteSubmissionFile(submissionId, fileUrl);
    } catch (error) {
      console.error("Failed to delete submission:", error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600">
      {/* Horizontal Layout */}
      <div className="flex items-stretch">
        {/* Left Side - Image/Visual */}
        <div className="relative w-64 flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-7xl font-bold text-blue-200 dark:text-slate-600">
                {number}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {number}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusColors[status]}`}>
                {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* File Upload or Status */}
          <div className="mt-4">
            {status === "completed" && fileName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Submitted</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{fileName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="delete-button"
                >
                  <span className="text">Delete</span>
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                    </svg>
                  </span>
                </button>
                <style jsx>{`
                  .delete-button {
                    width: 100px;
                    height: 36px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    background: #e62222;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
                    transition: 200ms;
                    position: relative;
                    overflow: hidden;
                  }

                  .delete-button .text {
                    position: absolute;
                    left: 20px;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                    transition: 200ms;
                  }

                  .delete-button .icon {
                    position: absolute;
                    right: 0;
                    border-left: 1px solid #c41b1b;
                    height: 28px;
                    width: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 200ms;
                  }

                  .delete-button svg {
                    width: 12px;
                    fill: #eee;
                  }

                  .delete-button:hover {
                    background: #ff3636;
                  }

                  .delete-button:hover .text {
                    opacity: 0;
                  }

                  .delete-button:hover .icon {
                    width: 100px;
                    border-left: none;
                    right: 0;
                  }

                  .delete-button:focus {
                    outline: none;
                  }

                  .delete-button:active .icon svg {
                    transform: scale(0.8);
                  }
                `}</style>
              </div>
            ) : projectId && requirementId ? (
              <FileUpload
                projectId={projectId}
                requirementId={requirementId}
                onUploadSuccess={onUploadSuccess}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Delete Submission?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Are you sure you want to delete this submission? This will remove the file and reset the requirement to pending status. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}