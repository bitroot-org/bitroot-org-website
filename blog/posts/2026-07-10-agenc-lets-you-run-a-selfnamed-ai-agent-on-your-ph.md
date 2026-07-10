---
date: '2026-07-10'
excerpt: 'The AI agent named itself during setup.


  AgenC is an open source agent that runs on your own machine. Works best with Grok.
  15 minutes to a named agent on your phone with a $2/day spending cap.'
image: https://pbs.twimg.com/amplify_video_thumb/2075474641389555712/img/X72suMUUA9HrdbR-.jpg
published_at: '2026-07-10T11:18:31.326429+00:00'
sources:
- https://x.com/tetsuoai/status/2075475435698454546
tags:
- ai agents
- open source
- personal ai
title: AgenC lets you run a self‑named AI agent on your phone for $2/day
video: media/2026-07-10-agenc-lets-you-run-a-selfnamed-ai-agent-on-your-ph.mp4
---

AgenC can spin up a named AI agent on your phone in roughly 15 minutes, and you can cap its usage at $2 per day. The agent self‑identifies during the initial setup, as announced in [tetsuo's tweet](https://x.com/tetsuoai/status/2075475435698454546).

## Quick start and cost model
AgenC runs on your own hardware, avoiding cloud‑only deployments. You install the binary, run the setup wizard, and the agent prompts you to choose a name—making the experience feel personal. The built‑in budget limiter tracks API calls and stops the agent once the $2 daily threshold is hit, helping you avoid surprise bills.

## Best‑fit with Grok
The developers note that AgenC works best when paired with the Grok language model. Grok’s API is inexpensive and fast, which aligns with the low‑budget goal. If you substitute a different model, you may need to adjust the budget settings or expect higher latency.

## Open‑source trade‑offs
Because the code is open source, you can audit it or add custom plugins. However, the project currently lacks a robust plugin ecosystem, so extending functionality may require diving into the codebase yourself. Also, the self‑hosting requirement means you must maintain the runtime environment, which adds operational overhead.

## Caveats and noise
AgenC’s budgeting is coarse‑grained; it counts total API spend, not per‑query cost, which can lead to abrupt cut‑offs mid‑conversation. Additionally, the “named agent” feature is cosmetic—there’s no underlying persona management, so expectations about personalized behavior should be tempered.

**What to watch**: Keep an eye on the upcoming support for alternative LLM backends, which could broaden the agent’s applicability beyond Grok. If you’re already running local inference, try deploying AgenC in a sandboxed VM to evaluate the budget controls before exposing it to production workloads.