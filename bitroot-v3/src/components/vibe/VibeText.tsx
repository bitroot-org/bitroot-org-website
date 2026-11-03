"use client";

import { useVibe } from "./useVibe";

/**
 * Copy that changes with the vibe. The static HTML always carries the Bruh
 * line (one version per page for crawlers); the Baddie line is swapped in on
 * the client. `.vibe-text` stays hidden until then for Baddie visitors.
 */
export default function VibeText({
  bruh,
  baddie,
}: {
  bruh: React.ReactNode;
  baddie: React.ReactNode;
}) {
  const vibe = useVibe();
  return <span className="vibe-text">{vibe === "baddie" ? baddie : bruh}</span>;
}
