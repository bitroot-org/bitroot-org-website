/**
 * Newsletter capture for blog post pages.
 *
 * Wires every [data-nl-form] to the bitroot-forms Worker (same endpoint the
 * main site uses), reports a `newsletter_signup` event to the shared PostHog
 * project, and — when the `blog-newsletter-boost` feature flag is on (or
 * ?nl=boost is in the URL) — reveals a sticky bottom CTA after the reader
 * scrolls in. The flag lets us push the CTA harder during a traffic spike
 * without shipping anything.
 */
(function () {
  var ENDPOINT = 'https://api.bitroot.in/v1/newsletter';
  var LS_DONE = 'nl-subscribed';
  var LS_DISMISS = 'nl-sticky-dismissed';

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function track(event, props) {
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(event, props || {});
    }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function wireForm(form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector('[data-nl-status]');
    var button = form.querySelector('button');
    var location = form.getAttribute('data-nl-location') || 'blog';

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg || '';
      status.setAttribute('data-nl-kind', kind || '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input && input.value || '').trim();
      if (!validEmail(email)) {
        setStatus('Enter a valid email.', 'error');
        return;
      }
      if (button) button.disabled = true;
      setStatus('Subscribing…', 'loading');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, location: location, site: 'org' }),
      })
        .then(function (r) { return r.json().catch(function () { return null; }); })
        .then(function (data) {
          if (data && data.ok) {
            lsSet(LS_DONE, '1');
            setStatus('Check your inbox to confirm. ✦', 'done');
            if (input) input.value = '';
            if (window.posthog && typeof window.posthog.identify === 'function') {
              window.posthog.identify(email, { newsletter_subscriber: true });
            }
            track('newsletter_signup', { location: location });
            hideSticky();
          } else {
            if (button) button.disabled = false;
            setStatus('Something went wrong. Try again.', 'error');
          }
        })
        .catch(function () {
          if (button) button.disabled = false;
          setStatus('Network error. Try again.', 'error');
        });
    });
  }

  /* ---- sticky bottom CTA (feature-flag / query gated) ---- */

  var sticky = null;

  function hideSticky() {
    if (sticky) sticky.hidden = true;
  }

  function armSticky() {
    sticky = document.querySelector('[data-nl-sticky]');
    if (!sticky) return;
    if (lsGet(LS_DONE) === '1' || lsGet(LS_DISMISS) === '1') return;

    var shown = false;
    function maybeShow() {
      if (shown) return;
      var scrolled = (window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight;
      if (scrolled < 0.55) return;
      shown = true;
      sticky.hidden = false;
      requestAnimationFrame(function () { sticky.classList.add('nl-sticky--in'); });
      track('newsletter_cta_shown', { variant: 'sticky' });
      window.removeEventListener('scroll', maybeShow);
    }
    window.addEventListener('scroll', maybeShow, { passive: true });
    maybeShow();

    var close = sticky.querySelector('[data-nl-close]');
    if (close) {
      close.addEventListener('click', function () {
        sticky.hidden = true;
        lsSet(LS_DISMISS, '1');
        track('newsletter_cta_dismissed', { variant: 'sticky' });
      });
    }
  }

  function boostRequested() {
    try {
      var qs = new URLSearchParams(window.location.search);
      if (qs.get('nl') === 'boost') {
        sessionStorage.setItem('nl-boost', '1');
        return true;
      }
      if (sessionStorage.getItem('nl-boost') === '1') return true;
    } catch (e) {}
    return false;
  }

  function init() {
    var forms = document.querySelectorAll('[data-nl-form]');
    for (var i = 0; i < forms.length; i++) wireForm(forms[i]);

    // Hide the always-on inline CTA once someone has subscribed.
    if (lsGet(LS_DONE) === '1') {
      var inline = document.querySelector('.post-newsletter');
      if (inline) {
        inline.innerHTML =
          '<p class="post-newsletter-done">You’re on the list. ✦</p>';
      }
    } else {
      track('newsletter_cta_shown', { variant: 'inline' });
    }

    if (boostRequested()) {
      armSticky();
    } else if (window.posthog && typeof window.posthog.onFeatureFlags === 'function') {
      window.posthog.onFeatureFlags(function () {
        if (window.posthog.isFeatureEnabled &&
            window.posthog.isFeatureEnabled('blog-newsletter-boost')) {
          armSticky();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
