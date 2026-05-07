---
date: '2026-05-07'
excerpt: 'Live from Code with Claude: we''re launching dreaming in Claude Managed
  Agents as a research preview.


  Outcomes, multiagent orchestration, and webhooks are now in public beta.'
image: https://pbs.twimg.com/media/HHpoqNAXcAcHY8h.jpg
published_at: '2026-05-07T02:15:45.629079+00:00'
sources:
- https://x.com/i/status/2052067399088664981
tags:
- ai agents
- orchestration
- beta
title: Claude Managed Agents launches dreaming mode and beta orchestration
video: media/2026-05-07-claude-managed-agents-launches-dreaming-mode-and-b.mp4
---

Claude announced a research preview of "dreaming" in its Managed Agents platform, and simultaneously opened Outcomes, multi‑agent orchestration, and webhook support to public beta. The dreaming mode lets an agent generate a high‑level plan before executing concrete steps, aiming to reduce prompt churn.

## What the new features do
The dreaming capability is a pre‑execution phase where the agent drafts a roadmap based on a user’s goal, then iterates on sub‑tasks. Orchestration expands the platform to coordinate several agents, each handling a slice of the workflow. Webhooks provide a simple HTTP callback mechanism so external services can react to agent events in real time. Together these tools let a startup spin up a prototype of, say, an order‑to‑fulfillment pipeline with minimal glue code.

## Cost and access
Claude’s Managed Agents remain a pay‑as‑you‑go service, billed per token processed. The preview does not introduce a new pricing tier, but the added orchestration calls can increase token consumption because each agent round‑trips through the API. Early adopters should monitor usage dashboards to avoid surprise bills. The public beta is open without a signup barrier, but the dreaming feature is flagged as research‑preview, meaning it may be throttled or temporarily disabled.

## Caveats to consider
Because the offering is still experimental, stability is not guaranteed. Orchestration can produce noisy logs, making debugging harder, and the webhook payload format is subject to change. Teams that need strict SLAs should treat this as a sandbox rather than production‑grade infrastructure. Additionally, the dreaming phase adds latency; a simple task that previously took one API call may now require two, impacting response times.

## When to try it
If your startup is already using Claude’s API and wants to experiment with autonomous pipelines, spin up a small proof‑of‑concept using the public beta. Keep the scope limited to non‑critical paths and set strict usage alerts. Watch the official [Claude tweet](https://x.com/i/status/2052067399088664981) for any updates on stability or pricing before committing long‑term.