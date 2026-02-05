/**
 * Posts Loader - Loads and renders posts from the posts/index.json
 */

const PostsLoader = {
    postsIndexUrl: 'posts/index.json',

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
     * Format date for display
     */
    formatDate(dateStr, short = false) {
        const date = new Date(dateStr);
        if (short) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
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
     * Render a post as featured (large) card
     */
    renderFeaturedPost(post) {
        const tag = (post.tags && post.tags[0]) || 'General';
        const image = this.getPostImage(post);

        return `
            <article class="featured-post" data-post-slug="${post.slug}">
                <div class="post-image">
                    <img src="${image}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-tag">${tag}</span>
                        <span class="post-date">${this.formatDate(post.date)}</span>
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
     * Initialize the posts loader and render posts
     */
    async init() {
        console.log('PostsLoader initializing...');
        const posts = await this.fetchAllPosts();

        if (posts.length === 0) {
            console.log('No dynamic posts found, keeping static content');
            return;
        }

        console.log('Rendering', posts.length, 'posts');

        // Render featured post (most recent)
        const featuredContainer = document.querySelector('.showcase-grid');
        if (featuredContainer && posts.length > 0) {
            const featured = posts[0];
            const listPosts = posts.slice(0, 7); // Show first 7 posts in list

            featuredContainer.innerHTML = `
                ${this.renderFeaturedPost(featured)}
                <aside class="post-list">
                    <h3 class="list-header">Recent</h3>
                    ${listPosts.map(p => this.renderListItemWithState(p, p.slug === featured.slug)).join('')}
                </aside>
            `;

            // Add click handlers
            this.initClickHandlers(posts);
        }
    },

    /**
     * Initialize click handlers for post selection
     */
    initClickHandlers(posts) {
        const featured = document.querySelector('.featured-post');
        if (featured) {
            featured.style.transition = 'opacity 0.2s ease';
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
                if (!e.target.closest('.read-more')) {
                    const slug = featured.dataset.postSlug;
                    window.location.href = `post.html?slug=${slug}`;
                }
            });
        }
    },

    /**
     * Update the featured post display
     */
    updateFeaturedPost(post, allPosts) {
        const featured = document.querySelector('.featured-post');
        if (!featured || featured.dataset.postSlug === post.slug) return;

        // Fade out
        featured.style.opacity = '0';

        setTimeout(() => {
            // Update content
            featured.outerHTML = this.renderFeaturedPost(post);

            // Re-init click handler for new featured element
            const newFeatured = document.querySelector('.featured-post');
            newFeatured.style.transition = 'opacity 0.2s ease';
            newFeatured.style.opacity = '1';

            newFeatured.addEventListener('click', (e) => {
                if (!e.target.closest('.read-more')) {
                    window.location.href = `post.html?slug=${post.slug}`;
                }
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
