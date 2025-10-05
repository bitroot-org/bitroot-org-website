"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserRole() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress || "";

  const { data: student } = await supabase
    .from("students")
    .select("role")
    .eq("email", email)
    .single();

  return student?.role || "student";
}

export async function isAdmin() {
  const role = await getCurrentUserRole();
  return role === "admin";
}

export async function requireAdmin() {
  const admin = await isAdmin();

  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return true;
}
