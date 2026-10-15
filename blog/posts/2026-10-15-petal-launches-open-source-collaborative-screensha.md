---
date: '2026-10-15'
excerpt: Low latency, high resolution screensharing and remote control.
image: null
published_at: '2026-10-15T13:50:56.796874+00:00'
sources:
- https://petal.live/
tags:
- screen sharing
- open source
- remote collaboration
title: Petal launches open-source collaborative screen‑sharing tool
---

Petal, the new open‑source screen‑sharing app, went live on July 31 2026. The desktop client lets you click, type and scroll inside any window that’s been shared, and the UI shows labeled cursors for each participant.

## Real‑time control and multi‑user support

Shared windows appear as normal, resizable desktop windows rather than tiled tiles, so you keep the native feel of your OS. Multiple users can interact simultaneously, and each cursor is labeled, making it clear who’s acting. The remote‑control guide on the site explains that you can type, scroll and click as if the window were yours.

## Three deployment paths

* **Petal Cloud** – The hosted version runs on the provider’s LiveKit video infrastructure; you simply download the app and join a room with zero configuration.
* **Self‑host** – For teams that need data‑control, you can run a LiveKit server yourself using a single `docker‑compose` file and point the app at that endpoint. You are responsible for the media server.
* **Full source build** – The repo is publicly available; you can fork, build, and ship a custom binary, taking over every component of the stack.

## Cost considerations

Petal’s code and the desktop client are free to download, and the self‑host option only requires the cost of running a LiveKit server (e.g., cloud compute or on‑prem hardware). The announcement does not list any pricing tiers for the hosted cloud service, so teams should plan for possible usage‑based fees that are not disclosed.

## When to try it

If your startup already uses video calls and needs a lightweight way for engineers to pair‑program or demo UI changes without juggling screen‑sharing extensions, give Petal a spin. Start with the cloud version to test the workflow, then move to self‑hosting if you hit compliance or latency constraints.

**What to watch:** keep an eye on the project’s roadmap and any future pricing announcements for the hosted service, as those will affect total cost of ownership.