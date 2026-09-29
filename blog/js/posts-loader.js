/**
 * Newslogger index behaviour.
 *
 * The home layout (Featured, category rails, All posts + pagination) is
 * rendered statically by build_index.py, so this script never touches it on
 * load. It only adds:
 *   - category chips + search -> a filtered results grid (#nl-results),
 *     reflected in the URL as /blog/?c=<category>&q=<query>
 *   - chips docking into the glass navbar once the hero scrolls away
 *   - prev/next buttons on the horizontal rails
 *
 * posts/index.json is fetched lazily, the first time someone filters.
 */
(function () {
    'use strict';

    var INDEX_URL = '/blog/posts/index.json';
    var PLACEHOLDER = '/blog/media/placeholder-blog.png';
    var BATCH = 12;
    var LABELS = {
        models: 'AI Models',
        agents: 'Agents & Dev Tools',
        founders: 'Founders & Business',
        opensource: 'Open Source',
        design: 'Design & Media',
        engineering: 'Engineering'
    };
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';

    var state = { cat: 'all', q: '', shown: BATCH };
    var postsPromise = null;
    var els = {};

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function loadPosts() {
        if (!postsPromise) {
            postsPromise = fetch(INDEX_URL)
                .then(function (r) { return r.ok ? r.json() : { metadata: [] }; })
                .then(function (idx) {
                    return (idx.metadata || []).slice().sort(function (a, b) {
                        var d = String(b.date).localeCompare(String(a.date));
                        return d !== 0 ? d : String(b.slug).localeCompare(String(a.slug));
                    });
                })
                .catch(function () { return []; });
        }
        return postsPromise;
    }

    function fmtDate(post) {
        var d = new Date(post.published_at || post.date);
        if (isNaN(d.getTime())) return '';
        return d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'short' }) + ' ' + d.getFullYear();
    }

    function imageSrc(post) {
        var img = post.image || '';
        if (!img) return window.bitrootPixelPlaceholder ? window.bitrootPixelPlaceholder(post.slug || '') : PLACEHOLDER;
        if (/^(https?:)?\/\//.test(img) || img.charAt(0) === '/') return img;
        return '/blog/' + img;
    }

    function label(post) {
        var c = (post.categories || [])[0];
        if (c && LABELS[c]) return LABELS[c];
        return (post.tags || ['General'])[0];
    }

    /** Mirror of build_index.py render_card(size="md"). */
    function renderCard(post) {
        var slug = String(post.slug || '').replace(/[^\w-]/g, '');
        return '<a class="nl-card nl-card--md" data-post-slug="' + esc(slug) + '" href="' + esc(post.url || '/blog/' + slug + '/') + '">' +
            '<div class="nl-card-media"><img src="' + esc(imageSrc(post)) + '" alt="' + esc(post.title) + '" loading="lazy" decoding="async" ' +
            'onerror="this.onerror=null;this.src=window.bitrootPixelPlaceholder?window.bitrootPixelPlaceholder(\'' + slug + '\'):\'' + PLACEHOLDER + '\'"></div>' +
            '<div class="nl-card-head"><h3 class="nl-card-title">' + esc(post.title) + '</h3><span class="nl-card-arrow">' + ARROW + '</span></div>' +
            '<div class="nl-card-meta"><span class="nl-card-cat">' + esc(label(post)) + '</span><span>' + esc(fmtDate(post)) + ' &middot; ' + esc(post.readTime || '5 min') + ' read</span></div>' +
            '</a>';
    }

    function matches(post) {
        if (state.cat !== 'all' && (post.categories || []).indexOf(state.cat) === -1) return false;
        var q = state.q.trim().toLowerCase();
        if (!q) return true;
        var hay = [post.title, post.excerpt].concat(post.tags || []).join(' ').toLowerCase();
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }

    function isFiltering() {
        return state.cat !== 'all' || state.q.trim() !== '';
    }

    function syncUrl() {
        var params = new URLSearchParams();
        if (state.cat !== 'all') params.set('c', state.cat);
        if (state.q.trim()) params.set('q', state.q.trim());
        var qs = params.toString();
        // Filtered views always live on /blog/ (the /page/<n>/ archive is unfiltered).
        var path = isFiltering() ? '/blog/' : window.location.pathname;
        try { history.replaceState(null, '', path + (qs ? '?' + qs : '')); } catch (e) { /* no-op */ }
    }

    function syncChips() {
        document.querySelectorAll('.nl-chip').forEach(function (chip) {
            var on = chip.getAttribute('data-cat') === state.cat;
            chip.classList.toggle('is-active', on);
            chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function render() {
        syncChips();
        syncUrl();
        if (!isFiltering()) {
            els.results.hidden = true;
            els.home.hidden = false;
            return;
        }
        els.home.hidden = true;
        els.results.hidden = false;
        var title = state.cat === 'all' ? 'All posts' : LABELS[state.cat] || 'Posts';
        if (state.q.trim()) title = (state.cat === 'all' ? 'Results' : title) + ' for “' + state.q.trim() + '”';
        els.resultsTitle.textContent = title;
        els.grid.setAttribute('aria-busy', 'true');

        loadPosts().then(function (posts) {
            var list = posts.filter(matches);
            els.count.textContent = list.length + (list.length === 1 ? ' post' : ' posts');
            els.grid.innerHTML = list.length
                ? list.slice(0, state.shown).map(renderCard).join('')
                : '<p class="nl-empty">Nothing matches that yet. Try another category or search.</p>';
            els.more.hidden = list.length <= state.shown;
            els.grid.removeAttribute('aria-busy');
        });
    }

    function setCategory(cat, scroll) {
        state.cat = LABELS[cat] ? cat : 'all';
        state.shown = BATCH;
        render();
        if (scroll) {
            var target = document.querySelector('.nl-hero');
            if (target) window.scrollTo({ top: target.offsetTop + target.offsetHeight - 120, behavior: 'smooth' });
        }
    }

    function initChips() {
        // Clone the hero chips into the navbar for the docked state.
        if (els.navChips && els.filters) {
            els.navChips.innerHTML = els.filters.innerHTML;
            els.navChips.querySelectorAll('button').forEach(function (b) { b.tabIndex = -1; });
        }
        document.addEventListener('click', function (e) {
            var chip = e.target.closest('.nl-chip');
            if (chip) {
                setCategory(chip.getAttribute('data-cat'), chip.closest('.nl-nav-chips') !== null);
                return;
            }
            var viewAll = e.target.closest('.nl-viewall[data-cat]');
            if (viewAll && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                setCategory(viewAll.getAttribute('data-cat'), true);
            }
        });
    }

    function initSearch() {
        if (!els.search) return;
        var t = null;
        els.search.addEventListener('input', function () {
            clearTimeout(t);
            t = setTimeout(function () {
                state.q = els.search.value;
                // The box promises "Search all posts", so a query spans every category.
                if (state.q.trim()) state.cat = 'all';
                state.shown = BATCH;
                render();
            }, 140);
        });
        // Warm the index as soon as someone shows intent to search.
        els.search.addEventListener('focus', loadPosts, { once: true });
    }

    function initDock() {
        if (!els.nav || !els.filters || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            var docked = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
            els.nav.classList.toggle('is-docked', docked);
            if (els.navChips) {
                els.navChips.setAttribute('aria-hidden', docked ? 'false' : 'true');
                els.navChips.querySelectorAll('button').forEach(function (b) { b.tabIndex = docked ? 0 : -1; });
            }
        }, { rootMargin: '-72px 0px 0px 0px' });
        io.observe(els.filters);
    }

    function initRails() {
        document.querySelectorAll('.nl-rail-section').forEach(function (section) {
            var rail = section.querySelector('.nl-rail');
            var prev = section.querySelector('[data-rail-dir="-1"]');
            var next = section.querySelector('[data-rail-dir="1"]');
            if (!rail || !prev || !next) return;
            function update() {
                prev.disabled = rail.scrollLeft <= 4;
                next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
            }
            [prev, next].forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var dir = Number(btn.getAttribute('data-rail-dir'));
                    rail.scrollBy({ left: dir * rail.clientWidth * 0.85, behavior: 'smooth' });
                });
            });
            rail.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update, { passive: true });
            update();
        });
    }

    function init() {
        els.home = document.getElementById('nl-home');
        els.results = document.getElementById('nl-results');
        els.resultsTitle = document.getElementById('nl-results-title');
        els.count = document.getElementById('nl-results-count');
        els.grid = document.getElementById('posts-grid');
        els.more = document.getElementById('nl-more');
        els.search = document.getElementById('blog-search');
        els.filters = document.getElementById('blog-filters');
        els.navChips = document.getElementById('nl-nav-chips');
        els.nav = document.getElementById('nl-nav');
        if (!els.home || !els.results || !els.grid) return;

        initChips();
        initSearch();
        initDock();
        initRails();

        els.more.addEventListener('click', function () {
            state.shown += BATCH;
            render();
        });

        var params = new URLSearchParams(window.location.search);
        var c = params.get('c');
        var q = params.get('q') || '';
        if ((c && LABELS[c]) || q) {
            state.cat = c && LABELS[c] ? c : 'all';
            state.q = q;
            if (els.search) els.search.value = q;
            render();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
