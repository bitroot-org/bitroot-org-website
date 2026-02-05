/**
 * Posts Loader - Loads and renders markdown posts from the posts/ directory
 */

const PostsLoader = {
    postsDir: 'posts/',
    postsIndexUrl: 'posts/index.json',

    /**
     * Parse YAML frontmatter from markdown content
     */
    parseFrontmatter(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!match) {
            return { metadata: {}, content };
        }

        const yamlStr = match[1];
        const markdownContent = match[2];

        // Simple YAML parser for frontmatter
        const metadata = {};
        const lines = yamlStr.split('\n');
        let currentKey = null;
        let currentArray = null;

        for (const line of lines) {
            // Array item
            if (line.match(/^\s+-\s+/)) {
                const value = line.replace(/^\s+-\s+/, '').trim();
                if (currentArray && currentKey) {
                    metadata[currentKey].push(value.replace(/^["']|["']$/g, ''));
                }
                continue;
            }

            // Key-value pair
            const kvMatch = line.match(/^(\w+):\s*(.*)$/);
            if (kvMatch) {
                const [, key, value] = kvMatch;
                currentKey = key;

                if (value === '' || value === '[]') {
                    // Empty array
                    metadata[key] = [];
                    currentArray = true;
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    // Inline array
                    metadata[key] = value
                        .slice(1, -1)
                        .split(',')
                        .map(s => s.trim().replace(/^["']|["']$/g, ''));
                    currentArray = false;
                } else {
                    // Simple value
                    metadata[key] = value.replace(/^["']|["']$/g, '');
                    currentArray = false;
                }
            }
        }

        return { metadata, content: markdownContent };
    },

    /**
     * Fetch a single post by filename
     */
    async fetchPost(filename) {
        try {
            const response = await fetch(`${this.postsDir}${filename}`);
            if (!response.ok) return null;

            const text = await response.text();
            const { metadata, content } = this.parseFrontmatter(text);

            return {
                filename,
                slug: filename.replace(/\.md$/, ''),
                ...metadata,
                content,
                // Calculate read time (approx 200 words per minute)
                readTime: Math.ceil(content.split(/\s+/).length / 200) + ' min'
            };
        } catch (e) {
            console.error(`Failed to fetch post ${filename}:`, e);
            return null;
        }
    },

    /**
     * Fetch all posts from index or by scanning directory
     */
    async fetchAllPosts() {
        try {
            // Try to fetch posts index
            const response = await fetch(this.postsIndexUrl);
            if (response.ok) {
                const index = await response.json();
                const posts = await Promise.all(
                    index.posts.map(filename => this.fetchPost(filename))
                );
                return posts.filter(Boolean).sort((a, b) =>
                    new Date(b.date) - new Date(a.date)
                );
            }
        } catch (e) {
            console.log('No posts index found, using static posts');
        }

        // Fallback: return empty array (static posts will be used)
        return [];
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
     * Render a post as featured (large) card
     */
    renderFeaturedPost(post) {
        // Get a relevant image based on tags
        const tagImages = {
            'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
            'engineering': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
            'design': 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=500&fit=crop',
            'tutorial': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
            'default': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop'
        };

        const tag = (post.tags && post.tags[0]) || 'General';
        const image = tagImages[tag.toLowerCase()] || tagImages.default;

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
     * Initialize the posts loader and render posts
     */
    async init() {
        const posts = await this.fetchAllPosts();

        if (posts.length === 0) {
            // No dynamic posts, keep static content
            console.log('No dynamic posts found, using static content');
            return;
        }

        // Render featured post (most recent)
        const featuredContainer = document.querySelector('.showcase-grid');
        if (featuredContainer && posts.length > 0) {
            const featured = posts[0];
            const listPosts = posts.slice(1, 7); // Next 6 posts for list

            featuredContainer.innerHTML = `
                ${this.renderFeaturedPost(featured)}
                <aside class="post-list">
                    <h3 class="list-header">Recent</h3>
                    ${listPosts.map(p => this.renderListItem(p)).join('')}
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
            featured.dataset.postSlug = post.slug;
            featured.innerHTML = this.renderFeaturedPost(post)
                .replace(/<article[^>]*>/, '')
                .replace(/<\/article>$/, '');

            // Fade in
            featured.style.opacity = '1';

            // Update list items active state
            document.querySelectorAll('.list-item').forEach(item => {
                item.classList.toggle('active', item.dataset.postSlug === post.slug);
            });
        }, 200);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => PostsLoader.init());
