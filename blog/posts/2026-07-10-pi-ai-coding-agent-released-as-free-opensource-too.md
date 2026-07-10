---
date: '2026-07-10'
excerpt: Pi arrives on GitHub with four built‑in utilities, a 1,000‑token system prompt,
  and full visibility into every model call.
image: https://pbs.twimg.com/media/HMzEwTybkAARGnk.jpg?name=orig
published_at: '2026-07-10T11:44:39.729867+00:00'
sources:
- https://x.com/fusionaivisuals/status/2075250024519438457
tags:
- ai coding
- open-source
- tool
title: Pi AI coding agent released as free open‑source tool
---

Pi, an open‑source AI coding agent, launched on GitHub with four built‑in tools and a system prompt limited to 1,000 tokens. The project is MIT‑licensed and uses the same engine that powers OpenClaw, as announced in a [tweet](https://x.com/fusionaivisuals/status/2075250024519438457).

## Core capabilities
Pi focuses on a minimal set of features: code generation, refactoring, test scaffolding, and documentation assistance. Each operation is driven by a separate tool, keeping the agent’s surface area small. Because the system prompt stays under 1,000 tokens, the model’s context window is largely dedicated to user code, reducing the chance of prompt‑related token limits.

## Design trade‑offs
The deliberately narrow prompt means Pi can’t hold large project histories in memory, which may require more frequent context refreshes for big codebases. Transparency is a core promise – every model call is logged and visible to the user – but this also adds overhead, potentially slowing down interactive workflows. The lack of a hosted backend means teams must provision their own compute, typically an API key for a compatible LLM provider.

## Cost and onboarding
Pi is free to download from its [GitHub repo](http://github.com/earendil-works/pi). There are no licensing fees, but users bear the cost of the underlying LLM API (e.g., OpenAI, Anthropic) and any infrastructure needed to run the agent locally. Installation is a single `pip install pi-agent` step, followed by configuration of an API key. The documentation is concise but assumes familiarity with command‑line tools.

## When to try Pi
Start with Pi if you need an auditable, self‑hosted assistant for short‑term coding tasks and you already have an LLM budget. It’s less suited for large monorepos or teams that rely on a seamless, zero‑setup UI. Watch for upcoming releases that may expand the system prompt limit or bundle additional tools, which could broaden its applicability.