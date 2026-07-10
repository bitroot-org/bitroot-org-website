---
date: '2026-06-23'
excerpt: Claude Tag lets teams call Claude directly from Slack by tagging the bot,
  turning it into a collaborative teammate. It’s a modest addition that may streamline
  routine requests but carries privacy and noise considerations.
image: https://pbs.twimg.com/media/HLg9iF5XYAAhaS7.jpg
published_at: '2026-06-23T17:40:20.297751+00:00'
sources:
- https://x.com/i/status/2069468693017268244
tags:
- anthropic
- slack integration
- ai assistant
title: Anthropic adds Claude Tag for Slack task delegation
video: media/2026-06-23-anthropic-adds-claude-tag-for-slack-task-delegatio.mp4
---

Anthropic announced **Claude Tag**, a new Slack integration that lets teams add Claude as a regular member of a workspace and invoke it by tagging @Claude in a channel. The bot can read the conversation context you allow and respond to delegated tasks while you focus elsewhere.

## How Claude Tag works in practice
Claude joins the selected Slack channels as a standard member, respecting the permissions you grant. When you type `@Claude` followed by a request—such as summarizing a thread, generating a draft, or pulling data from linked tools—Claude processes the prompt and posts a reply in the same channel. The integration is configured through a simple OAuth flow and leverages the existing Claude API, so no new credentials are required beyond your Anthropic subscription.

## Impact on daily workflows
For startups that already use Slack as a coordination hub, tagging an AI can reduce context‑switching. A developer can ask Claude to draft a release note while reviewing code, or a product manager can request a quick market snapshot without opening a separate UI. Because Claude stays in the channel, the output is instantly visible to the whole team, improving transparency.

## Caveats and trade‑offs
The feature currently lacks granular audit logs, so it can be hard to trace which user triggered a specific request. Teams handling sensitive data should review channel permissions carefully, as Claude will inherit any access you grant. Additionally, early users report occasional irrelevant suggestions, which can add noise if the bot is added to high‑traffic channels. Pricing has not changed; Claude Tag is bundled with existing Anthropic plans, but heavy usage may push you into a higher tier.

## When to try it
If you already have an Anthropic subscription and use Slack for most internal communication, enable Claude Tag on a low‑traffic pilot channel to assess signal‑to‑noise ratio. Monitor usage and adjust permissions before rolling out to broader teams. For more details see the announcement on [Claude’s X post](https://x.com/i/status/2069468693017268244).