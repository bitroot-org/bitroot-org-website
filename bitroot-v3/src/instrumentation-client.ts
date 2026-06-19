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
      // "always": create a person profile for every visitor (incl. anonymous)
      // so geo / device / first-touch UTM land on the person object and power
      // person-level cohorts (e.g. "visitors from India") before any form is
      // filled. PostHog sets $geoip_* and $initial_utm_*/$initial_referrer as
      // person properties automatically on the autocaptured pageview, so this
      // needs no extra $set events and adds no event cost.
      //
      // Billing: the first 1M events/month are free regardless of profile mode,
      // so for bitroot.org's volume this is $0. Above 1M, "always" bills the
      // *entire* event stream at the ~5x identified rate (~$0.000248 vs
      // ~$0.00005/event). If volume approaches 1M/month, switch this back to
      // "identified_only" — converters still keep full first-touch attribution
      // via the persisted $initial_* props applied on identify().
      person_profiles: "always",
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
