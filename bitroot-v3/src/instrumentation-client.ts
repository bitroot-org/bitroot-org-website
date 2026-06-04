import posthog from "posthog-js";

// Client-side analytics for bitroot.org. Shares one PostHog project with the
// .club site — events are separated downstream by $host / $current_url.
// Runs on the client before hydration (Next.js instrumentation-client hook).
posthog.init("phc_HEqGPywWHRyDfasXvZMuRz2Vs8ip24tGXUYNRySQ4sx", {
  api_host: "https://us.i.posthog.com",
  // Autocapture pageviews + pageleaves, including App Router client-side
  // navigations (history changes), plus sensible modern defaults.
  defaults: "2025-05-24",
});
