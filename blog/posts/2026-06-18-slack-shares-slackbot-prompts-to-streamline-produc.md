---
date: '2026-06-18'
excerpt: Slack posted a short video demonstrating ready‑made Slackbot prompts that
  pull tagged feedback into a channel, helping teams focus on the most important requests.
image: https://pbs.twimg.com/media/HLCT-GFW0AAUqRl.jpg
published_at: '2026-06-18T18:15:11.236735+00:00'
sources:
- https://x.com/i/status/2067314945151144206
tags:
- slackbot
- product feedback
- tooling
title: Slack shares Slackbot prompts to streamline product feedback
video: media/2026-06-18-slack-shares-slackbot-prompts-to-streamline-produc.mp4
---

Slack announced a short video that walks through three ready‑made Slackbot prompts designed to surface and rank product feedback. The demo, linked in the tweet, shows how a simple `/slackbot` command can collect messages tagged with `#feedback` into a dedicated channel for quick triage.

## The prompts in practice
The video highlights prompts that:
- Pull any message with a specific hashtag into a #product‑feedback channel.
- Summarize recent requests and rank them by reaction count.
- Notify a product manager when a request hits a configurable threshold.
All of these are built on existing Slackbot capabilities; no new code is required. The walkthrough is available via the [Slackbot documentation](https://sforce.co/4ekoNdm) linked in the post.

## Why it matters for startup engineers
For small teams that already live in Slack, these prompts turn ad‑hoc user comments into a semi‑structured backlog without adding a separate ticketing system. The approach leverages native search and reaction metrics, keeping the workflow inside the chat tool that engineers already use daily.

## Caveats and trade‑offs
- **Noise vs. signal**: Relying on hashtags means that untagged feedback is missed, and reaction counts can be gamed or biased toward louder voices.
- **Scalability**: The prompts work well for dozens of requests but may become unwieldy for hundreds, requiring a more robust triage pipeline.
- **Lock‑in**: The solution is tightly coupled to Slack’s bot framework; migrating the backlog to another platform would need manual export.
- **Cost**: The functionality is available on any paid Slack plan that supports Slackbot customizations, but the free tier may limit the number of custom commands.

## When to try it
If your team already uses Slack for day‑to‑day communication and struggles to collect feature ideas, enable the showcased prompts in a test channel and measure how many actionable items surface over a two‑week sprint. Adjust the hashtag or threshold rules before scaling to a broader audience.

*Source: [Slack's X post](https://x.com/i/status/2067314945151144206)*