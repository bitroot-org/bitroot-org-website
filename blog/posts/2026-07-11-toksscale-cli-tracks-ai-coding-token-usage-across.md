---
date: '2026-07-11'
excerpt: toksScale is a Rust‑based command‑line tool that visualizes token consumption
  for multiple AI coding agents, giving developers a quick view of costs and usage
  patterns.
image: https://pbs.twimg.com/media/HM646SnWsAApxqP.png?name=orig
published_at: '2026-07-11T10:09:28.412541+00:00'
sources:
- https://x.com/N0V4Dev/status/2075799797051621588
tags:
- cli
- token usage
- ai coding
title: toksScale CLI tracks AI coding token usage across agents
---

Junhoyeo just released toksScale, a high‑performance CLI written in Rust that can monitor token usage across Claude Code, Cursor, Gemini and other AI coding agents. The initial version ships with a native TUI and supports Windows, macOS and Linux. The release was announced on [X](https://x.com/N0V4Dev/status/2075799797051621588).

## Visual dashboards
The tool renders 2D and 3D contribution graphs directly in the terminal, letting you spot spikes in token spend at a glance. A global leaderboard is also included, so you can compare your consumption with other users who opt‑in.

## Integration points
toksScale reads usage data from the APIs of supported agents; you configure API keys in a simple TOML file. Because it runs locally, there is no extra network hop beyond the agent calls themselves. This keeps latency low and avoids additional cloud costs.

## Limitations to consider
Token counts are only as accurate as the underlying agents expose them, so mismatches can appear especially with experimental features. The leaderboard requires sending anonymized usage stats to a public endpoint, which may raise privacy concerns for some teams. Finally, the tool currently supports a fixed list of agents; adding a new service means a code change.

## When to try it
If your startup is already using multiple AI coding assistants and wants a cheap way to audit token spend before it inflates your cloud bill, install the binary from the [GitHub release](https://github.com/junhoyeo/tokscale) and run `tokscale monitor`. Keep an eye on the project's issue tracker for added agent support.