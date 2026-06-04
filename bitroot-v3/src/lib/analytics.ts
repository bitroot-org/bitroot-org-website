import posthog from "posthog-js";

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
 */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, props);
}
