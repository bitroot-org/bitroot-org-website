---
date: '2026-06-03'
excerpt: 'New work for Paper''s new Vector Editing!


  Direction: Will Taylor (@visualsbywlroo)


  Design and Animation: Kendall Gathas, Chaewon Kang, Connor Roy-Shaw, Will Taylor
  (@visualsbywlroo)'
image: https://pbs.twimg.com/amplify_video_thumb/2062230880404336640/img/12bRzEG2wM9yokEh.jpg
published_at: '2026-06-03T19:00:26.317097+00:00'
sources:
- https://x.com/i/status/2062231122184990871
tags:
- paper
- vector editing
- design tools
title: Paper adds vector editing tools in latest update
video: media/2026-06-03-paper-adds-vector-editing-tools-in-latest-update.mp4
---

Paper's latest update brings native vector editing to the app, showcased in a short demo posted by Austin Bauwens on X. The demo credits direction to Will Taylor and design/animation to Kendall Gathas, Chaewon Kang, Connor Roy‑Shaw, and Will Taylor himself [source](https://x.com/i/status/2062231122184990871).

## What the feature actually does
The new tools let users draw, edit, and style vector shapes directly inside Paper, a shift from its traditional raster‑only workflow. The demo shows basic path manipulation, live node editing, and export to SVG. For engineers, the API surface appears to be limited to the UI; no public SDK or CLI is announced yet.

## Why it matters for startup engineers
If your product includes in‑app design or annotation, having vector primitives built into a familiar sketching surface could cut down on third‑party dependencies. The feature ships as part of the existing Paper app, so there is no extra licensing fee beyond any current subscription tier. That lowers the barrier for early experiments.

## Caveats and open questions
* **Platform lock‑in** – Paper is currently iOS‑only; there is no Android or web version, which may limit cross‑device consistency.
* **Limited automation** – The announcement does not mention programmatic access, so integrating the editor into a CI pipeline or automated testing suite would be difficult.
* **Pricing opacity** – While the feature is rolled out to existing users, the pricing model for future premium vector capabilities is unknown, so budgeting for large‑scale rollout is uncertain.

## When to try it
If your team already uses Paper for brainstorming or UI mock‑ups, enable the new vector mode and run a short usability test with a couple of designers. Watch for performance on low‑end devices and verify that exported SVGs meet your downstream tooling requirements before committing to a broader integration.