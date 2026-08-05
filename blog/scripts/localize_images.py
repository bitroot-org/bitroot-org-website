#!/usr/bin/env python3
"""
Localize post cover images.

Historically generate_post.py wrote remote og:image/CDN URLs (mostly
pbs.twimg.com) straight into post frontmatter. Those URLs rot — tweets get
deleted, CDNs block hotlinking — leaving broken cards on the homepage feed
and /blog. generate_post.py now self-hosts images at generation time; this
script backfills every existing post:

  - remote image alive  -> download to blog/media/<post-stem>.<ext>,
                           rewrite frontmatter to the local media/ path
  - remote image dead   -> clear the image field (4xx) so frontends fall
                           back to the pixel placeholder
  - transient failure   -> leave the URL alone (rerun later)

Safe to rerun: posts already pointing at media/ are skipped, and an
already-downloaded file is reused without re-fetching.

Usage:  python blog/scripts/localize_images.py [--dry-run]
"""

import argparse
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import frontmatter
import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = REPO_ROOT / "blog" / "posts"
MEDIA_DIR = REPO_ROOT / "blog" / "media"
# Store an ABSOLUTE media URL in frontmatter — a relative 'media/…' path only
# resolves under /blog/ pages, breaking the homepage feed and the TeamLife
# studio, which read the frontmatter raw.
MEDIA_BASE_URL = "https://bitroot.org/blog/media"

MAX_IMAGE_SIZE = 8 * 1024 * 1024  # 8MB
WORKERS = 12

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Referer": "https://twitter.com/",
}

IMAGE_EXT_BY_MIME = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
}


def pick_ext(url, content_type):
    ext = IMAGE_EXT_BY_MIME.get(content_type)
    if ext:
        return ext
    u = url.lower()
    for candidate in ("jpg", "jpeg", "png", "webp", "gif", "avif"):
        if f".{candidate}" in u or f"format={candidate}" in u:
            return "jpg" if candidate == "jpeg" else candidate
    return None


def existing_local_file(stem):
    for ext in IMAGE_EXT_BY_MIME.values():
        path = MEDIA_DIR / f"{stem}.{ext}"
        if path.exists() and path.stat().st_size > 0:
            return path
    return None


def fetch_image(url, stem):
    """Download url to MEDIA_DIR/<stem>.<ext>.

    Returns ("ok", local_rel_path) | ("dead", reason) | ("error", reason).
    """
    cached = existing_local_file(stem)
    if cached:
        return "ok", f"{MEDIA_BASE_URL}/{cached.name}"

    try:
        with requests.get(url, headers=HEADERS, stream=True, timeout=30) as resp:
            if 400 <= resp.status_code < 500:
                return "dead", f"HTTP {resp.status_code}"
            resp.raise_for_status()

            content_type = resp.headers.get("content-type", "").split(";")[0].strip().lower()
            ext = pick_ext(url, content_type)
            if not ext:
                return "dead", f"not an image (content-type: {content_type})"

            length = resp.headers.get("content-length")
            if length and int(length) > MAX_IMAGE_SIZE:
                return "dead", f"too large ({length} bytes)"

            MEDIA_DIR.mkdir(parents=True, exist_ok=True)
            filepath = MEDIA_DIR / f"{stem}.{ext}"
            total = 0
            with open(filepath, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        total += len(chunk)
                        if total > MAX_IMAGE_SIZE:
                            os.remove(filepath)
                            return "dead", "exceeded max size during download"
            if total == 0:
                os.remove(filepath)
                return "dead", "empty response body"
            return "ok", f"{MEDIA_BASE_URL}/{filepath.name}"

    except requests.exceptions.RequestException as e:
        return "error", str(e)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="report without downloading or rewriting")
    args = parser.parse_args()

    targets = []
    for filepath in sorted(POSTS_DIR.glob("*.md")):
        post = frontmatter.load(filepath)
        image = str(post.metadata.get("image") or "")
        if image.startswith("http") and "bitroot.org" not in image:
            targets.append((filepath, post, image))

    print(f"{len(targets)} posts with remote images")
    if args.dry_run:
        for filepath, _, image in targets:
            print(f"  would fetch: {filepath.name} <- {image}")
        return

    localized = cleared = kept = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {
            pool.submit(fetch_image, image, filepath.stem): (filepath, post, image)
            for filepath, post, image in targets
        }
        for future in as_completed(futures):
            filepath, post, image = futures[future]
            status, detail = future.result()
            if status == "ok":
                post.metadata["image"] = detail
                localized += 1
                print(f"  localized: {filepath.name} -> {detail}")
            elif status == "dead":
                post.metadata["image"] = None
                cleared += 1
                print(f"  cleared:   {filepath.name} ({detail})")
            else:
                kept += 1
                print(f"  kept:      {filepath.name} (transient: {detail})")
                continue
            filepath.write_text(frontmatter.dumps(post) + "\n", encoding="utf-8")

    print(f"\nDone: {localized} localized, {cleared} cleared (dead), {kept} kept (transient errors)")
    if kept:
        print("Rerun later to retry the transient failures.")
        sys.exit(0)


if __name__ == "__main__":
    main()
