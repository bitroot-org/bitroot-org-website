---
date: '2026-04-25'
excerpt: Anthropic's new internal experiment lets its AI assistant Claude buy, sell,
  and negotiate items for employees, revealing both promise and practical concerns
  for startup teams.
image: https://pbs.twimg.com/amplify_video_thumb/2047716403000606720/img/5rq3VoaCzbgqTM4v.jpg
published_at: '2026-04-25T14:55:21.991918+00:00'
sources:
- https://x.com/i/status/2047728360818696302
tags:
- ai marketplace
- internal tooling
- claude
title: Anthropic pilots Claude‑run marketplace for office supplies
video: media/2026-04-25-anthropic-pilots-clauderun-marketplace-for-office.mp4
---

Anthropic announced a sandbox project called **Project Deal** in a recent tweet, where an internal marketplace in its San Francisco office lets employees list items and have Claude handle the purchase, sale, and negotiation on their behalf. The experiment is limited to a single office and uses Claude‑3 as the negotiating agent.

## How the system works
Employees post a request—say, a new ergonomic chair—into a shared channel. Claude parses the request, searches internal vendor listings, proposes a price, and even drafts a counter‑offer if the seller pushes back. The AI then routes the final agreement back to the requester for approval. The entire flow runs on Anthropic’s existing Claude API, so no new infrastructure was required beyond a simple Slack integration.

## Cost and access
The proof‑of‑concept runs on the company’s internal Claude quota, which is billed per token. Because the marketplace is confined to a single office, there is no public pricing or subscription model yet. Startups could replicate the pattern using Claude’s public API, where costs start at $0.75 per 1 M input tokens and $3.00 per 1 M output tokens (as of the latest public pricing). Expect a modest budget for a pilot limited to a few dozen transactions.

## Trade‑offs to consider
The automation reduces manual back‑and‑forth, but it also raises privacy and compliance questions—Claude sees the full text of purchase requests and price negotiations. False positives are possible: the model might misinterpret a request or accept a sub‑optimal price, especially when dealing with non‑standard contracts. Additionally, the system is currently a closed internal experiment, so there’s no guarantee of future support or open‑source tooling.

## When to try it
If your startup already uses Claude for other workflows, spin up a low‑risk pilot: start with a single category of consumables (e.g., office snacks) and set a hard approval step before any transaction is executed. Monitor error rates and cost per transaction before expanding.

**What to watch** – Anthropic may publish a public SDK or case study once the internal trial yields data; keep an eye on their announcements for broader availability.