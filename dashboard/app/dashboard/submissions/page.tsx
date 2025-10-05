import SubmissionsClient from "@/components/SubmissionsClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateStudent, getOrCreateProject } from "@/lib/actions/students";
import { getSubmissions, getSubmissionProgress } from "@/lib/actions/submissions";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function SubmissionsPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const isBkcStudent = email.endsWith("@bkc.met.edu");

  // Only allow BKC students
  if (!isBkcStudent) {
    redirect("/dashboard");
  }

  // Get or create student and project
  const student = await getOrCreateStudent();
  const project = await getOrCreateProject(student.id);

  // Get all submission requirements
  const supabase = createAdminClient();
  const { data: requirements } = await supabase
    .from("submission_requirements")
    .select("*")
    .order("number");

  // Get submissions for this project
  const submissions = await getSubmissions(project.id);

  // Get progress
  const progress = await getSubmissionProgress(project.id);

  // Map requirements with submission status
  const submissionsWithStatus = requirements?.map((req) => {
    const submission = submissions.find((s: any) => s.requirement_id === req.id);
    return {
      number: req.number.toString(),
      title: req.title,
      description: req.description,
      status: (submission?.status || "pending") as "pending" | "completed" | "in-progress",
      projectId: project.id,
      requirementId: req.id,
      submissionId: submission?.id,
      fileName: submission?.file_name,
      fileUrl: submission?.file_url,
    };
  }) || [];

  return (
    <SubmissionsClient
      initialSubmissions={submissionsWithStatus}
      initialProgress={progress}
    />
  );
}