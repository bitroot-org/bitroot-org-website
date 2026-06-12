import { connectAnalytics } from "@/lib/analytics";

// Client-side analytics for bitroot.org. Shares one PostHog project with the
// .club site — events are separated downstream by $host / $current_url.
//
// posthog-js (~50KB gzip) is dynamically imported on idle so it stays out of
// the critical entry bundle; conversion events fired before init are queued
// in src/lib/analytics.ts and flushed on connect. The initial $pageview is
// captured by posthog.init itself, so nothing is lost by deferring.
function loadPosthog() {
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init("phc_HEqGPywWHRyDfasXvZMuRz2Vs8ip24tGXUYNRySQ4sx", {
      api_host: "https://us.i.posthog.com",
      // Autocapture pageviews + pageleaves, including App Router client-side
      // navigations (history changes), plus sensible modern defaults.
      defaults: "2025-05-24",
    });

    // Tag every event with the surface it came from so the shared PostHog
    // project (bitroot.org / .club / platter / blog) can be segmented by
    // `site`. Set per surface — break down or filter insights by this
    // property instead of prefixing event names.
    posthog.register({ site: "org" });

    connectAnalytics(posthog);
  });
}

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadPosthog, { timeout: 2000 });
  } else {
    setTimeout(loadPosthog, 2000);
  }
}
