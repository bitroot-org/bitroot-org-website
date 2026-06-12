#!/usr/bin/env python3
"""
Build static post pages.

Pre-renders every markdown post in blog/posts/ to a crawlable static page at
blog/<slug>/index.html (clean URL: https://bitroot.org/blog/<slug>/), with the
full article HTML, a self-referencing canonical, per-post meta/OG/Twitter tags,
and BlogPosting + BreadcrumbList JSON-LD.

This replaces the legacy client-side flow (post.html?slug=X + marked.js),
which served an empty shell to search engines.

Usage:
    python blog/scripts/build_post_pages.py            # writes into the repo
    python blog/scripts/build_post_pages.py --out DIR  # writes DIR/blog/<slug>/

In CI the deploy workflow runs this with --out "$DIST" after assembling the
deploy directory. Locally the generated blog/<slug>/ dirs are gitignored.
"""

import argparse
import html as html_mod
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import frontmatter
import markdown

REPO_ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = REPO_ROOT / "blog" / "posts"

SITE_URL = "https://bitroot.org"
BLOG_URL = f"{SITE_URL}/blog"
DEFAULT_OG_IMAGE = f"{SITE_URL}/images/newslogger-og.jpg"
PLACEHOLDER_IMAGE = "/blog/media/placeholder-blog.png"
LOGO_URL = f"{SITE_URL}/blog/media/images/bitroot-dark-text-border.png"
FAVICON_URL = f"{SITE_URL}/blog/media/images/favicon.png"
# Only the weights the CSS actually uses (was 100-900, mostly dead bytes).
FONTS_HREF = (
    "https://fonts.googleapis.com/css2"
    "?family=Geist+Mono:wght@400;500;600;700&display=swap"
)

POSTHOG_SNIPPET = """    <!-- PostHog (shared bitroot.org/.club project) -->
    <script>
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init bs ws ge fs capture De calculateEventProperties $s register register_once register_for_session unregister unregister_for_session Is getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty xs Ss createPersonProfile Es gs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing ys debug ks getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_HEqGPywWHRyDfasXvZMuRz2Vs8ip24tGXUYNRySQ4sx', {
            api_host: 'https://us.i.posthog.com',
            person_profiles: 'identified_only',
        })
        // Tag every event with the surface (shared project segmentation).
        posthog.register({ site: 'blog' })
    </script>"""


def esc(s):
    """Escape for HTML text/attribute context."""
    return html_mod.escape(str(s or ""), quote=True)


