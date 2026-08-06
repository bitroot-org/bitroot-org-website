---
date: '2026-07-15'
excerpt: AIPOCH released Open Science v0.2.0, introducing reusable research Skills,
  slash‑command shortcuts, and the first life‑sciences MCP integrations, all as a
  free open‑source update.
image: https://pbs.twimg.com/media/HNPxKhXa8AANzdU.jpg?name=orig
published_at: '2026-07-15T10:43:46.600426+00:00'
sources:
- https://x.com/aipoch_ai/status/2077269195646185723
tags:
- open science
- ai tools
- research infrastructure
title: AIPOCH Open Science v0.2.0 adds Skills, slash commands, and MCP support
---

AIPOCH released Open Science v0.2.0, adding slash commands for reusable research Skills and the first life‑sciences MCP integrations, plus drag‑and‑drop file uploads. The announcement was posted on X and the code lives in the [Open Science repo](https://github.com/aipoch/open-science).

## New workflow primitives
The release bundles a **Skills Management** system where you can create, edit, import, and share reusable research Skills across projects. Skills can be invoked with a `/` slash command directly in the prompt, letting engineers script common data‑ingestion or analysis steps without writing boilerplate code. This mirrors the “macro” pattern many internal tooling teams already use for CI pipelines.

## Data connectivity improvements
A first‑generation **MCP (Model‑Connector‑Protocol) integration** lands for life‑sciences databases. You can point Open Science at a custom MCP server to pull experimental datasets or reference genomes. The integration is optional and requires you to host or provision an MCP endpoint, which adds operational overhead.

## Practical trade‑offs for startups
All features are open source and free, but the tool does not provide a hosted SaaS layer. Teams must run the service themselves, manage provider credentials, and ensure the MCP server complies with any data‑privacy regulations. The drag‑and‑drop upload UI is convenient, yet large binary files still hit memory limits in the default container setup, potentially causing crashes on low‑resource instances.

## When to give it a spin
If your product team already builds internal research pipelines or needs a lightweight way to expose scientific data to LLM agents, spin up the v0.2.0 container in a dev sandbox and test a single Skill against a mock MCP endpoint. Watch for stability improvements in the next minor release before adopting it in production.