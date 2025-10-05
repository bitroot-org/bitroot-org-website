import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const email = user.emailAddresses?.[0]?.emailAddress || "";
  const supabase = createAdminClient();

  // Fetch student data
  const { data: student, error } = await supabase
    .from("students")
    .select(`
      *,
      projects:projects(count)
    `)
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching student data:", error);
  }

  const isBkcStudent = email.endsWith("@bkc.met.edu");

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View your personal information and activity
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">
              {student?.first_name?.charAt(0) || email.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {student?.first_name} {student?.last_name}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mb-4">{email}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {isBkcStudent ? "BKC Student" : "External Student"}
              </span>
              {student?.role === "admin" && (
                <span className="px-3 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Projects Assigned
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {student?.projects?.[0]?.count || 0}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Submissions Made
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            0
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Interview Sessions
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            0
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">First Name</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white">
              {student?.first_name || "Not set"}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Name</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white">
              {student?.last_name || "Not set"}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white">
              {email}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Student Type</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white">
              {student?.is_bkc_student ? "BKC Student" : "External Student"}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Role</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white capitalize">
              {student?.role || "Student"}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Member Since</label>
            <div className="mt-1 text-base text-slate-900 dark:text-white">
              {student?.created_at ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Unknown"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
