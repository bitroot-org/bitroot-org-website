---
date: '2026-05-02'
excerpt: Claude Code now includes a built‑in skill that can manage model migrations,
  use prompt caching, and interact with Claude Managed Agents directly from the CLI.
image: https://pbs.twimg.com/amplify_video_thumb/2049574832241864704/img/zb_ZHb-8NXRzl5vp.jpg
published_at: '2026-05-02T04:55:33.698583+00:00'
sources:
- https://x.com/i/status/2049575802568839648
tags:
- claude
- ai tooling
- devops
title: Claude Code adds built‑in skill for Claude Platform tasks
video: media/2026-05-02-claude-code-adds-builtin-skill-for-claude-platform.mp4
---

Claude Code ships with a built‑in skill for working with the Claude Platform, letting you trigger model migrations or enable prompt caching with a single CLI command — the announcement was made in a [ClaudeDevs tweet](https://x.com/i/status/2049575802568839648).

## Direct access to Claude APIs
The skill wraps the Claude Platform’s REST endpoints, exposing shortcuts like `claude code migrate <model>` and `claude code cache enable`. This eliminates the need to write custom HTTP calls or manage authentication tokens manually. For teams already using Claude’s managed agents, the same command line can spin up or query agents without leaving the terminal.

## Immediate use cases
* **Model migrations** – Move from a legacy Claude model to a newer version in bulk, preserving prompt templates.
* **Prompt caching** – Turn on caching for high‑throughput workloads, reducing latency and cost.
* **Agent onboarding** – Deploy Claude Managed Agents from the CLI, useful for rapid prototyping.

These actions can be scripted, fitting into CI pipelines that already run Claude Code for code generation.

## Caveats to consider
The skill is still early in its lifecycle; error messages are terse and false‑positive warnings may appear when the platform API changes. It also ties your build process to Claude’s API versioning, so a breaking change could require a quick update to your scripts. Finally, the feature is only available in the latest Claude Code release, so older installations will need to upgrade.

## When to try it
If your startup already relies on Claude for code assistance or agent workflows, enable the skill on a staging branch and run a small migration test. Monitor latency and cost metrics for the caching flag before rolling it out to production. Keep an eye on the official Claude announcements for any upcoming breaking changes.

**What to watch** – Future releases may expand the skill to cover new Claude Managed Agent capabilities and add richer error reporting.