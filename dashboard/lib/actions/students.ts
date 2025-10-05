"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateStudent() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";
  const isBkcStudent = email.endsWith("@bkc.met.edu");

  // Check if student exists
  const { data: existingStudent, error: fetchError } = await supabase
    .from("students")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error fetching student:", fetchError);
    throw new Error("Failed to fetch student");
  }

  if (existingStudent) {
    return existingStudent;
  }

  // Create new student
  const { data: newStudent, error: createError } = await supabase
    .from("students")
    .insert({
      clerk_id: user.id,
      email,
      first_name: user.firstName,
      last_name: user.lastName,
      is_bkc_student: isBkcStudent,
    })
    .select()
    .single();

  if (createError) {
    console.error("Error creating student:", createError);
    throw new Error("Failed to create student");
  }

  return newStudent;
}

export async function getOrCreateProject(studentId: string) {
  const supabase = createAdminClient();

  // Check if project exists
  const { data: existingProject, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("student_id", studentId)
    .eq("status", "active")
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching project:", fetchError);
    throw new Error("Failed to fetch project");
  }

  if (existingProject) {
    return existingProject;
  }

  // Create new project
  const { data: newProject, error: createError } = await supabase
    .from("projects")
    .insert({
      student_id: studentId,
      title: "My Project",
      description: "Project description",
      status: "active",
    })
    .select()
    .single();

  if (createError) {
    console.error("Error creating project:", createError);
    throw new Error("Failed to create project");
  }

  // Initialize submissions for all requirements
  const { data: requirements } = await supabase
    .from("submission_requirements")
    .select("id");

  if (requirements) {
    const submissionsToCreate = requirements.map((req) => ({
      project_id: newProject.id,
      requirement_id: req.id,
      status: "pending",
    }));

    await supabase.from("submissions").insert(submissionsToCreate);
  }

  return newProject;
}