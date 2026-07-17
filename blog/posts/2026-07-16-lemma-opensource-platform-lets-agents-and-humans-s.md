---
date: '2026-07-16'
excerpt: Lemma is now open source and lets you wire AI agents with human reviewers
  using shared tables, with a quick‑start example that runs in under an hour.
image: https://pbs.twimg.com/amplify_video_thumb/2077628323052867584/img/0lQuuyrGlwksOfrF.jpg
published_at: '2026-07-16T10:50:18.985040+00:00'
sources:
- https://x.com/LekhikaVyas/status/2077628443706155049
tags:
- lemma
- open-source
- automation
title: Lemma open‑source platform lets agents and humans share tables and approvals
video: media/2026-07-16-lemma-opensource-platform-lets-agents-and-humans-s.mp4
---

Lemma, the framework for combining AI agents and human operators on shared tables and approval flows, has been released under an open‑source license. The initial commit includes a one‑hour tutorial that hooks existing Claude or ChatGPT models to a collaborative spreadsheet‑style UI, and the code was built as an intern’s first project.

## How Lemma works today

The repo ([lemma‑platformhere](https://github.com/lemma-work/lemma-platformhere)) ships a lightweight server that renders a table view in the browser. Each row can be bound to an LLM call, and a human can approve, edit, or reject the output before the next step runs. The design intentionally separates “agent” logic (the LLM prompt) from “human” actions (approval clicks), so teams can prototype mixed‑initiative workflows without writing custom front‑ends.

## Cost and operational impact

Because Lemma is open source, there is no license fee; you only pay for the compute you invoke via Claude, ChatGPT, or another model provider. The example project runs on a single‑core VM and under $0.10 of API usage for a typical test run. For startups that already have an LLM budget, Lemma adds almost no extra cost beyond the hosting needed for the web UI.

## Caveats to keep in mind

The codebase is still early‑stage. Documentation is limited to the example notebook, and the platform currently assumes a synchronous approval loop, which may not fit high‑throughput pipelines. Additionally, the tight coupling to Claude/ChatGPT APIs means you inherit any rate‑limit or pricing changes from those services. Self‑hosting also requires you to manage TLS and authentication yourself, which could increase operational overhead.

## When to try it

If your team already runs LLM‑backed micro‑tasks and needs a quick way to add a human‑in‑the‑loop checkpoint, clone the repo and run the one‑hour tutorial. For larger, production‑grade systems, treat Lemma as a prototype layer and evaluate whether its architecture scales before committing to a full rollout.

---
**What to watch**: upcoming releases that add async task queues and plug‑in support for other model providers, which could address current scalability concerns.