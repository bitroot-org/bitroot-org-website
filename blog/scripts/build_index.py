#!/usr/bin/env python3
"""
Build Posts Index

Scans the posts directory and generates an index.json file
that the frontend uses to discover and list posts.
"""

import os
import json
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from xml.etree.ElementTree import Element, SubElement, ElementTree, indent

import shutil

import frontmatter

POSTS_DIR = Path("blog/posts")
INDEX_FILE = POSTS_DIR / "index.json"
RSS_FILE = Path("rss.xml")
SHORT_LINKS_DIR = Path("blog/p")

SITE_URL = "https://bitroot.org"
BLOG_URL = f"{SITE_URL}/blog"
RSS_URL = f"{SITE_URL}/rss.xml"


def get_post_metadata(filepath):
    """Extract metadata from a post file."""
    try:
        post = frontmatter.load(filepath)
        # Get file modification time for secondary sorting
        mtime = filepath.stat().st_mtime

        # Get image, skip deprecated unsplash source URLs
        image = post.metadata.get("image", "")
        if image and "source.unsplash.com" in image:
            image = ""  # Let frontend use tag-based fallback

        metadata = {
            "filename": filepath.name,
            "slug": filepath.stem,
            "title": post.metadata.get("title", "Untitled"),
            "date": str(post.metadata.get("date", "")),
            "published_at": post.metadata.get("published_at", ""),
            "tags": post.metadata.get("tags", []),
            "excerpt": post.metadata.get("excerpt", ""),
            "image": image,
            "sources": post.metadata.get("sources", []),
            "_mtime": mtime,  # Internal field for sorting, not exported
        }

        # Add video if present
        if post.metadata.get("video"):
            metadata["video"] = post.metadata.get("video")

        # Add media gallery if present
        if post.metadata.get("media"):
            metadata["media"] = post.metadata.get("media")

        return metadata
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None


def build_short_links(posts):
    """Generate static redirect HTML files at blog/p/<n>.html with OG meta tags.

    Posts are numbered sequentially (1 = newest). Each file provides
    proper OG/Twitter Card meta tags for social media crawlers plus
    a meta-refresh redirect to the full post URL.
    """
    # Clear and recreate directory
    if SHORT_LINKS_DIR.exists():
        shutil.rmtree(SHORT_LINKS_DIR)
    SHORT_LINKS_DIR.mkdir(parents=True)

    for i, post in enumerate(posts, start=1):
        post["shortId"] = i
        slug = post["slug"]
        title = post.get("title", "Untitled")
        excerpt = post.get("excerpt", "Read this article on the Bitroot newslogger.")
        image = post.get("image") or f"{SITE_URL}/images/newslogger-og.jpg"
        canonical = f"{BLOG_URL}/post.html?slug={slug}"

        # Escape HTML entities in text content
        safe_title = title.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")
        safe_excerpt = excerpt.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=/blog/post.html?slug={slug}">
