---
date: '2026-10-06'
excerpt: Era spins up a full company to your spec - emulated systems, simulated data,
  real behavior - on our cloud, keys in your hand.
image: /eon-logo.png
published_at: '2026-10-06T15:35:43.660812+00:00'
sources:
- https://console.era.eon.io/
tags:
- simulated data
- ai testing
- devops
title: Era launches synthetic company environments for AI agent testing
---

Era announced a console that can generate an entire synthetic enterprise with a single CLI command. For example, running `era new --industry fintech --size mid --systems salesforce,zendesk,slack` creates a mid‑size fintech company populated with realistic deal sizes, headcounts, and ticket volumes (up to 12,000 tickets per tenant)【https://console.era.eon.io/】.

## Building a synthetic company
The platform fabricates a coherent identity that appears across Slack, Jira, Zendesk, and Salesforce, so every system references the same employee record. Data distributions follow real‑world shapes—deal size follows a log‑normal median of $17k, customer headcount median 180—rather than uniform random noise. Deliberate “mess” such as duplicate rows and junk entries are injected and listed in a manifest, enabling agents to handle realistic data‑quality issues.

## What the generated estate contains
A top‑tier tenant includes roughly:
- 18,766 contacts
- 15,801 files (including 12,050 rendered documents)
- 13,758 call recordings (6,086 hours total)
- 12,000 tickets and 12,000 issues
- 4,354 incident‑chat messages from 1,752 distinct authors
All of these assets are exposed via live vendor‑native APIs and a unified MCP endpoint, so reads and writes are reflected instantly across systems.

## Using the live stack in CI
Era publishes Docker images for each emulated system (e.g., `erabyeon/slack:latest`). Teams can spin up the full estate in a CI job with `docker run --rm -p 8115:8080 erabyeon/slack:latest`. Because the services run continuously, an AI agent can issue a REST call like `GET /api/v2/tickets/4182.json` to Zendesk and see the same state a subsequent MCP write would produce.

## Cautions and missing details
The environment is entirely synthetic; it should not replace a staging system that contains production data. Pricing and usage limits are not listed on the public console page, so teams will need to contact Eon for cost information before committing.

## When to try Era
If you need a realistic, end‑to‑end test bed for AI agents that interact with multiple SaaS APIs, spin up a small tenant (e.g., a “mid” fintech company) in a sandbox CI pipeline and evaluate agent behavior before moving to real services.