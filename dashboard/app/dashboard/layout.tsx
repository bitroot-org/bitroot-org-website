import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUserRole } from "@/lib/actions/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();

    // Redirect to home if not authenticated
    if (!userId) {
      redirect("/");
    }

    // Get current user to check email domain
    const user = await currentUser();

    if (!user) {
      console.error("User not found despite having userId");
      redirect("/");
    }

    const email = user.emailAddresses?.[0]?.emailAddress || "";
    const isBkcStudent = email.endsWith("@bkc.met.edu");

    // Link Clerk ID to existing student record if needed
    const supabase = createAdminClient();
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id, clerk_id")
      .eq("email", email)
      .single();

    if (existingStudent && !existingStudent.clerk_id) {
      // Student exists but doesn't have clerk_id - link it now
      await supabase
        .from("students")
        .update({ clerk_id: userId })
        .eq("email", email);
      console.log("Linked Clerk ID to existing student:", email);
    }

    const userRole = await getCurrentUserRole();

    console.log("Dashboard layout loaded for:", email, "isBkcStudent:", isBkcStudent, "role:", userRole);

    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar isBkcStudent={isBkcStudent} userEmail={email} userRole={userRole || "student"} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    redirect("/");
  }
}