import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
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
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your preferences and account settings (BKC Students Only)
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Account Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Account Type
              </label>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                BKC Student
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Preferences
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Additional settings and preferences will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}