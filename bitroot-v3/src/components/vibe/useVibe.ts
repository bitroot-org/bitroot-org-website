"use client";

import { useSyncExternalStore } from "react";
import { getServerVibe, getVibe, subscribeVibe, type Vibe } from "@/lib/vibe";

/** Current vibe. Server render (and first hydration pass) is always "bruh". */
export function useVibe(): Vibe {
  return useSyncExternalStore(subscribeVibe, getVibe, getServerVibe);
}
