import type { PostHog } from "posthog-js";

/**
 * Thin wrapper over posthog.capture for explicit conversion events.
 *
 * Keep event names stable and shared across Bitroot surfaces (org / blog /
 * platter / club) so funnels work cross-site — the `site` super property
 * (set in instrumentation-client.ts) separates them. Do NOT prefix event
 * names per site; segment by the `site` breakdown instead.
 *
 * Canonical conversion events:
 *   - cta_click          { label, location, href? }
 *   - newsletter_signup  { location }
 *   - early_access_submit { product, program }
 *
 * posthog-js is loaded lazily off the critical path (see
 * instrumentation-client.ts); events fired before it is ready are queued
 * and flushed on connect.
 */

type Queued = { event: string; props?: Record<string, unknown> };

let client: PostHog | null = null;
const queue: Queued[] = [];

export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (client) {
    client.capture(event, props);
    return;
  }
  queue.push({ event, props });
}

/** Called once by instrumentation-client.ts after the lazy posthog init. */
export function connectAnalytics(posthog: PostHog) {
  client = posthog;
  for (const { event, props } of queue.splice(0)) {
    posthog.capture(event, props);
  }
}
