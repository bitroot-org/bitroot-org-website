#!/usr/bin/env bash
#
# Assemble the full bitroot.org site into ./dist — the same merge that
# .github/workflows/deploy-pages.yml does for GitHub Pages, but runnable
# anywhere (Dokploy/Coolify/Nixpacks static build, local preview, etc.).
#
# Result: ./dist contains the Next.js app (owns /) overlaid on top of the
# preserved static surfaces (blog/, legal/, platter/, shared assets), with
# every blog post pre-rendered to dist/blog/<slug>/index.html.
#
# Panel wiring (e.g. Dokploy "Static" build):
#   Build Path:          .            (repo root, NOT bitroot-v3)
#   Custom build command: bash scripts/build-site.sh
#   Publish Directory:   dist
#
# Requires: node + npm, python3 (with pip).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DIST="$ROOT/dist"

echo "==> Python deps for the blog build"
python3 -m pip install --quiet --disable-pip-version-check python-frontmatter markdown \
  || python3 -m pip install --quiet --disable-pip-version-check --break-system-packages python-frontmatter markdown

echo "==> Building bitroot-v3 (Next.js static export)"
( cd bitroot-v3 && { npm ci || npm install; } && npm run build )

echo "==> Assembling $DIST"
rm -rf "$DIST"
mkdir -p "$DIST"

# 1. Preserved legacy folders + root files first.
for d in blog legal platter css js images fonts documents .well-known; do
  [ -d "$d" ] && cp -R "$d" "$DIST/"
done
for f in rss.xml robots.txt sitemap.xml favicon.png CNAME .nojekyll; do
  [ -f "$f" ] && cp "$f" "$DIST/"
done

# 2. Pre-render every blog post to a crawlable static page.
python3 blog/scripts/build_post_pages.py --out "$DIST"

# 3. Overlay the v3 export — it wins for any path it owns (/, /kits/, …).
cp -R bitroot-v3/out/. "$DIST/"

# 4. Keep underscored _next/ paths intact on static hosts that assume Jekyll.
touch "$DIST/.nojekyll"

echo "==> Done. Top-level entries in dist/:"
ls -1 "$DIST"
