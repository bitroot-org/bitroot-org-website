"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectIfAuthenticated() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("User is signed in, redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}