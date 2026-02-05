/**
 * Posts Loader - Loads and renders posts from the posts/index.json
 */

const PostsLoader = {
    postsIndexUrl: 'posts/index.json',
    postsPerPage: 7,
    currentPage: 1,
    allPosts: [],

    /**
     * Fetch all posts from index.json
     */
    async fetchAllPosts() {
        try {
            const response = await fetch(this.postsIndexUrl);
            if (!response.ok) {
                console.error('Failed to fetch posts index:', response.status);
                return [];
            }

            const index = await response.json();
            console.log('Loaded posts index:', index.count, 'posts');

            // Use metadata directly, add readTime calculation
            const posts = index.metadata.map(post => ({
                ...post,
                readTime: '5 min' // Default read time
            }));

            // Sort by date descending (newest first)
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (e) {
            console.error('Error loading posts:', e);
            return [];
        }
    },

    /**
     * Format date for display (uses browser locale)
     */
    formatDate(dateStr, short = false) {
        const date = new Date(dateStr);
        const locale = navigator.language || 'en-US';

        if (short) {
            return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    /**
     * Format date with time for display (uses browser locale)
     */
    formatDateTime(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const locale = navigator.language || 'en-US';

        return date.toLocaleString(locale, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Get image URL for a post (from metadata or fallback)
     */
    getPostImage(post) {
        // Use image from post metadata if available
        if (post.image) {
            return post.image;
        }

        // Fallback to tag-based images
        const tagImages = {
            'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
            'engineering': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
            'design': 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=500&fit=crop',
            'tutorial': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
            'startup': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
            'privacy': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop',
            'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
            'thoughts': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
            'default': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop'
        };

        const tag = (post.tags && post.tags[0]) || 'General';
        return tagImages[tag.toLowerCase()] || tagImages.default;
    },

    /**
     * Check if post has a valid video
     */
    hasVideo(post) {
        return post.video && !post.video.includes('twimg.com');
    },

    /**
     * Render a post as featured (large) card
     */
    renderFeaturedPost(post) {
        const tag = (post.tags && post.tags[0]) || 'General';
        const image = this.getPostImage(post);
        const displayDate = post.published_at ? this.formatDateTime(post.published_at) : this.formatDate(post.date);
        const hasVideo = this.hasVideo(post);

        return `
            <article class="featured-post" data-post-slug="${post.slug}" ${hasVideo ? `data-video="${post.video}"` : ''}>
                <div class="post-image">
                    <img src="${image}" alt="${post.title}">
                    ${hasVideo ? `
                        <div class="video-container" style="display: none;">
                            <video src="${post.video}" playsinline loop></video>
                        </div>
                        <button class="video-play-btn" aria-label="Play video">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </button>
                        <button class="video-mute-btn" style="display: none;" aria-label="Toggle sound">
                            <svg class="muted-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <line x1="23" y1="9" x2="17" y2="15"></line>
                                <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                            <svg class="unmuted-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-tag">${tag}</span>
                        <span class="post-date">${displayDate}</span>
                    </div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt || ''}</p>
                    <div class="post-footer">
                        <span class="read-time">${post.readTime} read</span>
                        <a href="post.html?slug=${post.slug}" class="read-more">Read more &rarr;</a>
                    </div>
                </div>
            </article>
        `;
    },

    /**
     * Render a post as list item (compact)
     */
    renderListItem(post) {
        const tag = (post.tags && post.tags[0]) || 'General';

        return `
            <article class="list-item" data-post-slug="${post.slug}">
                <span class="list-date">${this.formatDate(post.date, true)}</span>
                <div class="list-content">
                    <span class="list-tag">${tag}</span>
                    <h4 class="list-title">${post.title}</h4>
                    <span class="list-read-time">${post.readTime}</span>
                </div>
            </article>
        `;
    },

    /**
     * Render a list item with optional active state
     */
    renderListItemWithState(post, isActive) {
        const tag = (post.tags && post.tags[0]) || 'General';

        return `
            <article class="list-item${isActive ? ' active' : ''}" data-post-slug="${post.slug}">
                <span class="list-date">${this.formatDate(post.date, true)}</span>
                <div class="list-content">
                    <span class="list-tag">${tag}</span>
                    <h4 class="list-title">${post.title}</h4>
                    <span class="list-read-time">${post.readTime}</span>
                </div>
            </article>
        `;
    },

    /**
     * Render empty state when no posts exist
     */
    renderEmptyState() {
        const ascii = `
    ┌──────────────────────────────────────┐
    │                                      │
    │      ╔══╗ ╔══╗ ╔══╗ ╔══╗ ╔══╗       │
    │      ║  ║ ║  ║ ║  ║ ║  ║ ║  ║       │
    │      ║  ║ ║  ║ ║  ║ ║  ║ ║  ║       │
    │      ╚══╝ ╚══╝ ╚══╝ ╚══╝ ╚══╝       │
    │       [  LOADING NEWSLOGGER  ]      │
    │                                      │
    └──────────────────────────────────────┘`;

        return `
            <div class="empty-state">
                <div class="terminal">
                    <div class="terminal-header">
                        <span class="terminal-dot red"></span>
                        <span class="terminal-dot yellow"></span>
                        <span class="terminal-dot green"></span>
                        <span class="terminal-title">bitroot@newslogger ~ </span>
                    </div>
                    <div class="terminal-body">
                        <pre class="ascii-art">${ascii}</pre>
                        <div class="terminal-line">
                            <span class="prompt">$</span>
                            <span class="command typing">cat posts.md</span>
                        </div>
                        <div class="terminal-line output">
                            <span class="error">Error: No posts found</span>
                        </div>
                        <div class="terminal-line">
                            <span class="prompt">$</span>
                            <span class="command typing delay-1">echo "Stay tuned..."</span>
                        </div>
                        <div class="terminal-line output delay-2">
                            Stay tuned...
                        </div>
                        <div class="terminal-line">
                            <span class="prompt">$</span>
                            <span class="cursor">_</span>
                        </div>
                    </div>
                </div>
                <p class="empty-message">Our writers are brewing something good.</p>
                <p class="empty-submessage">First post coming soon!</p>
            </div>
        `;
    },

    /**
     * Get total pages
     */
    getTotalPages() {
        return Math.ceil(this.allPosts.length / this.postsPerPage);
    },

    /**
     * Get posts for current page
     */
    getPagePosts() {
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        return this.allPosts.slice(start, end);
    },

    /**
     * Render pagination controls
     */
    renderPagination() {
        const totalPages = this.getTotalPages();
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
            </nav>
        `;
    },

    /**
     * Go to a specific page
     */
    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.renderPage();
    },

    /**
     * Render current page of posts
     */
    renderPage() {
        const featuredContainer = document.querySelector('.showcase-grid');
        if (!featuredContainer) return;

        const pagePosts = this.getPagePosts();
        if (pagePosts.length === 0) return;

        const featured = pagePosts[0];

        featuredContainer.innerHTML = `
            ${this.renderFeaturedPost(featured)}
            <aside class="post-list">
                <h3 class="list-header">Recent</h3>
                ${pagePosts.map(p => this.renderListItemWithState(p, p.slug === featured.slug)).join('')}
            </aside>
        `;

        // Render pagination
        const paginationContainer = document.querySelector('.pagination-container');
        if (paginationContainer) {
            paginationContainer.innerHTML = this.renderPagination();
            this.initPaginationHandlers();
        }

        // Add click handlers
        this.initClickHandlers(this.allPosts);
    },

    /**
     * Initialize pagination button handlers
     */
    initPaginationHandlers() {
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        }
    },

    /**
     * Initialize the posts loader and render posts
     */
    async init() {
        console.log('PostsLoader initializing...');
        const posts = await this.fetchAllPosts();

        if (posts.length === 0) {
            console.log('No posts found, showing empty state');
            const container = document.querySelector('.showcase-grid');
            if (container) {
                container.innerHTML = this.renderEmptyState();
            }
            return;
        }

        console.log('Rendering', posts.length, 'posts');
        this.allPosts = posts;

        // Add pagination container if it doesn't exist
        const showcase = document.querySelector('.showcase');
        if (showcase && !document.querySelector('.pagination-container')) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-container';
            showcase.appendChild(paginationDiv);
        }

        // Render first page
        this.renderPage();
    },

    /**
     * Initialize video player controls
     */
    initVideoControls(featured) {
        const playBtn = featured.querySelector('.video-play-btn');
        const muteBtn = featured.querySelector('.video-mute-btn');
        const videoContainer = featured.querySelector('.video-container');
        const video = featured.querySelector('video');
        const postImage = featured.querySelector('.post-image img');

        if (!playBtn || !video) return;

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Hide image, show video
            postImage.style.display = 'none';
            videoContainer.style.display = 'block';
            playBtn.style.display = 'none';
            muteBtn.style.display = 'flex';

            // Play muted
            video.muted = true;
            video.play();
        });

        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            video.muted = !video.muted;
            const mutedIcon = muteBtn.querySelector('.muted-icon');
            const unmutedIcon = muteBtn.querySelector('.unmuted-icon');

            if (video.muted) {
                mutedIcon.style.display = 'block';
                unmutedIcon.style.display = 'none';
            } else {
                mutedIcon.style.display = 'none';
                unmutedIcon.style.display = 'block';
            }
        });
    },

    /**
     * Initialize click handlers for post selection
     */
    initClickHandlers(posts) {
        const featured = document.querySelector('.featured-post');
        if (featured) {
            featured.style.transition = 'opacity 0.2s ease';

            // Initialize video controls if present
            this.initVideoControls(featured);
        }

        document.querySelectorAll('.list-item').forEach(item => {
            item.addEventListener('click', () => {
                const slug = item.dataset.postSlug;
                const post = posts.find(p => p.slug === slug);
                if (post) {
                    this.updateFeaturedPost(post, posts);
                }
            });
        });

        // Featured post click navigates to post page
        if (featured) {
            featured.addEventListener('click', (e) => {
                // Don't navigate if clicking video controls
                if (e.target.closest('.video-play-btn') ||
                    e.target.closest('.video-mute-btn') ||
                    e.target.closest('.read-more')) {
                    return;
                }
                const slug = featured.dataset.postSlug;
                window.location.href = `post.html?slug=${slug}`;
            });
        }
    },

    /**
     * Update the featured post display
     */
    updateFeaturedPost(post, allPosts) {
        const featured = document.querySelector('.featured-post');
        if (!featured || featured.dataset.postSlug === post.slug) return;

        // Pause any playing video
        const oldVideo = featured.querySelector('video');
        if (oldVideo) {
            oldVideo.pause();
        }

        // Fade out
        featured.style.opacity = '0';

        setTimeout(() => {
            // Update content
            featured.outerHTML = this.renderFeaturedPost(post);

            // Re-init click handler for new featured element
            const newFeatured = document.querySelector('.featured-post');
            newFeatured.style.transition = 'opacity 0.2s ease';
            newFeatured.style.opacity = '1';

            // Initialize video controls if present
            this.initVideoControls(newFeatured);

            newFeatured.addEventListener('click', (e) => {
                // Don't navigate if clicking video controls
                if (e.target.closest('.video-play-btn') ||
                    e.target.closest('.video-mute-btn') ||
                    e.target.closest('.read-more')) {
                    return;
                }
                window.location.href = `post.html?slug=${post.slug}`;
            });

            // Update list items active state
            document.querySelectorAll('.list-item').forEach(item => {
                item.classList.toggle('active', item.dataset.postSlug === post.slug);
            });
        }, 200);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => PostsLoader.init());