def collapse_ws(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def clamp(s, limit=160):
    """Collapse whitespace and clamp at a word boundary."""
    s = collapse_ws(s)
    if len(s) <= limit:
        return s
    cut = s[: limit - 1]
    if " " in cut:
        cut = cut[: cut.rindex(" ")]
    return cut.rstrip(" ,;:.") + "…"


def fmt_date(date_str):
    """'2026-06-03' -> 'June 3, 2026' (en-US, crawler-stable)."""
    try:
        dt = datetime.fromisoformat(str(date_str))
        return f"{dt.strftime('%B')} {dt.day}, {dt.year}"
    except (ValueError, TypeError):
        return str(date_str or "")


def fmt_datetime(dt_str):
    """ISO timestamp -> 'June 3, 2026, 12:25 PM'."""
    try:
        dt = datetime.fromisoformat(str(dt_str))
        hour12 = dt.hour % 12 or 12
        ampm = "AM" if dt.hour < 12 else "PM"
        return f"{dt.strftime('%B')} {dt.day}, {dt.year}, {hour12}:{dt.minute:02d} {ampm}"
    except (ValueError, TypeError):
        return ""


def iso_date(meta):
    """Best ISO-8601 publish stamp for schema/OG."""
    pub = meta.get("published_at") or meta.get("date")
    try:
        dt = datetime.fromisoformat(str(pub))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()
    except (ValueError, TypeError):
        return str(pub or "")


def blog_asset(url):
    """Resolve asset paths in frontmatter. Legacy posts use paths relative to
    /blog/ (e.g. 'media/foo.mp4'), which would break under /blog/<slug>/."""
    url = str(url or "")
    if not url or url.startswith(("http://", "https://", "/")):
        return url
    return "/blog/" + url


def post_image(meta):
    image = str(meta.get("image") or "")
    if not image or "source.unsplash.com" in image:
        return ""
    return blog_asset(image)


def absolute(url):
    if url.startswith("http://") or url.startswith("https://"):
        return url
    url = blog_asset(url)
    return SITE_URL + (url if url.startswith("/") else "/" + url)


MD = markdown.Markdown(extensions=["extra", "sane_lists"])


def render_markdown(content):
    MD.reset()
    body = MD.convert(content)
    # Below-the-fold body images: lazy + async; never let one ship without alt.
    def fix_img(m):
        tag = m.group(0)
        if "loading=" not in tag:
            tag = tag.replace("<img ", '<img loading="lazy" decoding="async" ', 1)
        if "alt=" not in tag:
            tag = tag.replace("<img ", '<img alt="" ', 1)
        return tag

    return re.sub(r"<img\b[^>]*>", fix_img, body)


def format_source_label(url):
    """Mirror of the legacy client-side formatSourceLabel()."""
    m = re.match(r"https?://(?:www\.)?([^/]+)(/[^?#]*)?", url)
    if not m:
        return url
    host, path = m.group(1), m.group(2) or ""
    if host in ("x.com", "twitter.com"):
        sm = re.match(r"^/([^/]+)/status/\d+", path)
        if sm and sm.group(1) != "i":
            return f"@{sm.group(1)} on X"
        return "Post on X"
    if host == "github.com":
        gm = re.match(r"^/([^/]+/[^/]+)", path)
        return f"github.com/{gm.group(1)}" if gm else "github.com"
    if host in ("youtube.com", "youtu.be"):
        return "YouTube"
    return host + (path.rstrip("/") if len(path) > 1 else "")


def build_references(meta, rendered_html):
    """Frontmatter sources first (labeled with the post title), then inline
    body links labeled with their own text. Dedupes by URL."""
    refs, seen = [], set()
    title = collapse_ws(meta.get("title", ""))
    for url in meta.get("sources") or []:
        if not url or url in seen:
            continue
        seen.add(url)
        refs.append({"url": url, "label": title or format_source_label(url)})
    for m in re.finditer(r'<a\s[^>]*href="([^"]+)"[^>]*>(.*?)</a>', rendered_html, re.S):
        href = m.group(1)
        if not href or href.startswith("#") or href.startswith("mailto:") or href in seen:
            continue
        seen.add(href)
        text = collapse_ws(re.sub(r"<[^>]+>", "", m.group(2)))
        refs.append({"url": href, "label": text or format_source_label(href)})
    return refs


def hero_html(meta, slug):
    """Static hero: image (LCP, eager) or click-to-play video with poster.
    Videos are NOT autoplayed any more — some are 25-48MB."""
    title = meta.get("title", "Post")
    image = post_image(meta) or PLACEHOLDER_IMAGE
    video = blog_asset(meta.get("video"))
    has_video = video and "twimg.com" not in video
    if has_video:
        return f"""            <div class="post-hero-video">
                <video src="{esc(video)}" poster="{esc(image)}" playsinline loop controls preload="metadata">
                    Your browser does not support the video tag.
                </video>
            </div>"""
    return f"""            <div class="post-hero-image">
                <img src="{esc(image)}" alt="{esc(title)}" fetchpriority="high" decoding="async" onerror="this.onerror=null;this.src='{PLACEHOLDER_IMAGE}'">
            </div>"""


def json_ld(meta, slug, canonical, word_count):
    image = post_image(meta)
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": canonical + "#article",
                "mainEntityOfPage": canonical,
                "headline": collapse_ws(meta.get("title", "")),
                "description": clamp(meta.get("excerpt", ""), 300),
                "image": absolute(image) if image else DEFAULT_OG_IMAGE,
                "datePublished": iso_date(meta),
                "wordCount": word_count,
                "keywords": ", ".join(meta.get("tags") or []),
                "inLanguage": "en",
                "author": {"@type": "Organization", "name": "Bitroot", "url": SITE_URL},
                "publisher": {
                    "@type": "Organization",
                    "name": "Bitroot",
                    "url": SITE_URL,
                    "logo": {"@type": "ImageObject", "url": LOGO_URL},
                },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL + "/"},
                    {"@type": "ListItem", "position": 2, "name": "Newslogger", "item": BLOG_URL + "/"},
                    {"@type": "ListItem", "position": 3, "name": collapse_ws(meta.get("title", "")), "item": canonical},
                ],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False)


