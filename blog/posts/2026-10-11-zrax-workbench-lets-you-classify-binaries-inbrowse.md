---
date: '2026-10-11'
excerpt: '[ no files ]

  drop binaries anywhere

  one file opens in the workbench; several open the batch table. press

  o

  to browse.'
image: null
published_at: '2026-10-11T15:12:56.567689+00:00'
sources:
- https://zr.ax/
tags:
- binary analysis
- reverse engineering
- web tool
title: Zrax Workbench lets you classify binaries in‑browser without uploading
---

Zrax Workbench launched a browser‑only interface where you can drop any binary file and instantly see a classification, entropy map, and hex view—all computed locally with zero network traffic.

## Drag‑and‑drop, local classification
You simply drag a file onto the page; a single file opens directly in the workbench, while multiple files populate a batch table. The tool reads each file locally and runs a classification and entropy analysis on‑device, so nothing is ever uploaded to a server.

## Visualizations and navigation
The UI offers several panes – classification, entropy, hex, JSON, Hilbert, and linear views – all rendered in the browser. Navigation works with mouse wheel zoom, pan, and Alt+←/→ history shortcuts. You can fit the view to the whole file, zoom to a byte offset, or copy offsets directly from the hex pane.

## No install, but unknown limits
Because the service runs entirely in the browser, there is no installer or runtime dependency. The site does not publish pricing, usage quotas, or maximum file‑size constraints, so large binaries may hit performance or memory limits that are not documented.

## When to try it
If you need a quick, zero‑install way to get a rough classification and entropy snapshot of a small binary – for example during a triage or a proof‑of‑concept reverse‑engineering session – drop it into [Zrax Workbench](https://zr.ax/) and explore the built‑in visualizations. For deeper analysis or large codebases, consider a dedicated offline tool.