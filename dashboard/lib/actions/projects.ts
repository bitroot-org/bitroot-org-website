"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserProjects() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const supabase = createAdminClient();

  // Get all projects (show all team projects to everyone)
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("team_number", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }

  return projects || [];
}

export async function getActiveProjectsCount() {
  const user = await currentUser();

  if (!user) {
    return 0;
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";

  // Get student record
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", email)
    .single();

  if (!student) {
    return 0;
  }

  // Count active projects assigned to this student
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("student_id", student.id)
    .eq("status", "active");

  if (error) {
    console.error("Error counting projects:", error);
    return 0;
  }

  return count || 0;
}

export async function getTotalProjectsCount() {
  const supabase = createAdminClient();

  // Count all projects (all teams)
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error counting total projects:", error);
    return 0;
  }

  return count || 0;
}

export async function getMyAssignedProject() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";

  // Get student record
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", email)
    .single();

  if (!student) {
    return null;
  }

  // Get the project assigned to this student
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("student_id", student.id)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching assigned project:", error);
    return null;
  }

  return project;
}

export async function getRound1Submission() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";

  const { data: submission } = await supabase
    .from("round1_submissions")
    .select("*")
    .eq("email", email)
    .single();

  return submission;
}

export async function isRound2Participant() {
  const user = await currentUser();

  if (!user) {
    return { isParticipant: false, teamId: null };
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";

  const { data: student } = await supabase
    .from("students")
    .select("round2_participant, team_id")
    .eq("email", email)
    .single();

  return {
    isParticipant: student?.round2_participant || false,
    teamId: student?.team_id || null
  };
}