def adjacent_nav(prev_post, next_post):
    """prev = newer post, next = older post (posts sorted newest-first)."""
    if not prev_post and not next_post:
        return ""
    parts = ['        <nav class="post-adjacent" aria-label="More from the newslogger">']
    if prev_post:
        parts.append(
            f'            <a class="post-adjacent-link" rel="prev" href="/blog/{esc(prev_post["slug"])}/">'
            f'<span class="post-adjacent-label">&larr; Newer</span>'
            f'<span class="post-adjacent-title">{esc(prev_post["title"])}</span></a>'
        )
    else:
        parts.append('            <span class="post-adjacent-spacer"></span>')
    if next_post:
        parts.append(
            f'            <a class="post-adjacent-link post-adjacent-next" rel="next" href="/blog/{esc(next_post["slug"])}/">'
            f'<span class="post-adjacent-label">Older &rarr;</span>'
            f'<span class="post-adjacent-title">{esc(next_post["title"])}</span></a>'
        )
    else:
        parts.append('            <span class="post-adjacent-spacer"></span>')
    parts.append("        </nav>")
    return "\n".join(parts)


def render_page(meta, content, slug, prev_post, next_post):
    title = collapse_ws(meta.get("title", "Untitled"))
    page_title = f"{title} | Bitroot Newslogger"
    excerpt = clamp(meta.get("excerpt", "") or f"{title} — on the Bitroot newslogger.")
    canonical = f"{BLOG_URL}/{slug}/"
    image = post_image(meta)
    og_image = absolute(image) if image else DEFAULT_OG_IMAGE
    tags = meta.get("tags") or []
    tag = tags[0] if tags else "General"
    published_iso = iso_date(meta)
    display_date = (
        fmt_datetime(meta.get("published_at"))
        if meta.get("published_at")
        else fmt_date(meta.get("date"))
    )
    word_count = len(content.split())
    read_time = max(1, math.ceil(word_count / 200))
    body_html = render_markdown(content)
    references = build_references(meta, body_html)

    refs_html = ""
    if references:
        items = "\n".join(
            f'                    <li><a href="{esc(r["url"])}" target="_blank" rel="noopener noreferrer">{esc(r["label"])}</a></li>'
            for r in references
        )
        refs_html = f"""            <aside class="post-sources" aria-label="Sources">
                <h2 class="post-sources-title">Sources</h2>
                <ol class="post-sources-list">
{items}
                </ol>
            </aside>"""

    article_tags = "\n".join(
        f'    <meta property="article:tag" content="{esc(t)}">' for t in tags
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{esc(page_title)}</title>
    <meta name="description" content="{esc(excerpt)}">
    <link rel="canonical" href="{canonical}">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{esc(title)}">
    <meta property="og:description" content="{esc(excerpt)}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="{esc(og_image)}">
    <meta property="og:site_name" content="Bitroot Newslogger">
    <meta property="article:published_time" content="{esc(published_iso)}">
{article_tags}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{esc(title)}">
    <meta name="twitter:description" content="{esc(excerpt)}">
    <meta name="twitter:image" content="{esc(og_image)}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="{FONTS_HREF}" rel="stylesheet">

    <link rel="icon" type="image/png" href="{FAVICON_URL}">
    <link rel="alternate" type="application/rss+xml" title="Newslogger | Bitroot" href="/rss.xml">
    <link rel="stylesheet" href="/blog/css/blog.css">
    <link rel="stylesheet" href="/blog/css/post.css">

    <script type="application/ld+json">{json_ld(meta, slug, canonical, word_count)}</script>

    <!-- Theme: set before first paint -->
    <script>
        (function() {{
            var saved = localStorage.getItem('nl-theme');
            var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', theme);
        }})();
    </script>

    <!-- Embed/reader mode: hides header, footer, chrome when opened inside the Bitroot mobile app webview -->
    <script>
        (function() {{
            var params = new URLSearchParams(window.location.search);
            var hasParam = params.get('embed') === '1' || params.get('reader') === '1';
            var isAppWebView = /BitrootApp/i.test(navigator.userAgent);
            if (hasParam || isAppWebView) {{
                document.documentElement.setAttribute('data-embed', '1');
            }}
        }})();
    </script>
{POSTHOG_SNIPPET}
</head>
<body>
    <!-- Pixelated floating clouds -->
    <div class="cloud-ticker" aria-hidden="true">
        <div class="cloud-ticker-track">
            <img src="/blog/media/clouds.svg" width="2400" height="320" alt="" loading="lazy" decoding="async">
            <img src="/blog/media/clouds.svg" width="2400" height="320" alt="" loading="lazy" decoding="async">
        </div>
    </div>

    <!-- Minimal Header -->
    <header class="header">
        <nav class="nav">
            <a href="/" class="logo"><img src="{LOGO_URL}" alt="Bitroot" class="logo-img" width="120" height="32"></a>
            <div class="nav-links">
                <a href="/blog/" class="nav-link">newslogger</a>
                <a href="/" class="nav-link">home</a>
                <button class="theme-toggle" aria-label="Toggle theme">
                    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                </button>
            </div>
        </nav>
    </header>

    <!-- Post Content -->
    <main class="post-page">
        <article class="post-article" id="post-content">
{hero_html(meta, slug)}
            <header class="post-header">
                <div class="post-meta">
                    <span class="post-tag">{esc(tag)}</span>
                    <span class="post-date"><time datetime="{esc(published_iso)}">{esc(display_date)}</time></span>
                    <span class="post-read-time">{read_time} min read</span>
                </div>
                <h1 class="post-title">{esc(title)}</h1>
            </header>
            <div class="post-body">
{body_html}
            </div>
{refs_html}
            <nav class="post-nav">
                <a href="/blog/" class="back-link">&larr; Back to newslogger</a>
                <div class="post-nav-actions">
                    <button class="share-btn" id="share-btn" aria-label="Share this post" title="Share">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                </div>
            </nav>
{adjacent_nav(prev_post, next_post)}
        </article>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <span class="footer-text">&copy; 2026 Bitroot</span>
            <div class="footer-links">
                <a href="https://github.com/bitroot-org" class="footer-link">GitHub</a>
                <a href="https://x.com/BitrootIndia" class="footer-link">X</a>
                <a href="/rss.xml" class="footer-link">RSS</a>
            </div>
        </div>
    </footer>

    <script>
    (function() {{
        var btn = document.querySelector('.theme-toggle');
        if (btn) {{
            btn.addEventListener('click', function() {{
                var current = document.documentElement.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('nl-theme', next);
            }});
        }}

        var shareBtn = document.getElementById('share-btn');
        if (shareBtn) {{
            var shareUrl = {json.dumps(canonical)};
            var shareTitle = {json.dumps(title)};
            var shareText = {json.dumps(excerpt)};
            shareBtn.addEventListener('click', function() {{
                if (navigator.share) {{
                    navigator.share({{ title: shareTitle, text: shareText, url: shareUrl }}).catch(function() {{}});
                }} else if (navigator.clipboard) {{
                    navigator.clipboard.writeText(shareUrl).then(function() {{
                        shareBtn.classList.add('copied');
                        shareBtn.title = 'Link copied!';
                        setTimeout(function() {{
                            shareBtn.classList.remove('copied');
                            shareBtn.title = 'Share';
                        }}, 2000);
                    }}, function() {{
                        window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(shareTitle) + '&url=' + encodeURIComponent(shareUrl), '_blank');
                    }});
                }}
            }});
        }}
    }})();
    </script>
