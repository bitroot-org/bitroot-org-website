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

echo "==> Blog Python deps (frontmatter, markdown)"
# On the Nixpacks deploy the libs come from nixpacks.toml, but the bare
# `python3` there doesn't add the nix profile's site-packages to sys.path —
# wire any that exist in via PYTHONPATH.
for d in \
  "${HOME:-/root}"/.nix-profile/lib/python*/site-packages \
  /nix/var/nix/profiles/default/lib/python*/site-packages
do
  [ -d "$d" ] && export PYTHONPATH="${d}${PYTHONPATH:+:${PYTHONPATH}}"
done
if ! python3 -c "import frontmatter, markdown" 2>/dev/null; then
  # Local dev / CI: install via pip (tolerate pip being absent, the check
  # below is the real gate).
  python3 -m pip install --quiet --disable-pip-version-check python-frontmatter markdown 2>/dev/null \
    || python3 -m pip install --quiet --disable-pip-version-check --break-system-packages python-frontmatter markdown 2>/dev/null \
    || true
fi
python3 -c "import frontmatter, markdown" \
  || { echo "FATAL: python 'frontmatter' + 'markdown' unavailable"; exit 1; }

# The Nixpacks base pins an old nodejs_20 (20.6.x); this project needs >= 20.9.
# Drop in an official static Node if what's on PATH is too old.
NODE_MIN_MAJOR=20
NODE_MIN_MINOR=19
node_ok() {
  command -v node >/dev/null || return 1
  local v major minor
  v="$(node -p 'process.versions.node')"
  major="${v%%.*}"; minor="${v#*.}"; minor="${minor%%.*}"
  [ "$major" -gt "$NODE_MIN_MAJOR" ] && return 0
  [ "$major" -eq "$NODE_MIN_MAJOR" ] && [ "$minor" -ge "$NODE_MIN_MINOR" ]
}
if ! node_ok; then
  NODE_VER="20.19.4"
  echo "==> Node $(node -v 2>/dev/null || echo none) too old — fetching v${NODE_VER}"
  curl -fsSL "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-x64.tar.xz" \
    | tar -xJ -C /tmp
  export PATH="/tmp/node-v${NODE_VER}-linux-x64/bin:$PATH"
  echo "==> Now using node $(node -v), npm $(npm -v)"
fi

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
