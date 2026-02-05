// Blog data with slugs for navigation
const posts = [
    {
        id: 1,
        slug: 'building-scalable-systems',
        tag: 'Engineering',
        date: 'Jan 15, 2026',
        shortDate: 'Jan 15',
        title: 'Building Scalable Systems with Modern Architecture',
        excerpt: 'An exploration of how we approach system design at Bitroot, focusing on scalability, maintainability, and developer experience. We dive into the patterns and practices that help us build robust foundations.',
        readTime: '8 min',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop'
    },
    {
        id: 2,
        slug: 'the-art-of-minimal-interfaces',
        tag: 'Design',
        date: 'Jan 10, 2026',
        shortDate: 'Jan 10',
        title: 'The Art of Minimal Interfaces',
        excerpt: 'Less is more. We explore the principles behind minimal interface design and how constraints can lead to more elegant, usable products. A deep dive into the philosophy of reduction.',
        readTime: '5 min',
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=500&fit=crop'
    },
    {
        id: 3,
        slug: 'getting-started-with-static-site-generators',
        tag: 'Tutorial',
        date: 'Jan 05, 2026',
        shortDate: 'Jan 05',
        title: 'Getting Started with Static Site Generators',
        excerpt: 'Static sites are making a comeback. Learn how to leverage modern static site generators to build fast, secure, and maintainable websites without the complexity of traditional CMSs.',
        readTime: '12 min',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop'
    },
    {
        id: 4,
        slug: 'cicd-pipelines-that-actually-work',
        tag: 'Engineering',
        date: 'Dec 28, 2025',
        shortDate: 'Dec 28',
        title: 'CI/CD Pipelines That Actually Work',
        excerpt: 'Continuous integration and deployment can be complex. We share our battle-tested pipeline configurations and the lessons learned from years of iteration and refinement.',
        readTime: '7 min',
        image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=500&fit=crop'
    },
    {
        id: 5,
        slug: 'why-we-open-source-our-tools',
        tag: 'Thoughts',
        date: 'Dec 20, 2025',
        shortDate: 'Dec 20',
        title: 'Why We Open Source Our Tools',
        excerpt: 'Open source is at the heart of what we do. Here\'s why we believe in giving back to the community and how it has shaped our company culture and products.',
        readTime: '4 min',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=500&fit=crop'
    },
    {
        id: 6,
        slug: 'typography-in-technical-writing',
        tag: 'Design',
        date: 'Dec 15, 2025',
        shortDate: 'Dec 15',
        title: 'Typography in Technical Writing',
        excerpt: 'Good typography makes technical content accessible. We explore font choices, hierarchy, and spacing that make documentation a pleasure to read.',
        readTime: '6 min',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop'
    },
    {
        id: 7,
        slug: 'deploying-to-the-edge',
        tag: 'Tutorial',
        date: 'Dec 08, 2025',
        shortDate: 'Dec 08',
        title: 'Deploying to the Edge',
        excerpt: 'Edge computing brings your code closer to users. Learn how to deploy serverless functions to edge networks for lightning-fast response times globally.',
        readTime: '9 min',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop'
    }
];

let currentFeaturedId = 1;

function updateFeaturedPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || post.id === currentFeaturedId) return;

    const featured = document.querySelector('.featured-post');

    // Fade out
    featured.style.opacity = '0';

    setTimeout(() => {
        // Update content
        featured.dataset.postId = post.id;
        featured.querySelector('.post-image img').src = post.image;
        featured.querySelector('.post-image img').alt = post.title;
        featured.querySelector('.post-tag').textContent = post.tag;
        featured.querySelector('.post-date').textContent = post.date;
        featured.querySelector('.post-title').textContent = post.title;
        featured.querySelector('.post-excerpt').textContent = post.excerpt;
        featured.querySelector('.read-time').textContent = post.readTime + ' read';

        // Fade in
        featured.style.opacity = '1';

        currentFeaturedId = post.id;

        // Update list items active state
        document.querySelectorAll('.list-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.postId) === postId);
        });

        // Update read-more link
        updateReadMoreLinks();
    }, 200);
}

function init() {
    // Add transition to featured post
    const featured = document.querySelector('.featured-post');
    featured.style.transition = 'opacity 0.2s ease';

    // List item click handlers
    document.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
            const postId = parseInt(item.dataset.postId);
            updateFeaturedPost(postId);
        });
    });

    // Featured post click handler (navigate to post)
    featured.addEventListener('click', (e) => {
        // Don't navigate if clicking the "Read more" link (it handles itself)
        if (e.target.closest('.read-more')) return;

        const post = posts.find(p => p.id === currentFeaturedId);
        if (post) {
            window.location.href = `post.html?slug=${post.slug}`;
        }
    });

    // Update read-more links with correct URLs
    updateReadMoreLinks();
}

function updateReadMoreLinks() {
    const featured = document.querySelector('.featured-post');
    const readMore = featured.querySelector('.read-more');
    const post = posts.find(p => p.id === currentFeaturedId);
    if (readMore && post) {
        readMore.href = `post.html?slug=${post.slug}`;
    }
}

document.addEventListener('DOMContentLoaded', init);
