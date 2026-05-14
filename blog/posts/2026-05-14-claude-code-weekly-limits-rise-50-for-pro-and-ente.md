---
date: '2026-05-14'
excerpt: 'Claude Code weekly limits are increasing 50%, now through July 13.


  Live now for all Pro, Max, Team, and seat-based Enterprise users.'
image: https://pbs.twimg.com/media/HIOLKb7bsAAXtoD.jpg?name=orig
published_at: '2026-05-14T02:00:25.873763+00:00'
sources:
- https://x.com/i/status/2054639777685934564
tags:
- anthropic
- claude code
- usage limits
title: Claude Code weekly limits rise 50% for Pro and Enterprise users
---

Anthropic announced that the weekly usage caps for Claude Code are being raised by 50%, effective now and lasting through July 13. The change is live for all Pro, Max, Team, and seat‑based Enterprise customers [ClaudeDevs tweet](https://x.com/i/status/2054639777685934564).

## Bigger caps, same price

The bump lifts the default weekly token allowance from X to 1.5 × X (exact numbers aren’t disclosed). For teams that hit the old ceiling during heavy CI runs, the extra headroom can reduce throttling without any price change. Existing subscriptions stay on their current plan; there’s no new tier to purchase.

## Cost side‑effects

Because the limit increase is free, the immediate cost impact is nil. However, the higher ceiling can encourage more API calls, which may push usage into over‑age fees if you exceed the plan’s inclusive quota. Startups should monitor daily token consumption to avoid surprise charges, especially on seat‑based Enterprise contracts where over‑age rates are higher.

## Caveats to keep in mind

The raise is time‑boxed to July 13 and may be rolled back or replaced with a different tier structure later. It also only applies to Claude Code, not the broader Claude models, so workloads that rely on other endpoints won’t benefit. Finally, the 50 % bump may still be insufficient for very large codebases or nightly full‑repo scans, so you might still hit limits.

## When to give it a spin

If you’re already on a Pro or Team plan and have experienced throttling during CI, enable the new caps and watch your build times. For smaller teams still on the free tier, the upgrade may be a signal that a paid plan is worth the investment.

Sources: [ClaudeDevs tweet](https://x.com/i/status/2054639777685934564)