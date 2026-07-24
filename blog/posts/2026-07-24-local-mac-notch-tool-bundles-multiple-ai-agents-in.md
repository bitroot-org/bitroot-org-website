---
date: '2026-07-24'
excerpt: A new macOS binary lets developers run and control Claude, Codex, Cursor,
  and other AI agents locally, with live token tracking and notification support.
image: https://pbs.twimg.com/amplify_video_thumb/2080531902205935616/img/ORWP_SMnnrTqDhA5.jpg
published_at: '2026-07-24T10:56:36.277152+00:00'
sources:
- https://x.com/mabhi1999/status/2080532002248233208
tags:
- macos
- agent manager
- local tools
title: Local Mac notch tool bundles multiple AI agents in one UI
video: media/2026-07-24-local-mac-notch-tool-bundles-multiple-ai-agents-in.mp4
---

A single macOS binary now lets you manage a roster of AI agents—Claude, Codex, Cursor, Kimi, Grok, OpenCode, Pi, Hermes, and Antigravity—directly from the Mac notch. The tool runs fully locally and includes live token usage, answer permissions, notifications, screenshot capture, and annotation capabilities, as announced in a recent [tweet](https://x.com/mabhi1999/status/2080532002248233208).

## Consolidated control panel
The app aggregates the disparate CLIs and web UIs of each agent into one pane. You can switch contexts with a click, set per‑agent token caps, and toggle whether an answer may be shown to the user. This reduces the overhead of opening separate terminals or browser tabs, which is especially handy during rapid prototyping.

## Feature set at a glance
- **Live token usage**: see consumption in real time, helping you stay within budget.
- **Answer permissions**: whitelist or block responses per agent, useful for safety gating.
- **Notifications**: push alerts when an agent finishes a task or hits a token limit.
- **Screenshot & annotation**: capture the Mac notch view and add notes without leaving the app.

## Caveats to consider
The tool is macOS‑only and relies on local execution, meaning you miss out on any cloud‑side model updates unless you manually pull them. Running multiple large models simultaneously can spike CPU/GPU usage, potentially slowing other development workloads. Because it bundles many agents, the binary size is larger than typical CLI tools, which may be a concern for container‑based CI pipelines.

## When to try it
If your startup’s product relies on rapid experimentation with multiple LLMs and you’re already on macOS, install the binary for a week and measure token tracking accuracy and system load. If the overhead is manageable and the consolidated UI speeds up your iteration cycle, consider integrating it into your daily dev workflow.

**What to watch**: upcoming releases may add Windows support or modular plugin loading, expanding its utility beyond the Mac notch.