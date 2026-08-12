---
date: '2026-07-11'
excerpt: Robbyant released a 30‑billion‑parameter MoE video model that claims 3× faster
  inference and a free demo. It’s the first large‑scale open‑source video generator
  built on a mixture‑of‑experts architecture.
image: https://pbs.twimg.com/amplify_video_thumb/2075815432640925696/img/hoiATJL3GOIGk3ye.jpg
published_at: '2026-07-11T10:09:57.221404+00:00'
sources:
- https://x.com/zaesarius/status/2075815728494563710
tags:
- video generation
- open source
- moe
- ai
title: Robbyant opens LingBot-Video 30B MoE model for open‑source video generation
video: media/2026-07-11-robbyant-opens-lingbot-video-30b-moe-model-for-ope.mp4
---

The Robbyant team announced the release of **LingBot-Video** on July 9, publishing the model under the Apache 2.0 license and providing a free demo [link](https://studio.aifilms.ai/blog/lingbot-video-moe-open-source-video-generation). The flagship variant packs 30 B total parameters but only activates 3 B experts per forward pass, a design that the authors say yields roughly three‑times faster inference compared with dense equivalents.

## What the model delivers
LingBot‑Video is built on a mixture‑of‑experts (MoE) backbone, routing each token to a subset of specialized expert networks. In benchmark tests on RBench it scored **0.620**, outpacing closed‑source competitors like Wan 2.6 (0.607) and Seedance 1.5 Pro (0.584). For quadruped motion synthesis it topped the chart with a 0.758 rating. The model was trained on over 70 000 hours of robotics footage, covering manipulation, navigation, and egocentric views, and incorporates a reward system that balances physical plausibility, task completion, aesthetics, and prompt adherence.

## Two deployment options
* **Dense 1.3 B** – fits on consumer‑grade GPUs and is intended for quick prototyping.
* **MoE 30 B‑A3 B** – the full expert‑sparse model paired with a Refiner step that outputs 480 px video for higher visual quality.
Both variants are available via the same repository, and the team provides a hosted demo for quick testing.

## Caveats and cost considerations
While the MoE design reduces active parameters per inference, the total model size still requires substantial VRAM for the full 30 B variant (multiple A100‑class GPUs are recommended). The “~3× faster” claim holds when the routing overhead is amortized; on lower‑end hardware you may see little speed gain and higher memory pressure. Additionally, the open‑source license removes vendor lock‑in but leaves you responsible for maintenance, scaling, and any downstream bugs.

## When to try it
If your startup is already experimenting with video generation and has access to mid‑range GPU clusters, spin up the 1.3 B dense model for proof‑of‑concept work. Reserve the 30 B MoE version for workloads where inference speed and quality justify the extra hardware cost. Keep an eye on community forks for potential optimizations and early‑stage tooling.

**Sources**: [tweet announcement](https://x.com/zaesarius/status/2075815728494563710), [blog post with demo details](https://studio.aifilms.ai/blog/lingbot-video-moe-open-source-video-generation)