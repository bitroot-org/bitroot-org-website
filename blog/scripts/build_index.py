#!/usr/bin/env python3
"""
Build Posts Index

Scans the posts directory and generates an index.json file
that the frontend uses to discover and list posts.
"""

import os
import json
import re
from pathlib import Path

import frontmatter

POSTS_DIR = Path("blog/posts")
INDEX_FILE = POSTS_DIR / "index.json"


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


if __name__ == "__main__":
    print("Building posts index...")
    build_index()
