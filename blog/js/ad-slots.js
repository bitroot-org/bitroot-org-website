/**
 * Ad slots — renders slim promo banners in place of `[[ad:slug]]` markers in a
 * post's body, and the click-through modal (media | gated demo).
 *
 * Fully client-side and independent of the static build: ad content and the
 * `active` flag are fetched live from TeamLife on every page load, so toggling
 * an ad off in Blog Studio takes effect immediately with no site rebuild. The
 * markdown compiler (build_post_pages.py) wraps a bare `[[ad:slug]]` line in
 * its own <p>, which is the exact element this script finds and replaces —
 * verified against the same markdown.Markdown(extensions=["extra","sane_lists"])
 * config the build uses.
 *
 * Lead gate mirrors the site's existing content-gate convention (src/lib/gate.ts /
 * GateEmailForm.tsx in bitroot-v3): one shared localStorage flag unlocks every
 * gated demo once a visitor has given their details anywhere, so they're never
 * asked twice.
 */
(function () {
    'use strict';

    var API_BASE = 'https://team.bitroot.club'; // TeamLife: the ad registry only (GET, public, read-only)
    var FORMS_API = 'https://api.bitroot.in'; // bitroot-forms Worker: the actual lead write path
    var LEAD_KEY = 'bitroot_ad_lead_given';
    var DEMO_VIEWS_KEY = 'bitroot_ad_demo_views'; // { [slug]: count } -- per-browser, not a real account limit
    var MARKER_RE = /^\[\[ad:([a-z0-9-]+)\]\]$/;

    var body = document.querySelector('#post-content .post-body');
    if (!body) return;

    var postSlug = (document.querySelector('#post-content') || {}).dataset
        ? document.querySelector('#post-content').dataset.postSlug || null
        : null;

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    }

    /**
     * Source attribution for the lead, packed into `context` (the one free-text
     * field `early_access_requests` offers) so it survives into the internal
     * notify email and the Audience duty without needing a schema change:
     * which ad/post drove it, the referrer, and any UTM params on the URL —
     * the signal that actually helps build an ICP picture later.
     */
    function attributionContext(ad) {
        var parts = ['ad:' + ad.kind + '/' + ad.slug];
        if (postSlug) parts.push('post:' + postSlug);
        try {
            var qs = new URLSearchParams(window.location.search);
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
                var v = qs.get(k);
                if (v) parts.push(k + ':' + v);
            });
        } catch (e) {
            /* URLSearchParams unsupported — skip UTM capture */
        }
        if (document.referrer) parts.push('ref:' + document.referrer);
        parts.push('url:' + window.location.href);
        return parts.join(' · ').slice(0, 2000);
    }

    function findMarkers(root) {
        var out = [];
        var ps = root.querySelectorAll('p');
        for (var i = 0; i < ps.length; i++) {
            var m = MARKER_RE.exec(ps[i].textContent.trim());
            if (m) out.push({ el: ps[i], slug: m[1] });
        }
        return out;
    }

    function leadGiven() {
        try {
            return localStorage.getItem(LEAD_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    function markLeadGiven() {
        try {
            localStorage.setItem(LEAD_KEY, '1');
        } catch (e) {
            /* private mode / storage blocked — the visitor just re-gates next time */
        }
    }

    function demoViewsMap() {
        try {
            var raw = localStorage.getItem(DEMO_VIEWS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function demoViewCount(slug) {
        return demoViewsMap()[slug] || 0;
    }

    /** Counts one real look at the live demo — never called for the gate form itself. */
    function recordDemoView(slug) {
        try {
            var map = demoViewsMap();
            map[slug] = (map[slug] || 0) + 1;
            localStorage.setItem(DEMO_VIEWS_KEY, JSON.stringify(map));
        } catch (e) {
            /* private mode / storage blocked — the free-view cap just never engages */
        }
    }

    function renderBanner(ad) {
        var badge = ad.kind === 'client' ? 'Ad · Partner' : 'Ad · Bitroot';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'promo-banner promo-banner-' + ad.kind + (ad.mediaUrl ? ' promo-banner-has-media' : '');
        var mediaHtml = ad.mediaUrl
            ? '<span class="promo-banner-mockup" aria-hidden="true">' +
              (ad.mediaKind === 'video'
                  ? '<video src="' + esc(ad.mediaUrl) + '" muted playsinline loop autoplay></video>'
                  : '<img src="' + esc(ad.mediaUrl) + '" alt="" loading="lazy">') +
              '</span>'
            : '';
        btn.innerHTML =
            '<span class="promo-banner-glow" aria-hidden="true"></span>' +
            '<span class="promo-banner-content">' +
            '<span class="promo-banner-badge">' + esc(badge) + '</span>' +
            '<strong class="promo-banner-headline">' + esc(ad.productName) + '</strong>' +
            (ad.tagline ? '<span class="promo-banner-tagline">' + esc(ad.tagline) + '</span>' : '') +
            '<span class="promo-banner-cta">' + esc(ad.bannerCta) + ' &rarr;</span>' +
            '</span>' +
            mediaHtml;
        btn.addEventListener('click', function () {
            openModal(ad);
        });
        return btn;
    }

    // --- Modal -------------------------------------------------------------

    var activeModal = null;

    function closeModal() {
        if (!activeModal) return;
        document.body.classList.remove('promo-modal-open');
        document.removeEventListener('keydown', onKeydown);
        activeModal.remove();
        activeModal = null;
    }

    function onKeydown(e) {
        if (e.key === 'Escape') closeModal();
    }

    function ctaBlock(ad, lede) {
        return (
            '<div class="promo-modal-right promo-modal-cta-only">' +
            '<p class="promo-modal-lede">' + esc(lede) + '</p>' +
            '<a class="promo-modal-cta" href="' + esc(ad.ctaUrl) + '" target="_blank" rel="noopener noreferrer">' +
            esc(ad.ctaLabel) +
            '</a>' +
            '</div>'
        );
    }

    // Inline SVG icons (24px grid, 1.75 stroke, round caps) — one visual family.
    var ICON_LOCK =
        '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<g class="promo-lock-shackle"><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></g>' +
        '<rect x="5" y="10.5" width="14" height="10" rx="2.6"/>' +
        '<circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none"/>' +
        '<path d="M12 16.6v1.6"/></svg>';
    var TIER_ICONS = [
        // sparkle
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
        // bolt
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 3L5.5 13.2h5.3L10 21l8-10.4h-5.4z"/></svg>',
        // layers
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/><path d="M3.5 12.2L12 16.7l8.5-4.5"/><path d="M3.5 16.2L12 20.7l8.5-4.5"/></svg>'
    ];
    var ICON_ARROW =
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

    /** Shown once a visitor's browser hits demoFreeViews for this ad — a soft, per-browser cap. */
    function lockBlock(ad) {
        var tiers = ad.paywallTiers || [];
        var featured = tiers.length === 3 ? 1 : -1; // middle of three reads as "most popular"
        var tiersHtml = tiers
            .map(function (t, i) {
                return (
                    '<a class="promo-lock-tier' + (i === featured ? ' promo-lock-tier-featured' : '') + '" href="' + esc(t.checkoutUrl) + '" target="_blank" rel="noopener noreferrer">' +
                    (i === featured ? '<span class="promo-lock-tier-chip">Most popular</span>' : '') +
                    '<span class="promo-lock-tier-icon">' + TIER_ICONS[i % TIER_ICONS.length] + '</span>' +
                    '<span class="promo-lock-tier-label">' + esc(t.label) + '</span>' +
                    '<span class="promo-lock-tier-price">' + esc(t.priceLabel) + '</span>' +
                    (t.detail ? '<span class="promo-lock-tier-detail">' + esc(t.detail) + '</span>' : '') +
                    '</a>'
                );
            })
            .join('');
        var n = Number(ad.demoFreeViews);
        return (
            '<div class="promo-modal-right promo-modal-right-lock">' +
            '<div class="promo-lock">' +
            '<div class="promo-lock-icon" style="--i:0" aria-hidden="true">' + ICON_LOCK + '</div>' +
            '<p class="promo-lock-title" style="--i:1">You\u2019ve used your ' + n + ' free preview' + (n === 1 ? '' : 's') + '</p>' +
            '<p class="promo-lock-note" style="--i:2">Create an account and unlock full access to ' + esc(ad.productName) + ' \u2014 pick a pack to keep going.</p>' +
            (tiersHtml ? '<div class="promo-lock-tiers" style="--i:3">' + tiersHtml + '</div>' : '') +
            '<a class="promo-lock-alt" style="--i:4" href="' + esc(ad.ctaUrl) + '" target="_blank" rel="noopener noreferrer">Open ' + esc(ad.productName) + ' ' + ICON_ARROW + '</a>' +
            '</div>' +
            '</div>'
        );
    }

    /**
     * Five shapes, driven by whether an ad has a safe embeddable demo, whether
     * it wants a lead first, and whether this browser has already used up its
     * free previews:
     *  - demo, free-view cap hit -> the paywall lock, in place of the iframe
     *  - no demo, no gate        -> straight CTA (a plain showcase ad)
     *  - no demo, gate           -> gate, then a thank-you + CTA (capture
     *                               interest for a product with no live embed
     *                               yet, e.g. still on an internal branch)
     *  - demo, no gate           -> iframe straight away
     *  - demo, gate              -> gate, then the iframe
     */
    function buildRightPane(ad) {
        var unlocked = !ad.requiresLead || leadGiven();

        if (ad.demoUrl && Number(ad.demoFreeViews) > 0 && demoViewCount(ad.slug) >= Number(ad.demoFreeViews)) {
            return lockBlock(ad);
        }

        if (!ad.demoUrl) {
            if (!ad.requiresLead) return ctaBlock(ad, ad.tagline || ad.productName);
            if (unlocked) {
                return ctaBlock(ad, 'Thanks — we’ll be in touch. In the meantime:');
            }
        } else if (unlocked) {
            recordDemoView(ad.slug);
            return (
                '<div class="promo-modal-right">' +
                '<div class="promo-modal-demo-wrap">' +
                '<div class="promo-modal-demo-skeleton" aria-hidden="true"></div>' +
                '<iframe class="promo-modal-demo" src="' + esc(ad.demoUrl) + '" title="' + esc(ad.productName) + ' demo" loading="lazy"></iframe>' +
                '</div>' +
                '</div>'
            );
        }

        var hasDemo = !!ad.demoUrl;
        var title = hasDemo ? 'Try the live demo' : 'Get early access';
        var note = hasDemo
            ? 'Give us a way to reach you and the demo unlocks — once, for every ad.'
            : 'Give us a way to reach you and we’ll let you know the moment it’s ready.';
        var submitLabel = hasDemo ? 'Unlock demo' : 'Get early access';
        return (
            '<div class="promo-modal-right">' +
            '<form class="promo-gate-form" data-ad-slug="' + esc(ad.slug) + '">' +
            '<p class="promo-gate-title">' + esc(title) + '</p>' +
            '<p class="promo-gate-note">' + esc(note) + '</p>' +
            '<label class="promo-gate-label" for="promo-gate-name">Name</label>' +
            '<input id="promo-gate-name" name="name" class="promo-gate-input" type="text" required autocomplete="name">' +
            '<label class="promo-gate-label" for="promo-gate-email">Email</label>' +
            '<input id="promo-gate-email" name="email" class="promo-gate-input" type="email" required autocomplete="email">' +
            '<p class="promo-gate-error" hidden></p>' +
            '<button type="submit" class="promo-gate-submit">' + esc(submitLabel) + '</button>' +
            '</form>' +
            '</div>'
        );
    }

    /** Drops the shimmer skeleton the instant the demo iframe actually paints. */
    function wireDemoIframe(container) {
        var iframe = container.querySelector('.promo-modal-demo');
        var skeleton = container.querySelector('.promo-modal-demo-skeleton');
        if (!iframe || !skeleton) return;
        iframe.addEventListener('load', function () {
            skeleton.remove();
        });
    }

    function wireGateForm(panel, ad) {
        var form = panel.querySelector('.promo-gate-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.querySelector('#promo-gate-name').value.trim();
            var email = form.querySelector('#promo-gate-email').value.trim();
            var errEl = form.querySelector('.promo-gate-error');
            var submitBtn = form.querySelector('.promo-gate-submit');
            errEl.hidden = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Unlocking…';

            // Goes through the SAME public endpoint the site's own early-access
            // forms use (GateEmailForm/EarlyAccessModal) — not a bespoke path:
            // the lead lands in early_access_requests (already surfaced in the
            // Audience duty) and the Worker already fires the Brevo confirmation
            // + internal-notify emails. TeamLife never touches this write at all.
            fetch(FORMS_API + '/v1/early-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    product: ad.slug,
                    productName: ad.productName,
                    context: attributionContext(ad),
                }),
            })
                .then(function (res) {
                    return res.json().then(function (data) {
                        return { ok: res.ok && data && data.ok !== false, data: data };
                    });
                })
                .then(function (r) {
                    if (!r.ok) throw new Error((r.data && r.data.error) || 'Could not unlock the demo.');
                    markLeadGiven();
                    var right = panel.querySelector('.promo-modal-right');
                    right.outerHTML = buildRightPane(ad); // now unlocked -> renders the iframe
                    wireDemoIframe(panel);
                })
                .catch(function (e) {
                    errEl.textContent = e.message || 'Something went wrong. Please try again.';
                    errEl.hidden = false;
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Unlock demo';
                });
        });
    }

    function openModal(ad) {
        closeModal();

        var overlay = document.createElement('div');
        overlay.className = 'promo-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', ad.productName + ' — ' + ad.tagline);

        var mediaHtml =
            ad.mediaKind === 'video'
                ? '<video class="promo-modal-media" src="' + esc(ad.mediaUrl) + '" poster="" playsinline loop controls preload="metadata"></video>'
                : '<img class="promo-modal-media" src="' + esc(ad.mediaUrl) + '" alt="' + esc(ad.productName) + '">';

        overlay.innerHTML =
            '<div class="promo-modal-backdrop"></div>' +
            '<div class="promo-modal-panel">' +
            '<button type="button" class="promo-modal-close" aria-label="Close">&times;</button>' +
            '<div class="promo-modal-left">' +
            mediaHtml +
            '<div class="promo-modal-left-footer">' +
            '<span class="promo-modal-badge">' + esc(ad.kind === 'client' ? 'Ad · Partner' : 'Ad · Bitroot') + '</span>' +
            '<strong>' + esc(ad.productName) + '</strong>' +
            '<a class="promo-modal-link" href="' + esc(ad.ctaUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(ad.ctaLabel) + '</a>' +
            '</div>' +
            '</div>' +
            buildRightPane(ad) +
            '</div>';

        overlay.querySelector('.promo-modal-backdrop').addEventListener('click', closeModal);
        overlay.querySelector('.promo-modal-close').addEventListener('click', closeModal);
        wireGateForm(overlay, ad);
        wireDemoIframe(overlay);

        document.body.appendChild(overlay);
        document.body.classList.add('promo-modal-open');
        document.addEventListener('keydown', onKeydown);
        activeModal = overlay;

        var firstField = overlay.querySelector('#promo-gate-name') || overlay.querySelector('.promo-modal-close');
        if (firstField) firstField.focus();
    }

    // --- Init ----------------------------------------------------------------

    var markers = findMarkers(body);
    if (markers.length === 0) return;

    fetch(API_BASE + '/api/public/blog-ads')
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data || !data.ok || !Array.isArray(data.ads)) return;
            var bySlug = {};
            data.ads.forEach(function (a) {
                bySlug[a.slug] = a;
            });
            markers.forEach(function (m) {
                var ad = bySlug[m.slug];
                if (!ad) {
                    m.el.remove(); // unknown/inactive slug — never show a broken slot
                    return;
                }
                m.el.replaceWith(renderBanner(ad));
            });
        })
        .catch(function () {
            // Ad service unreachable — leave the post readable, drop the markers silently.
            markers.forEach(function (m) {
                m.el.remove();
            });
        });
})();
