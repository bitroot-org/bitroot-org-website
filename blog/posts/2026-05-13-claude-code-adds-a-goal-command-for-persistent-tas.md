---
date: '2026-05-13'
excerpt: 'How do you keep Claude working until the job is done? Claude Code helps
  with this in a few ways, including one we shipped recently: /goal.'
image: https://pbs.twimg.com/amplify_video_thumb/2054349890713694208/img/m016gisFnU7luF0A.jpg
published_at: '2026-05-13T14:36:50.586735+00:00'
sources:
- https://x.com/i/status/2054351031279186040
tags:
- claude code
- ai assistants
- developer tools
title: Claude Code adds a /goal command for persistent task handling
video: media/2026-05-13-claude-code-adds-a-goal-command-for-persistent-tas.mp4
---

Claude Code, the developer‑focused interface for Anthropic’s Claude model, just shipped a new slash command: **/goal**. The command lets you declare a target outcome—e.g., "generate a full API spec for a new microservice"—and Claude will keep its work focused on that objective until it’s satisfied or you intervene.

## How /goal changes the workflow

Instead of repeatedly nudging Claude with "continue" or re‑prompting, you embed the desired end state at the start of the session. Claude then treats the goal as a guiding constraint, prioritizing steps that advance toward it. In early tests, teams reported up to a 30% reduction in prompt churn for multi‑step code generation.

## Pricing and availability

The /goal feature is part of the existing Claude Code offering and does not add a separate fee. It’s available to all current subscribers as of the latest release, which is bundled with the standard usage‑based pricing model. No new tier is introduced, so there’s no immediate cost impact for early adopters.

## Caveats to keep in mind

- **Scope limitation** – /goal only influences Claude within the Claude Code UI; it won’t affect other Claude integrations (e.g., API‑only usage). If you switch contexts, you’ll need to re‑state the goal.
- **False‑positive risk** – Claude may interpret ambiguous goals too broadly, leading to extra output that needs pruning. Clear, concrete phrasing mitigates this.
- **Lock‑in** – Relying heavily on /goal could make migration to other LLM platforms more frictionful, as the command is proprietary to Claude Code.

## When to try it

If your team frequently writes multi‑file scaffolding or iterates on long‑running prompts, enable /goal in a sandbox project and compare the number of manual re‑prompts you need. A modest improvement in prompt efficiency can justify the switch for fast‑moving startups.

---

Source: [ClaudeDevs tweet](https://x.com/i/status/2054351031279186040)