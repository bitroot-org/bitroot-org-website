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
        return {
            "filename": filepath.name,
            "slug": filepath.stem,
            "title": post.metadata.get("title", "Untitled"),
            "date": str(post.metadata.get("date", "")),
            "tags": post.metadata.get("tags", []),
            "excerpt": post.metadata.get("excerpt", ""),
        }
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None


def build_index():
    """Build the posts index."""
    if not POSTS_DIR.exists():
        print(f"Posts directory not found: {POSTS_DIR}")
        return

    posts = []
    post_files = []

    # Find all markdown files
    for filepath in sorted(POSTS_DIR.glob("*.md"), reverse=True):
        if filepath.name == ".gitkeep":
            continue

        metadata = get_post_metadata(filepath)
        if metadata:
            posts.append(metadata)
            post_files.append(filepath.name)
            print(f"  Found: {filepath.name} - {metadata['title']}")

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
