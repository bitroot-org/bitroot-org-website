"""
Blog Link Agent
---------------
1. Fetches candidate "niche tech" posts from Hacker News (Algolia Search
   API — free, public, no key) — Show HN launches + regular stories from the
   last 24h, past a light points floor to cut total noise before it ever
   reaches the model.
2. Hands that candidate pool to a curation model on OpenCode Zen (Grok by
   default — swap MODEL for any Zen-hosted model, this step is a small
   text-only completion, no special capability required) and asks it to pick
   the best few, using the same curation bar the old X-search version used.
3. The model can only pick an `id` from the list we already fetched — it
   never generates a url itself, so unlike the old xAI x_search version
   (which had to verify Grok's citations against X's oEmbed endpoint to
   catch hallucinated post URLs) there's nothing to verify here.
4. Dedupes against scripts/seen_links.json.
5. Opens one GitHub issue per new link with the 'blog-link' label.

Required env vars (set automatically in the GitHub Actions workflow):
  OPENCODE_API_KEY   - OpenCode Zen API key (repo secret)
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

OPENCODE_API_KEY = os.environ["OPENCODE_API_KEY"]
GH_TOKEN = os.environ["GITHUB_TOKEN"]
REPO = os.environ["GITHUB_REPOSITORY"]

STATE_FILE = Path(__file__).parent / "seen_links.json"
LABEL = "blog-link"
ZEN_RESPONSES_URL = "https://opencode.ai/zen/v1/responses"
MODEL = "grok-4.5"  # any OpenCode Zen model works here — swap freely
HN_SEARCH_URL = "https://hn.algolia.com/api/v1/search_by_date"
MAX_ISSUES_PER_RUN = 5
MIN_POINTS = 3  # filters total noise before the model ever sees it
CANDIDATE_POOL_PER_TAG = 60  # how many HN hits per tag we show the model

# Tune this to your taste — it is the heart of the agent.
CURATION_PROMPT = """\
You are curating a tech blog's link queue. Below is a JSON array of real \
posts from Hacker News in the last 24 hours (id, title, url, points, \
comments). Pick AT MOST {max_n} that are genuinely interesting NICHE tech: \
new developer tools, open-source project launches, indie hardware/software \
releases, deep-dive engineering blog posts, new AI/ML models or frameworks \
from smaller teams.

STRICT RULES:
- Only choose ids that appear in the list below. Never invent an id or url.
- Exclude: mainstream news everyone already covers (big-tech keynotes, \
funding rounds, politics/business-only stories), memes, listicles, job \
posts, low-effort "Ask HN" threads, pure opinion pieces with no technical \
substance.
- Prefer original launches/announcements over commentary about them.
- Quality over quantity — zero is a perfectly fine answer.

Respond with ONLY a JSON array (no markdown fences, no prose). Each element:
{{"id": "<id from the list below>", "summary": "<1-2 sentence why it's interesting>"}}

POSTS:
{posts_json}
"""


def fetch_hn_candidates() -> dict[str, dict]:
    """Recent Show HN launches + regular stories, keyed by HN objectID."""
    since = int((datetime.now(timezone.utc) - timedelta(days=1)).timestamp())
    items: dict[str, dict] = {}
    for tags in ("show_hn", "story"):
        resp = requests.get(
            HN_SEARCH_URL,
            params={
                "tags": tags,
                "numericFilters": f"created_at_i>{since},points>={MIN_POINTS}",
                "hitsPerPage": CANDIDATE_POOL_PER_TAG,
            },
            timeout=30,
        )
        resp.raise_for_status()
        for hit in resp.json().get("hits", []):
            oid = hit.get("objectID")
            if not oid or not hit.get("title"):
                continue
            url = hit.get("url") or f"https://news.ycombinator.com/item?id={oid}"
            items[oid] = {
                "id": oid,
                "title": hit["title"],
                "url": url,
                "points": hit.get("points") or 0,
                "comments": hit.get("num_comments") or 0,
            }
    return items


def call_zen(candidates: dict[str, dict]) -> list[dict]:
    """Ask a Zen-hosted model to curate. Returns [{"id", "summary"}, ...]."""
    posts = [
        {"id": c["id"], "title": c["title"], "url": c["url"],
         "points": c["points"], "comments": c["comments"]}
        for c in candidates.values()
    ]
    resp = requests.post(
        ZEN_RESPONSES_URL,
        headers={"Authorization": f"Bearer {OPENCODE_API_KEY}",
                 "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "input": [{
                "type": "message",
                "role": "user",
                "content": [{
                    "type": "input_text",
                    "text": CURATION_PROMPT.format(
                        max_n=MAX_ISSUES_PER_RUN,
                        posts_json=json.dumps(posts),
                    ),
                }],
            }],
            "max_output_tokens": 2000,
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("error"):
        raise RuntimeError(f"OpenCode Zen API error: {data['error']}")

    text = ""
    for item in data.get("output", []):
        for block in item.get("content", []) or []:
            if block.get("type") in ("output_text", "text"):
                text = block.get("text", text)

    print(f"DEBUG model text (first 500 chars): {text[:500]!r}")

    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1:
        print("No JSON array in model output; treating as zero picks.")
        return []
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        print(f"JSON parse failed: {e}")
        return []


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
                 "description": "Curated tech post from Hacker News for the blog"})
    if r.status_code not in (201, 422):  # 422 = already exists
        r.raise_for_status()


def create_issue(cand: dict, summary: str):
    body = cand["url"] + (f"\n\n{summary}" if summary else "")
    r = gh("POST", f"/repos/{REPO}/issues",
           json={"title": cand["title"][:120], "body": body, "labels": [LABEL]})
    r.raise_for_status()
    print(f"Created issue #{r.json()['number']}: {cand['url']}")


def main():
    candidates = fetch_hn_candidates()
    print(f"Fetched {len(candidates)} HN candidate(s) from the last 24h.")
    if not candidates:
        print("Nothing to curate. Done.")
        return

    picks = call_zen(candidates)
    print(f"Model picked {len(picks)} of {len(candidates)} candidates.")

    seen = load_seen()
    ensure_label()
    created = 0

    for pick in picks:
        cid = pick.get("id")
        cand = candidates.get(cid)
        if not cand:
            print(f"Skipping (model returned an id not in our candidate list): {cid!r}")
            continue
        if cid in seen:
            print(f"Skipping (already filed): {cand['url']}")
            continue
        create_issue(cand, pick.get("summary", ""))
        seen.add(cid)
        created += 1
        if created >= MAX_ISSUES_PER_RUN:
            break

    save_seen(seen)
    print(f"Done. {created} new issue(s) created.")


if __name__ == "__main__":
    sys.exit(main())
