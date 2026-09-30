/*
 * PostHog helpers for the blog (mirrors bitroot-v3/src/lib/analytics.ts).
 * Load BEFORE the inline posthog.init snippet, which passes
 * `before_send: window.bitrootBeforeSend`.
 *
 *  - bitrootBeforeSend: normalise $current_url / $pathname (strip tracking
 *    params, enforce trailing slash) so URL variants share one analytics row.
 *    posthog-js reads utm_* into its own props before this runs.
 *  - page_scroll_25/50/70/75: each fired once per page view at that depth —
 *    same event names as the other Bitroot surfaces, split by the `site`
 *    super property.
 */
(function () {
  var TRACKING = /^(utm_[a-z]+|gclid|gbraid|wbraid|fbclid|msclkid|ttclid|twclid|li_fat_id|mc_cid|mc_eid|ref|ref_src)$/i;
  var HAS_EXT = /\.[a-z0-9]+$/i;

  function normalizeUrl(raw) {
    try {
      var url = new URL(raw);
      Array.from(url.searchParams.keys()).forEach(function (k) {
        if (TRACKING.test(k)) url.searchParams.delete(k);
      });
      if (!HAS_EXT.test(url.pathname) && url.pathname.slice(-1) !== '/') {
        url.pathname += '/';
      }
      return url.toString();
    } catch (e) {
      return raw;
    }
  }

  window.bitrootBeforeSend = function (event) {
    var p = event && event.properties;
    if (!p) return event;
    if (typeof p.$current_url === 'string') p.$current_url = normalizeUrl(p.$current_url);
    if (typeof p.$pathname === 'string' && !HAS_EXT.test(p.$pathname) && p.$pathname.slice(-1) !== '/') {
      p.$pathname += '/';
    }
    return event;
  };

  // Milestones (% of page depth). 70 stays for parity with the other surfaces;
  // 25/50/75 give the drop-off curve. Each fires once per page view.
  var MILESTONES = [25, 50, 70, 75];
  var fired = {};
  function onScroll() {
    var doc = document.documentElement;
    // Skip pages that barely scroll: 70% of a viewport-sized page says nothing.
    if (doc.scrollHeight < window.innerHeight * 1.2) return;
    var depth = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
    for (var i = 0; i < MILESTONES.length; i++) {
      var m = MILESTONES[i];
      if (!fired[m] && depth >= m) {
        fired[m] = true;
        if (window.posthog && typeof window.posthog.capture === 'function') {
          window.posthog.capture('page_scroll_' + m, { pathname: window.location.pathname });
        }
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
