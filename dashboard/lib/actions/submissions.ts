"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getSubmissions(projectId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(`
      *,
      requirement:submission_requirements(*)
    `)
    .eq("project_id", projectId)
    .order("requirement_id");

  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }

  return data;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: "pending" | "in-progress" | "completed"
) {
  const supabase = createAdminClient();

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "completed") {
    updateData.submitted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("submissions")
    .update(updateData)
    .eq("id", submissionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating submission:", error);
    throw new Error("Failed to update submission");
  }

  revalidatePath("/dashboard/submissions");
  return data;
}

export async function uploadSubmissionFile(
  projectId: string,
  requirementId: string,
  file: File
) {
  const supabase = createAdminClient();

  // Upload file to Supabase Storage
  const fileName = `${projectId}/${requirementId}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("submissions")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw new Error("Failed to upload file");
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("submissions").getPublicUrl(uploadData.path);

  // Update or create submission record
  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .upsert(
      {
        project_id: projectId,
        requirement_id: requirementId,
        file_url: publicUrl,
        file_name: file.name,
        status: "completed",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "project_id,requirement_id",
      }
    )
    .select()
    .single();

  if (submissionError) {
    console.error("Error creating submission:", submissionError);
    throw new Error("Failed to create submission record");
  }

  revalidatePath("/dashboard/submissions");
  return submission;
}

export async function getSubmissionProgress(projectId: string) {
  const supabase = createAdminClient();

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("status")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching progress:", error);
    return { completed: 0, total: 8, percentage: 0 };
  }

  const completed = submissions.filter((s) => s.status === "completed").length;
  const total = 8; // Total number of requirements
  const percentage = (completed / total) * 100;

  return { completed, total, percentage };
}

export async function deleteSubmissionFile(
  submissionId: string,
  fileUrl: string
) {
  const supabase = createAdminClient();

  // Extract file path from URL
  const urlParts = fileUrl.split("/submissions/");
  if (urlParts.length < 2) {
    throw new Error("Invalid file URL");
  }
  const filePath = urlParts[1];

  // Delete file from storage
  const { error: deleteError } = await supabase.storage
    .from("submissions")
    .remove([filePath]);

  if (deleteError) {
    console.error("Error deleting file:", deleteError);
    throw new Error("Failed to delete file from storage");
  }

  // Update submission to remove file reference and reset status
  const { data, error: updateError } = await supabase
    .from("submissions")
    .update({
      file_url: null,
      file_name: null,
      status: "pending",
      submitted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating submission:", updateError);
    throw new Error("Failed to update submission");
  }

  revalidatePath("/dashboard/submissions");
  return data;
}