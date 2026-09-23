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

    var API_BASE = 'https://team.bitroot.club';
    var LEAD_KEY = 'bitroot_ad_lead_given';
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

    function renderBanner(ad) {
        var badge = ad.kind === 'client' ? 'Partner' : 'Bitroot';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ad-banner ad-banner-' + ad.kind;
        btn.innerHTML =
            '<span class="ad-banner-badge">' + esc(badge) + '</span>' +
            '<span class="ad-banner-copy">' +
            '<strong>' + esc(ad.productName) + '</strong>' +
            (ad.tagline ? '<span class="ad-banner-tagline">' + esc(ad.tagline) + '</span>' : '') +
            '</span>' +
            '<span class="ad-banner-cta">' + esc(ad.bannerCta) + ' &rarr;</span>';
        btn.addEventListener('click', function () {
            openModal(ad);
        });
        return btn;
    }

    // --- Modal -------------------------------------------------------------

    var activeModal = null;

    function closeModal() {
        if (!activeModal) return;
        document.body.classList.remove('ad-modal-open');
        document.removeEventListener('keydown', onKeydown);
        activeModal.remove();
        activeModal = null;
    }

    function onKeydown(e) {
        if (e.key === 'Escape') closeModal();
    }

    function buildRightPane(ad) {
        var unlocked = !ad.requiresLead || leadGiven();
        if (!ad.demoUrl) {
            return (
                '<div class="ad-modal-right ad-modal-cta-only">' +
                '<p class="ad-modal-lede">' + esc(ad.tagline || ad.productName) + '</p>' +
                '<a class="ad-modal-cta" href="' + esc(ad.ctaUrl) + '" target="_blank" rel="noopener noreferrer">' +
                esc(ad.ctaLabel) +
                '</a>' +
                '</div>'
            );
        }
        if (unlocked) {
            return (
                '<div class="ad-modal-right">' +
                '<iframe class="ad-modal-demo" src="' + esc(ad.demoUrl) + '" title="' + esc(ad.productName) + ' demo" loading="lazy"></iframe>' +
                '</div>'
            );
        }
        return (
            '<div class="ad-modal-right">' +
            '<form class="ad-gate-form" data-ad-slug="' + esc(ad.slug) + '">' +
            '<p class="ad-gate-title">Try the live demo</p>' +
            '<p class="ad-gate-note">Give us a way to reach you and the demo unlocks — once, for every ad.</p>' +
            '<label class="ad-gate-label" for="ad-gate-name">Name</label>' +
            '<input id="ad-gate-name" name="name" class="ad-gate-input" type="text" required autocomplete="name">' +
            '<label class="ad-gate-label" for="ad-gate-email">Email</label>' +
            '<input id="ad-gate-email" name="email" class="ad-gate-input" type="email" required autocomplete="email">' +
            '<p class="ad-gate-error" hidden></p>' +
            '<button type="submit" class="ad-gate-submit">Unlock demo</button>' +
            '</form>' +
            '</div>'
        );
    }

    function wireGateForm(panel, ad) {
        var form = panel.querySelector('.ad-gate-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.querySelector('#ad-gate-name').value.trim();
            var email = form.querySelector('#ad-gate-email').value.trim();
            var errEl = form.querySelector('.ad-gate-error');
            var submitBtn = form.querySelector('.ad-gate-submit');
            errEl.hidden = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Unlocking…';

            fetch(API_BASE + '/api/public/blog-ads/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adSlug: ad.slug, name: name, email: email, postSlug: postSlug, site: 'bitroot.org' }),
            })
                .then(function (res) {
                    return res.json().then(function (data) {
                        return { ok: res.ok, data: data };
                    });
                })
                .then(function (r) {
                    if (!r.ok) throw new Error((r.data && r.data.error) || 'Could not unlock the demo.');
                    markLeadGiven();
                    var right = panel.querySelector('.ad-modal-right');
                    right.outerHTML = buildRightPane(ad); // now unlocked -> renders the iframe
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
        overlay.className = 'ad-modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', ad.productName + ' — ' + ad.tagline);

        var mediaHtml =
            ad.mediaKind === 'video'
                ? '<video class="ad-modal-media" src="' + esc(ad.mediaUrl) + '" poster="" playsinline loop controls preload="metadata"></video>'
                : '<img class="ad-modal-media" src="' + esc(ad.mediaUrl) + '" alt="' + esc(ad.productName) + '">';

        overlay.innerHTML =
            '<div class="ad-modal-backdrop"></div>' +
            '<div class="ad-modal-panel">' +
            '<button type="button" class="ad-modal-close" aria-label="Close">&times;</button>' +
            '<div class="ad-modal-left">' +
            mediaHtml +
            '<div class="ad-modal-left-footer">' +
            '<span class="ad-modal-badge">' + esc(ad.kind === 'client' ? 'Partner' : 'Bitroot') + '</span>' +
            '<strong>' + esc(ad.productName) + '</strong>' +
            '<a class="ad-modal-link" href="' + esc(ad.ctaUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(ad.ctaLabel) + '</a>' +
            '</div>' +
            '</div>' +
            buildRightPane(ad) +
            '</div>';

        overlay.querySelector('.ad-modal-backdrop').addEventListener('click', closeModal);
        overlay.querySelector('.ad-modal-close').addEventListener('click', closeModal);
        wireGateForm(overlay, ad);

        document.body.appendChild(overlay);
        document.body.classList.add('ad-modal-open');
        document.addEventListener('keydown', onKeydown);
        activeModal = overlay;

        var firstField = overlay.querySelector('#ad-gate-name') || overlay.querySelector('.ad-modal-close');
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
