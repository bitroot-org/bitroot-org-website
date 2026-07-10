"""
Blog Link Agent
---------------
1. Asks Grok (xAI Responses API, server-side x_search tool) for niche tech
   releases / interesting articles posted on X in the last 24h that include
   an image or video.
2. Validates candidates against the returned citations (only citation-backed
   post URLs are trusted).
3. Dedupes against scripts/seen_links.json.
4. Opens one GitHub issue per new link with the 'blog-link' label.

Required env vars (set automatically in the GitHub Actions workflow):
  XAI_API_KEY        - xAI API key (repo secret)
  GITHUB_TOKEN       - provided by Actions
  GITHUB_REPOSITORY  - e.g. "bitroot-org/bitroot-org-website"
"""

import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

XAI_API_KEY = os.environ["XAI_API_KEY"]
GH_TOKEN = os.environ["GITHUB_TOKEN"]
REPO = os.environ["GITHUB_REPOSITORY"]

STATE_FILE = Path(__file__).parent / "seen_links.json"
LABEL = "blog-link"
MODEL = "grok-4.5"  # must be a reasoning model with x_search tool support
MAX_ISSUES_PER_RUN = 5

# Tune this to your taste — it is the heart of the agent.
CURATION_PROMPT = """\
You MUST use the x_search tool to find real, current posts on X. Do NOT \
answer from memory — every result must come from an actual search. Run \
multiple searches with different queries if the first returns little.

Search X for posts from the last 24 hours about NICHE tech releases and \
genuinely interesting technical articles. Focus on: new developer tools, \
open-source project launches, indie hardware/software releases, deep-dive \
engineering blog posts, new AI/ML models or frameworks from smaller teams.

STRICT RULES:
- Only include posts that contain an IMAGE or VIDEO attachment. Verify this.
- Exclude: memes, giveaways, hype threads without substance, job posts, \
mainstream news everyone already covers (e.g. big-tech keynotes), ads.
- Prefer original announcements over quote-tweets of them.
- Return AT MOST {max_n} posts. Quality over quantity; zero is acceptable.

Respond with ONLY a JSON array (no markdown fences, no prose). Each element:
{{"url": "<https://x.com/.../status/...>",
  "title": "<short title>",
  "summary": "<1-2 sentence why it's interesting>",
  "media": "image" or "video"}}
"""


def tweet_id(url: str) -> str | None:
    m = re.search(r"(?:x|twitter)\.com/[^/]+/status/(\d+)", url)
    return m.group(1) if m else None


def post_exists(url: str) -> bool:
    """Fallback verification via X's public oEmbed endpoint (no auth).
    Returns True only if X confirms the post exists."""
    try:
        r = requests.get("https://publish.twitter.com/oembed",
                         params={"url": url, "omit_script": "true"},
                         timeout=15)
        return r.status_code == 200
    except requests.RequestException:
        return False


def call_grok() -> tuple[list[dict], set[str]]:
    """Returns (candidates, citation_ids)."""
    yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
    resp = requests.post(
        "https://api.x.ai/v1/responses",
        headers={"Authorization": f"Bearer {XAI_API_KEY}",
                 "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "input": [{"role": "user",
                       "content": CURATION_PROMPT.format(max_n=MAX_ISSUES_PER_RUN)}],
            "tools": [{
                "type": "x_search",
                "from_date": yesterday,
                "enable_image_understanding": True,
                "enable_video_understanding": True,
            }],
        },
        timeout=300,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("error"):
        raise RuntimeError(f"xAI API error: {data['error']}")

    # Debug visibility: what did the model actually do?
    output_types = [item.get("type") for item in data.get("output", [])]
    print(f"DEBUG output item types: {output_types}")
    print(f"DEBUG server_side_tool_usage: {data.get('server_side_tool_usage')}")

    # Final assistant text = last output item's text content.
    text = ""
    for item in data.get("output", []):
        for block in item.get("content", []) or []:
            if block.get("type") in ("output_text", "text"):
                text = block.get("text", text)

    print(f"DEBUG model text (first 500 chars): {text[:500]!r}")

    # Citations: trust only posts Grok actually found on X. They can appear
    # (a) top-level, or (b) as url_citation annotations on content blocks.
    citation_urls = []
    for c in data.get("citations", []) or []:
        citation_urls.append(c if isinstance(c, str) else c.get("url", ""))
    for item in data.get("output", []):
        for block in item.get("content", []) or []:
            for ann in block.get("annotations", []) or []:
                citation_urls.append(ann.get("url", ""))
    citation_ids = {tid for u in citation_urls if (tid := tweet_id(u))}
    print(f"DEBUG citation URLs found: {len(citation_urls)} "
          f"({len(citation_ids)} unique post IDs)")

    # Parse the JSON array (strip accidental fences).
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1:
        print("No JSON array in model output; treating as zero results.")
        return [], citation_ids
    try:
        candidates = json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        print(f"JSON parse failed: {e}")
        return [], citation_ids
    return candidates, citation_ids


def load_seen() -> set[str]:
    if STATE_FILE.exists():
        return set(json.loads(STATE_FILE.read_text()))
    return set()


def save_seen(seen: set[str]) -> None:
    STATE_FILE.write_text(json.dumps(sorted(seen), indent=2) + "\n")


def gh(method: str, path: str, **kwargs):
    r = requests.request(
        method, f"https://api.github.com{path}",
        headers={"Authorization": f"Bearer {GH_TOKEN}",
                 "Accept": "application/vnd.github+json"},
        timeout=30, **kwargs,
    )
    return r


def ensure_label():
    r = gh("POST", f"/repos/{REPO}/labels",
           json={"name": LABEL, "color": "0e8a16",
                 "description": "Curated tech post from X for the blog"})
    if r.status_code not in (201, 422):  # 422 = already exists
        r.raise_for_status()


def create_issue(post: dict):
    r = gh("POST", f"/repos/{REPO}/issues",
           json={"title": post.get("title", post["url"])[:120],
                 "body": post["url"], "labels": [LABEL]})
    r.raise_for_status()
    print(f"Created issue #{r.json()['number']}: {post['url']}")


def main():
    candidates, citation_ids = call_grok()
    print(f"Grok returned {len(candidates)} candidates, "
          f"{len(citation_ids)} citation-backed posts.")

    seen = load_seen()
    ensure_label()
    created = 0

    for post in candidates:
        url = post.get("url", "")
        tid = tweet_id(url)
        if not tid:
            print(f"Skipping (not a post URL): {url}")
            continue
        if tid in citation_ids:
            verified = "citation"
        elif post_exists(url):
            verified = "oembed"
        else:
            print(f"Skipping (unverifiable, possibly hallucinated): {url}")
            continue
        print(f"Verified via {verified}: {url}")
        if tid in seen:
            print(f"Skipping (already filed): {url}")
            continue
        create_issue(post)
        seen.add(tid)
        created += 1
        if created >= MAX_ISSUES_PER_RUN:
            break

    save_seen(seen)
    print(f"Done. {created} new issue(s) created.")


if __name__ == "__main__":
    sys.exit(main())
