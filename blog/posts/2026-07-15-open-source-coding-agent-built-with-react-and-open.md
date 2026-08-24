---
date: '2026-07-15'
excerpt: A developer released a self‑hosted coding agent that runs in a React + OpenTUI
  terminal, uses OpenRouter for streaming LLM calls, and includes a token context
  manager.
image: https://pbs.twimg.com/amplify_video_thumb/2077269919486693376/img/ENB_RQbFAAPF5igH.jpg
published_at: '2026-07-15T10:43:03.871952+00:00'
sources:
- https://x.com/rizwanc_r/status/2077269947861135803
tags:
- coding agents
- open-source
- llm tools
title: Open-source coding agent built with React and OpenRouter
video: media/2026-07-15-open-source-coding-agent-built-with-react-and-open.mp4
---

Rizwan announced a self‑built coding agent that avoids proprietary model APIs and runs entirely on public components. The prototype ships a React‑based OpenTUI terminal, streams responses via OpenRouter with built‑in retries, and manages token context for longer sessions.

## Core components and behavior
The agent stitches together four pieces: a React UI with an OpenTUI terminal front‑end, OpenRouter streaming for LLM calls, an event‑driven agent loop, and a token context manager that trims prompts to stay within model limits. The result is a responsive coding assistant that can accept user input, generate code snippets, and iterate without leaving the browser.

## Cost and accessibility
All dependencies are free tier or open source. OpenRouter offers a pay‑as‑you‑go pricing model, but the prototype can be run against the free tier for low‑volume experimentation. There is no licensing fee for the agent itself, making it attractive for startups that prefer to avoid SaaS contracts.

## Limitations to consider
The project is a side‑project prototype; it lacks a mature tool integration layer (e.g., automatic file edits) and may produce noisy or inaccurate suggestions. The token context manager is simple and can truncate important context under heavy usage, leading to false‑positive completions. Teams should treat it as a research‑grade aid rather than a production‑ready assistant.

## When to try it
Start with a sandbox repo and run the React UI locally to evaluate latency and suggestion quality. If the agent’s streaming performance meets the team's workflow speed, consider extending the tool stack with custom file‑edit handlers. Watch for updates from Rizwan on GitHub or X for a more polished release.

---
**Source:** [Rizwan's X post](https://x.com/rizwanc_r/status/2077269947861135803)