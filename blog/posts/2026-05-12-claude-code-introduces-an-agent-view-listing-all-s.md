---
date: '2026-05-12'
excerpt: 'New in Claude Code: agent view.


  One list of all your sessions, available today as a research preview.'
image: https://pbs.twimg.com/media/HIEVJQ4XoAAXNNi.jpg
published_at: '2026-05-12T02:26:44.450818+00:00'
sources:
- https://x.com/i/status/2053940934736228454
tags:
- ai coding assistant
- session management
- preview feature
title: Claude Code introduces an agent view listing all sessions
video: media/2026-05-12-claude-code-introduces-an-agent-view-listing-all-s.mp4
---

Anthropic released an agent view in Claude Code, a research preview that shows a single list of all your coding sessions as of today — the feature was announced in a tweet [Claude's announcement](https://x.com/i/status/2053940934736228454).

## A quick look at the agent view
The new UI pane collapses every active or historic session into one scrollable list. Clicking an entry restores the full context, letting you jump back into a prior debugging or refactoring thread without searching manually. For teams that spin up dozens of short-lived Claude Code instances, this reduces friction in tracking work.

## How it fits into existing workflows
Claude Code already integrates with VS Code and the web editor; the agent view simply adds a navigation layer. It’s a client‑side feature, so there’s no extra server load beyond the standard Claude API calls. The preview is gated, meaning you must opt‑in via the Claude dashboard, but no additional subscription tier is announced yet.

## Caveats to keep in mind
Because the list is generated locally, it can miss sessions that were started on a different machine or in a private workspace. The preview also flags every session as “active”, which may lead to noise if you have many quick experiments. Finally, the feature is currently in research preview, so API stability and pricing could change before general availability.

## When to try it
If you already use Claude Code for daily coding assistance and find yourself juggling multiple tabs, enable the agent view to consolidate your history. Watch for the upcoming stable release notes before adopting it in CI‑related automation, as the preview may still have edge‑case bugs.