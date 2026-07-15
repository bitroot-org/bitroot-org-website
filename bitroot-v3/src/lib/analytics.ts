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
 *   - early_access_submit { product, program, name?, handle?, context? }
 *   - contact_submit     { topic?, location }
 *
 * Identity: on any form submit that collects an email, call identify(email)
 * so the anonymous session merges into a person profile keyed by email. This
 * is what links session replays + the full pre-signup journey to a known
 * person in PostHog. Pass any extra known fields (name) as person props.
 *
 * posthog-js is loaded lazily off the critical path (see
 * instrumentation-client.ts); events fired before it is ready are queued
 * and flushed on connect.
 */

type Action = (posthog: PostHog) => void;

let client: PostHog | null = null;
const queue: Action[] = [];

function run(action: Action) {
  if (typeof window === "undefined") return;
  if (client) {
    action(client);
    return;
  }
  queue.push(action);
}

export function track(event: string, props?: Record<string, unknown>) {
  run((posthog) => posthog.capture(event, props));
}

/**
 * Associate the current (anonymous) session with a person keyed by email, and
 * set person properties. Use the email as the distinct id so a returning
 * visitor on another device/session resolves to the same profile. Identifying
 * merges all prior anonymous activity into the profile, which is what links
 * session replays + the pre-conversion journey to a known person.
 *
 * Every identify also stamps site + last-active props ($set) and first-touch
 * site ($set_once). First-touch UTM/referrer/landing are added automatically
 * by posthog-js as $initial_* $set_once props — we don't re-set those here.
 *
 * `set` overwrites on every call; `setOnce` only writes if the property is not
 * already present (first-touch values like signup date).
 */
export function identify(
  email: string,
  set?: Record<string, unknown>,
  setOnce?: Record<string, unknown>,
) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return;
  const page =
    typeof window !== "undefined" ? window.location.pathname : undefined;
  run((posthog) =>
    posthog.identify(
      trimmed,
      {
        email: trimmed,
        last_active_site: "bitroot.org",
        last_active_date: today(),
        ...(page ? { last_converted_page: page } : {}),
        ...set,
      },
      { first_seen_site: "bitroot.org", ...setOnce },
    ),
  );
}

/** YYYY-MM-DD in the visitor's locale-independent ISO form. */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Called once by instrumentation-client.ts after the lazy posthog init. */
export function connectAnalytics(posthog: PostHog) {
  client = posthog;
  for (const action of queue.splice(0)) {
    action(posthog);
  }
}
