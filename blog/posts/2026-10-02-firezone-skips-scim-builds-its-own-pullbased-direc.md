---
date: '2026-10-02'
excerpt: Why we avoided using SCIM for our directory sync engine.
image: https://bitroot.org/blog/media/2026-10-02-firezone-skips-scim-builds-its-own-pullbased-direc.png
published_at: '2026-10-02T15:13:28.621263+00:00'
sources:
- https://www.firezone.dev/blog/building-reliable-directory-sync
tags:
- directory sync
- scim
- pull based
title: Firezone skips SCIM, builds its own pull‑based directory sync
---

Firezone announced that its new directory sync engine walks each identity provider’s API on a schedule, using a checkpointed full sync that tags each row with a start‑time epoch. The approach replaces the SCIM push model and lets the service stay in control of timing and error handling.

## Why SCIM didn’t fit
SCIM promises a single HTTP API for all providers, but in practice each provider implements the spec differently. Okta bundles additions and removals in one PATCH, Entra forces one removal per PATCH, and data types (e.g., `active` as a string vs. boolean) vary. Provider‑specific shims are still required, and the service must stay alive to accept pushes, otherwise updates are missed. Firezone concluded that the complexity and brittleness of handling these divergences outweighed the theoretical simplicity of a single endpoint.

## Pull‑based engine design
The engine authenticates to each provider, then:
1. Lists all groups.
2. Lists each group’s members.
3. Retrieves full user records for those members.
The process repeats every *N* minutes. Because the API shape is consistent (list calls), most logic can be shared across providers. The sync flattens nested groups into a single membership table, turning recursive look‑ups into constant‑time queries.

## Handling larger directories
For big organizations the walk can take minutes or even an hour. Firezone mitigates this by:
- Starting each run with a timestamp epoch.
- Writing each page of results with that timestamp.
- Deleting any rows older than the epoch after the run finishes.
This checkpointing prevents half‑completed runs from corrupting data. The design also respects rate limits, retries transient errors (e.g., `503`), and distinguishes permanent failures like revoked credentials.

## Caveats and what to watch
The blog post does not list any pricing or usage limits for the sync service, so cost implications are unclear. It also notes that the system is eventually consistent: updates may be delayed up to the sync interval, which can temporarily leave new hires unable to sign in or, worse, let departed employees retain access.

**When to try it** – If your startup already pulls user data from a handful of providers and can tolerate a few‑minute lag, the pull‑based engine offers a simpler, more resilient alternative to SCIM. Watch for the next release notes on rate‑limit handling and consider benchmarking your own directory size against the checkpointed sync performance described in the [Firezone blog post](https://www.firezone.dev/blog/building-reliable-directory-sync).