</body>
</html>
"""


def load_posts():
    posts = []
    for filepath in sorted(POSTS_DIR.glob("*.md")):
        try:
            post = frontmatter.load(filepath)
        except Exception as e:  # noqa: BLE001 - one bad post must not kill the build
            print(f"  ERROR reading {filepath.name}: {e}", file=sys.stderr)
            continue
        posts.append(
            {
                "slug": filepath.stem,
                "title": collapse_ws(post.metadata.get("title", "Untitled")),
                "date": str(post.metadata.get("date", "")),
                "meta": post.metadata,
                "content": post.content,
            }
        )
    # Newest first, filename as deterministic tiebreak (matches index ordering).
    posts.sort(key=lambda p: (p["date"] or "0000-00-00", p["slug"]), reverse=True)
    return posts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        default=str(REPO_ROOT),
        help="Directory that contains (or will contain) the deployed blog/ folder",
    )
    args = parser.parse_args()
    out_root = Path(args.out)

    posts = load_posts()
    if not posts:
        print("No posts found — nothing to build.")
        return

    built = 0
    for i, post in enumerate(posts):
        prev_post = posts[i - 1] if i > 0 else None  # newer
        next_post = posts[i + 1] if i < len(posts) - 1 else None  # older
        page = render_page(post["meta"], post["content"], post["slug"], prev_post, next_post)
        out_dir = out_root / "blog" / post["slug"]
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(page, encoding="utf-8")
        built += 1

    print(f"Built {built} static post pages under {out_root / 'blog'}/<slug>/")


if __name__ == "__main__":
    main()
