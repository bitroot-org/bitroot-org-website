---
date: '2026-07-15'
excerpt: Version 1.1 of Simplex File Organizer can sort 20 000 files into custom nested
  folders and roll back with a single undo, fixing a UI lag and adding Boolean rule
  support.
image: https://pbs.twimg.com/amplify_video_thumb/2077267297870254081/img/0bcry_KGmoCCzDdy.jpg
published_at: '2026-07-15T10:42:40.221696+00:00'
sources:
- https://x.com/Rifle_Blade/status/2077269004201128047
tags:
- file organization
- desktop tool
- productivity
title: Simplex File Organizer v1.1 adds bulk nesting and undo
video: https://video.twimg.com/amplify_video/2077267297870254081/vid/avc1/2560x1440/0fH1ly3inxt84ogY.mp4?tag=28
---

Simplex File Organizer v1.1 arrived with a claim that it can arrange 20,000 files into custom nested folders and restore the original layout with a one‑click Undo. The update also fixes a lingering browse‑button lag and introduces NOT/OR operator rules for more expressive folder‑matching.

## Bulk organization and instant rollback
The core workflow remains drag‑and‑drop: you point the app at a source directory, define a set of rules (now supporting NOT and OR), and let the tool create a hierarchy of folders that match those rules. Once the operation finishes, a single **Undo** button restores the original flat layout, which is handy for quick experiments. The tweet announcing the release shows the demo on the [tweet](https://x.com/Rifle_Blade/status/2077269004201128047).

## UI polish and performance tweak
Version 1.1 replaces the old logo, smooths the folder‑creation progress bar, and eliminates a noticeable lag when opening the file‑browser dialog. Those tweaks make the app feel snappier, but they don’t change its fundamental limitation: it’s a Windows‑only desktop binary with no CLI or API, so automation pipelines can’t invoke it directly.

## Cost and licensing
The developer hasn’t posted a price tag in the announcement, and the download page (not linked here) lists the tool as free for personal use. Commercial licensing terms are unclear, which may matter for startups that need to embed the organizer into internal tooling.

## Should startup engineers adopt it?
For teams that frequently receive bulk data dumps (e.g., logs, CSV exports) and need an ad‑hoc way to view them in a structured folder tree, Simplex offers a quick visual sorting step without writing custom scripts. However, the lack of scriptable interfaces means you’ll still need a separate process for CI/CD or automated cleanup. Also, the undo feature only works for the most recent run, so repeated batch operations can accumulate state you can’t revert.

## When to try it
Give Simplex a spin on a one‑off data‑migration task or a manual QA review where visual folder grouping speeds up inspection. Skip it for fully automated pipelines until a CLI or API becomes available.