---
date: '2026-07-17'
excerpt: Craig Ruks released Shep, an open‑source orchestrator that watches for GitHub
  issues tagged “shep” and hands them off to AI agents. It’s a lightweight way to
  prototype custom issue‑driven bots.
image: https://pbs.twimg.com/tweet_video_thumb/HNZin8RbMAA1gYV.jpg
published_at: '2026-07-17T10:39:02.547748+00:00'
sources:
- https://x.com/craigruks/status/2077957220759978436
tags:
- agent orchestrator
- github issues
- open source
title: Open‑source “Shep” agent orchestrator targets GitHub issues labeled “shep”
video: media/2026-07-17-opensource-shep-agent-orchestrator-targets-github.mp4
---

Craig Ruks announced that his "Shep" agent orchestrator is now open source after a May internal rollout. The tool watches GitHub repositories for issues labeled `shep` and forwards them to a configurable agent pipeline, letting teams experiment with automated triage or custom workflows without building a full bot from scratch. The announcement came via a [tweet](https://x.com/craigruks/status/2077957220759978436) that also included a playful dog emoji.

## How Shep works
Shep polls the GitHub Issues API for the `shep` label, then invokes a user‑supplied command or script with the issue payload. Because the orchestration layer is thin, you can plug in anything from a simple shell script to a large language model service. The project ships with a minimal Dockerfile and a sample Python agent that replies with a canned comment, illustrating the end‑to‑end flow.

## When to consider it
Startups that already have a few GitHub‑based automation scripts may find Shep useful as a glue layer. It removes the need to embed polling logic in each script and provides a single point for logging and error handling. If you’re already using GitHub Actions, you can run Shep as a self‑hosted runner, keeping the architecture inside your existing CI budget.

## Caveats and limits
Shep only reacts to the `shep` label, so you’ll need to adopt that convention across repos, which can add friction. The orchestrator does not include built‑in deduplication; rapid issue churn can generate duplicate agent runs unless you add your own guardrails. Also, because it’s a new open‑source project, community support is limited, and you’ll be responsible for security hardening of any downstream agents you attach.

## What to watch
If you have a handful of internal bots that already read GitHub issues, try pointing them at a sandbox repo with the `shep` label this week. Monitor the volume of agent invocations and the noise level in issue comments; a high false‑positive rate may indicate you need tighter labeling or smarter filtering before scaling.