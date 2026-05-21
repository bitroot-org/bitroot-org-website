---
date: '2026-05-21'
excerpt: Browserbase released Browse.sh, a free catalog of hundreds of site‑specific
  navigation skills for agents. It aims to give bots a reliable playbook for common
  web tasks.
image: https://pbs.twimg.com/amplify_video_thumb/2056401090552410112/img/ArrdUEpSr-F8jB1U.jpg
published_at: '2026-05-21T12:57:32.870325+00:00'
sources:
- https://x.com/i/status/2056404332824944970
tags:
- browser automation
- open-source
- web agents
title: Browserbase launches Browse.sh, an open‑source skill catalog for web agents
video: media/2026-05-21-browserbase-launches-browsesh-an-opensource-skill.mp4
---

Browserbase launched **Browse.sh**, an open‑source catalog of hundreds of web‑navigation skills that agents can call to perform tasks on the internet — the tweet announcing it noted the catalog is the "largest" of its kind ([tweet](https://x.com/i/status/2056404332824944970)).

## What the catalog contains

Browse.sh aggregates playbooks for a wide range of popular sites, from e‑commerce checkout flows to SaaS dashboards. Each skill describes the sequence of clicks, form fills, and API calls needed to complete a specific action, letting agents reuse proven patterns instead of hand‑crafting scrapers.

## Plug‑in to your agents

The catalog is hosted at [Browse.sh](http://Browse.sh) and can be queried via a simple HTTP endpoint that returns JSON definitions. Existing Browserbase agents can import these definitions with a few lines of code, making the integration almost frictionless for teams already using Browserbase's automation platform.

## Limitations to watch

The catalog’s coverage is limited to the sites Browserbase has manually researched; niche or rapidly changing pages may be missing or produce false‑positive results. Because it is community‑maintained, updates rely on contributions, so you may need to patch or extend a skill for edge cases. Also, while the catalog itself is free, using it with Browserbase’s managed infrastructure still incurs the platform’s usual usage fees.

## When to give it a spin

If your startup builds bots that repeatedly interact with mainstream web services, try swapping a hand‑rolled scraper for a Browse.sh skill on a low‑traffic endpoint. Measure success rate and latency; if the reduction in maintenance outweighs any integration overhead, consider rolling it out more broadly.