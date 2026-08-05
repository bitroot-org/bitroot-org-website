/**
 * Posts Loader — renders the newslogger index as a filterable card grid.
 *
 * Loads posts/index.json, builds the tag filter pills + search, and renders
 * pages of cards into #posts-grid. The build step (build_index.py) injects a
 * crawlable first page with the same markup; this loader replaces it on init.
 */

const PostsLoader = {
    postsIndexUrl: 'posts/index.json',
    postsPerPage: 9,
    currentPage: 1,
    allPosts: [],
    activeTag: 'All',
    searchQuery: '',
    maxFilterTags: 8,
    placeholderImage: 'media/placeholder-blog.png',

    async fetchAllPosts() {
        try {
            const response = await fetch(this.postsIndexUrl);
            if (!response.ok) {
                return [];
            }

            const index = await response.json();

            const posts = index.metadata.map(post => ({
                ...post,
                url: post.url || `/blog/${post.slug}/`,
                readTime: post.readTime || '5 min'
            }));

            // Sort by date descending (newest first)
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (e) {
            return [];
        }
    },

    esc(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const locale = navigator.language || 'en-US';
        return date.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    postImage(post) {
        if (post.image) {
            return post.image;
        }
        // Deterministic on-brand pixel pattern, seeded per post.
        if (window.bitrootPixelPlaceholder) {
            return window.bitrootPixelPlaceholder(post.slug || post.title || '');
        }
        return this.placeholderImage;
    },

    /**
     * Inline onerror attribute so a dead image URL degrades to the
     * placeholder instead of a broken-image icon.
     */
    imageOnError(post) {
        const slug = (post.slug || '').replace(/[^\w-]/g, '');
        return `onerror="this.onerror=null;this.src=window.bitrootPixelPlaceholder?window.bitrootPixelPlaceholder('${slug}'):'${this.placeholderImage}'"`;
    },

    /**
     * Canonical tag key — auto-generated posts vary casing/punctuation
     * ("AI" vs "ai", "open source" vs "open-source"), so group them.
     */
    canonTag(tag) {
        return String(tag).toLowerCase().replace(/[^a-z0-9]/g, '');
    },

    /**
     * Canonical tag → {label, count} across every post. The label shown is
     * the most frequent original spelling of the tag.
     */
    tagCounts() {
        const groups = new Map();
        for (const post of this.allPosts) {
            const seen = new Set();
            for (const tag of post.tags || []) {
                const key = this.canonTag(tag);
                if (!key || seen.has(key)) continue;
                seen.add(key);
                const group = groups.get(key) || { count: 0, variants: new Map() };
                group.count += 1;
                group.variants.set(tag, (group.variants.get(tag) || 0) + 1);
                groups.set(key, group);
            }
        }
        return [...groups.values()]
            .map(g => {
                const label = [...g.variants.entries()].sort((a, b) => b[1] - a[1])[0][0];
                return [label, g.count];
            })
            .sort((a, b) => b[1] - a[1]);
    },

    filteredPosts() {
        const q = this.searchQuery.trim().toLowerCase();
        const activeKey = this.activeTag === 'All' ? null : this.canonTag(this.activeTag);
        return this.allPosts.filter(post => {
            if (activeKey && !(post.tags || []).some(t => this.canonTag(t) === activeKey)) {
                return false;
            }
            if (q) {
                const haystack = [post.title, post.excerpt, ...(post.tags || [])]
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    },

    renderCard(post, featured = false) {
        const tag = (post.tags && post.tags[0]) || 'General';
        const meta = `${this.formatDate(post.published_at || post.date)} &bull; ${this.esc(post.readTime)} read`;
        return `
            <a class="card${featured ? ' card-featured' : ''}" data-post-slug="${this.esc(post.slug)}" href="${this.esc(post.url)}">
                <img class="card-bg" src="${this.esc(this.postImage(post))}" alt="" loading="${featured ? 'eager' : 'lazy'}" decoding="async" ${this.imageOnError(post)}>
                <div class="card-plate">
                    ${featured ? '<span class="card-badge">Latest</span>' : ''}
                    <h3 class="card-title">${this.esc(post.title)}</h3>
                    <p class="card-excerpt">${this.esc(post.excerpt || '')}</p>
                    <div class="card-meta">
                        <span class="card-tag">${this.esc(tag)}</span>
                        <span class="card-info">${meta}</span>
                    </div>
                </div>
            </a>`;
    },

    renderFilters() {
        const container = document.getElementById('blog-filters');
        if (!container) return;

        const top = this.tagCounts().slice(0, this.maxFilterTags);
        const pill = (label, count, active) => `
            <button class="filter-pill${active ? ' active' : ''}" data-tag="${this.esc(label)}">
                ${this.esc(label)} <span class="pill-count">&bull; ${count}</span>
            </button>`;

        container.innerHTML =
            pill('All', this.allPosts.length, this.activeTag === 'All') +
            top.map(([tag, count]) => pill(tag, count, this.activeTag === tag)).join('');

        container.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTag = btn.dataset.tag;
                this.currentPage = 1;
                this.renderFilters();
                this.renderPage();
            });
        });
    },

    getTotalPages(filtered) {
        return Math.max(1, Math.ceil(filtered.length / this.postsPerPage));
    },

    renderPagination(filtered) {
        const totalPages = this.getTotalPages(filtered);
        if (totalPages <= 1) return '';

        return `
            <nav class="pagination" aria-label="Newslogger pagination">
                <button class="pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    <span>Prev</span>
                </button>
                <span class="pagination-info">
                    Page <strong>${this.currentPage}</strong> of <strong>${totalPages}</strong>
                </span>
                <button class="pagination-btn next" ${this.currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
                    <span>Next</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </nav>`;
    },

    renderPage() {
        const grid = document.getElementById('posts-grid');
        if (!grid) return;

        const filtered = this.filteredPosts();
        const start = (this.currentPage - 1) * this.postsPerPage;
        const pagePosts = filtered.slice(start, start + this.postsPerPage);

        if (pagePosts.length === 0) {
            grid.innerHTML = `
                <div class="grid-empty">
                    <p>Nothing matches that yet. Try another tag or search.</p>
                </div>`;
        } else {
            // The newest post gets the big "Latest" card on the unfiltered first page.
            const showFeatured =
                this.currentPage === 1 && this.activeTag === 'All' && !this.searchQuery.trim();
            grid.innerHTML = pagePosts
                .map((post, i) => this.renderCard(post, showFeatured && i === 0))
                .join('');
        }

        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.innerHTML = this.renderPagination(filtered);
            const prev = paginationContainer.querySelector('.pagination-btn.prev');
            const next = paginationContainer.querySelector('.pagination-btn.next');
            if (prev) prev.addEventListener('click', () => this.goToPage(this.currentPage - 1));
            if (next) next.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
    },

    goToPage(page) {
        const totalPages = this.getTotalPages(this.filteredPosts());
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.renderPage();

        const grid = document.getElementById('posts-grid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    initSearch() {
        const input = document.getElementById('blog-search');
        if (!input) return;

        let timer = null;
        input.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.searchQuery = input.value;
                this.currentPage = 1;
                this.renderPage();
            }, 150);
        });
    },

    async init() {
        const posts = await this.fetchAllPosts();

        if (posts.length === 0) {
            // Keep whatever was statically rendered at build time.
            return;
        }

        this.allPosts = posts;
        this.renderFilters();
        this.initSearch();
        this.renderPage();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => PostsLoader.init());
