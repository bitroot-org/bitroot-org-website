"use client";

import { useEffect } from "react";
import { markVibeReady } from "@/lib/vibe";

/** Lifts the no-flash guard once hydration has swapped vibe copy. */
export default function VibeReady() {
  useEffect(() => {
    markVibeReady();
  }, []);
  return null;
}
