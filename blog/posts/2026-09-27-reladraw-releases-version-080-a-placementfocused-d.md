---
date: '2026-09-27'
excerpt: Contribute to reladraw/reladraw development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-09-27-reladraw-releases-version-080-a-placementfocused-d.png
published_at: '2026-09-27T14:27:29.358667+00:00'
sources:
- https://github.com/reladraw/reladraw
tags:
- diagrams
- cli
- typescript
title: reladraw releases version 0.8.0, a placement‑focused diagram language
---

reladraw version 0.8.0 landed on GitHub, adding a stable‑ish command‑line tool that converts a `.reladraw` file into an SVG with a single call, e.g. `reladraw diagram.reladraw -o diagram.svg`.

## A middle ground between auto‑layout and manual drawing
Unlike Mermaid, Graphviz, or D2, which decide node positions for you, reladraw lets you specify relative placement (`below`, `right of`, etc.) while still using a concise text format. It avoids the verbose XML of draw.io and the guesswork of pure auto‑layout, aiming for expressive, reproducible diagrams.

## Quick start for developers
Install the tool globally with `npm install -g reladraw` and run it against a source file to produce SVG. The repository includes example files (`examples/arch.reladraw`) and a `SYNTAX.md` guide to learn the language. The entire stack—parser, layout engine, and renderer—is written in TypeScript with zero runtime dependencies, so the CLI has a tiny footprint.

## Plug‑in for AI coding agents
reladraw can be added as a skill for agents like Claude Code, Codex, Cursor, or Copilot via `npx skills add reladraw/reladraw -g`. The `-g` flag installs the skill globally; omitting it scopes the skill to the current project. Use `-a <agent>` to target a single agent. The skill version matches the installed CLI, so you’ll need to rerun the command after each release.

## What to watch
The language is still evolving—syntax changes are expected, and the Apache‑2.0 license covers code but not the project name or logo. There is no commercial pricing, but the lack of a stable API means you should treat it as experimental for production diagrams. Keep an eye on upcoming releases and community issues for stability improvements before adopting it in critical documentation pipelines.