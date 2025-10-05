import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ResourcesPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const isBkcStudent = email.endsWith("@bkc.met.edu");

  // Only allow BKC students
  if (!isBkcStudent) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Resources
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Access learning materials and documentation (BKC Students Only)
        </p>
      </div>

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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              No resources yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Learning materials and documentation will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}