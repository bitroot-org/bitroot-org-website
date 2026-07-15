# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo actually is

`bitroot.org` is **not** a single static site. It is several independent surfaces
that a GitHub Actions workflow **assembles into one site at deploy time** and
publishes to GitHub Pages (custom domain `bitroot.org`, see `CNAME`):

- **`bitroot-v3/`** — the primary site: a **Next.js 16 app** statically exported
  (`output: "export"` → `bitroot-v3/out/`). Owns `/` and most routes (`/about`,
  `/kits`, `/stacks`, `/guides`, `/tools`, `/products`, `/newsletter`, etc.).
  **This is where most app work happens — it has its own detailed
  `bitroot-v3/CLAUDE.md`; read that before touching the app.**
- **`blog/`** — a self-contained static blog system (HTML/CSS/JS + Python build
  scripts + ~190 auto-generated markdown posts in `blog/posts/`). Served at
  `/blog/`. See "Blog pipeline" below.
- **`legal/`, `platter/`** — standalone legacy static HTML pages, served as-is.
- **Root assets** (`css/`, `js/`, `images/`, `fonts/`, `documents/`, `rss.xml`,
  `robots.txt`, `favicon.png`, `.well-known/`) — Webflow-era shared static files
  still copied into the deploy.

There is **no root `index.html`** — `/` comes from the v3 export. The old
Webflow root pages are gone; editing root HTML does nothing. `_archive/` and
`_scratch/` are throwaway scratch space — ignore them.

## How a deploy is assembled (the key cross-file flow)

`.github/workflows/deploy-pages.yml` runs on **push to `main`** and does:

1. `npm ci && npm run build` in `bitroot-v3/` → static export at `bitroot-v3/out/`.
2. Copy preserved legacy folders + root files into a fresh deploy dir
   (`blog legal platter css js images fonts documents .well-known` and
   `rss.xml robots.txt sitemap.xml favicon.png CNAME .nojekyll`).
3. `python blog/scripts/build_post_pages.py --out <dir>` — pre-render every blog
   post to a crawlable `blog/<slug>/index.html`.
4. **Overlay `bitroot-v3/out/.` on top** — v3 wins for any path it owns.
5. Upload + deploy to GitHub Pages.

Consequences:
- **Editing v3 source and pushing to `main` ships to prod.** Nothing in `out/`
  is committed; CI rebuilds it. Don't commit build artifacts.
- A change to *any* surface (v3, blog, legal, platter, root assets) on `main`
  redeploys the whole site.

## Blog pipeline (auto-generated content)

Three pieces, mostly automated via GitHub Actions:

- **`blog-agent.yml`** — daily cron, manual dispatch, or a GitHub issue labeled
  `blog-link`. Runs `blog/scripts/generate_post.py`, which fetches URLs and uses
  **Groq** to synthesize an original post, then commits markdown to `blog/posts/`.
- **`blog-index.yml`** — triggered by pushes to `blog/posts/*.md`. Runs
  `blog/scripts/build_index.py`, which regenerates `blog/posts/index.json`
  (frontend loader index), `blog/p/<n>.html` (stable short-link redirects),
  `rss.xml`, `blog/sitemap.xml`, and injects the first page of posts into
  `blog/index.html` between `POSTS:BEGIN/POSTS:END` markers.
- **`build_post_pages.py`** — runs at deploy time (step 3 above) to pre-render
  posts to clean static URLs.

Because the index/agent workflows commit with `GITHUB_TOKEN` (which doesn't
re-trigger `push` workflows), `deploy-pages.yml` also listens to the
**`workflow_run` completion of "Blog Index Builder"** so blog changes still
deploy.

## Commands

**Primary app (bitroot-v3) — do app work here:**
```bash
cd bitroot-v3
npm run dev      # dev server (Turbopack)
npm run build    # production static export → out/
npm run lint     # ESLint (flat config); no test runner configured
```
See `bitroot-v3/CLAUDE.md` for the app's stack, content model, and conventions.

**Preview the assembled/legacy static site locally (blog, legal, platter, root):**
```bash
python -m http.server 8000   # or: python server.py — serves repo root at :8000
```
Note: this serves committed files only; it does **not** run the v3 build or the
deploy assembly, so `/` won't match production.

**Blog scripts (normally CI-run; invoke manually only when iterating):**
```bash
python blog/scripts/build_index.py
python blog/scripts/build_post_pages.py --out <dir>
```

## Cross-surface analytics convention

All surfaces (org / blog / platter / club) share **one PostHog project**. Keep
event names stable and identical across surfaces; **segment by the `site`
super property** (set per surface, e.g. `"org"` in
`bitroot-v3/src/instrumentation-client.ts`) — do **not** prefix event names per
site. Conversion-event helpers and the `identify()` flow live in
`bitroot-v3/src/lib/analytics.ts`.

## TeamLife board (MCP)

Tasks for this project live on the Bitroot TeamLife board, exposed through the
`teamlife` MCP server. Keep it in sync as you work — the team watches it live.

- **Find work:** `list_tasks` — always take task IDs from here, never invent one.
- **Before you start:** `start_work(taskId, note)` — moves the card to In Progress.
- **While working:** `add_comment(taskId, body)` for progress (body is markdown);
  `add_screenshot(taskId, imageBase64)` to attach evidence for any UI work.
- **When finished:** `update_task(taskId, status)` — `review` if a human should
  look, `done` if it's self-evidently complete.

Never leave a task In Progress without a comment saying what's blocking it.
Everything you do is recorded on the board as Bit2 and is visible to the team.