<link rel="canonical" href="{canonical}">
<title>{safe_title} | Bitroot Newslogger</title>
<meta property="og:type" content="article">
<meta property="og:title" content="{safe_title}">
<meta property="og:description" content="{safe_excerpt}">
<meta property="og:image" content="{image}">
<meta property="og:url" content="{canonical}">
<meta property="og:site_name" content="Bitroot Newslogger">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{safe_title}">
<meta name="twitter:description" content="{safe_excerpt}">
<meta name="twitter:image" content="{image}">
</head>
<body>
<p>Redirecting&hellip; <a href="{canonical}">Click here</a> if not redirected.</p>
</body>
</html>
"""
        filepath = SHORT_LINKS_DIR / f"{i}.html"
        filepath.write_text(html, encoding="utf-8")

    print(f"Generated {len(posts)} short link pages in {SHORT_LINKS_DIR}/")


def build_index():
    """Build the posts index."""
    if not POSTS_DIR.exists():
        print(f"Posts directory not found: {POSTS_DIR}")
        return

    posts = []

    # Find all markdown files
    for filepath in POSTS_DIR.glob("*.md"):
        if filepath.name == ".gitkeep":
            continue

        metadata = get_post_metadata(filepath)
        if metadata:
            posts.append(metadata)
            print(f"  Found: {filepath.name} - {metadata['title']}")

    # Sort posts by date descending (newest first)
    # Use file modification time as secondary sort for same-date posts
    # Handle empty/missing dates by treating them as oldest
    posts.sort(key=lambda p: (p.get("date", "") or "0000-00-00", p.get("_mtime", 0)), reverse=True)

    # Extract sorted post files list
    post_files = [p["filename"] for p in posts]

    # Remove internal _mtime field before exporting
    for p in posts:
        p.pop("_mtime", None)

    print(f"\n  Sorted {len(posts)} posts by date (newest first)")

    # Generate short link redirect pages (also adds shortId to each post)
    build_short_links(posts)

    # Write index file
    index_data = {
        "generated": True,
        "count": len(posts),
        "posts": post_files,
        "metadata": posts,
    }

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2)

    print(f"\nGenerated {INDEX_FILE} with {len(posts)} posts")

    # Generate RSS feed
    build_rss(posts)


def build_rss(posts):
    """Generate an RSS 2.0 feed from the posts metadata."""
    rss = Element("rss", version="2.0")
    rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")

    channel = SubElement(rss, "channel")
    SubElement(channel, "title").text = "Newslogger | Bitroot"
    SubElement(channel, "link").text = BLOG_URL
    SubElement(channel, "description").text = (
        "Thoughts, tutorials, and insights from the Bitroot team."
    )
    SubElement(channel, "language").text = "en"
    SubElement(channel, "lastBuildDate").text = format_datetime(
        datetime.now(timezone.utc)
    )

    atom_link = SubElement(channel, "atom:link")
    atom_link.set("href", RSS_URL)
    atom_link.set("rel", "self")
    atom_link.set("type", "application/rss+xml")

    for post in posts:
        item = SubElement(channel, "item")
        SubElement(item, "title").text = post["title"]

        short_id = post.get("shortId")
        if short_id:
            post_url = f"{BLOG_URL}/p/{short_id}"
        else:
            post_url = f"{BLOG_URL}/post.html?slug={post['slug']}"
        SubElement(item, "link").text = post_url

        guid = SubElement(item, "guid")
        guid.set("isPermaLink", "true")
        guid.text = post_url

        # Description: excerpt + citation
        desc = post.get("excerpt", "")
        sources = post.get("sources", [])
        if sources:
            citation_lines = "".join(
                f'<li><a href="{s}">{s}</a></li>' for s in sources
            )
            desc += f"\n\n<p><strong>Source:</strong></p><ul>{citation_lines}</ul>"
        SubElement(item, "description").text = desc

        # pubDate from published_at or date
        pub_str = post.get("published_at") or post.get("date", "")
        if pub_str:
            try:
                dt = datetime.fromisoformat(str(pub_str))
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                SubElement(item, "pubDate").text = format_datetime(dt)
            except (ValueError, TypeError):
                pass

        # Categories from tags
        for tag in post.get("tags", []):
            SubElement(item, "category").text = tag

        # Image enclosure
        image = post.get("image", "")
        if image and image.startswith("http"):
            enc = SubElement(item, "enclosure")
            enc.set("url", image)
            enc.set("type", "image/jpeg")
            enc.set("length", "0")

        # Source element (RSS native citation)
        if sources:
            src = SubElement(item, "source")
            src.set("url", sources[0])
            src.text = "Original Source"

    indent(rss, space="  ")
    tree = ElementTree(rss)
    tree.write(RSS_FILE, encoding="unicode", xml_declaration=True)
    print(f"Generated {RSS_FILE} with {len(posts)} items")


if __name__ == "__main__":
    print("Building posts index...")
    build_index()
