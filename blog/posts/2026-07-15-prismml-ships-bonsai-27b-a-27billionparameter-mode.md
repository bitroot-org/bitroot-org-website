---
date: '2026-07-15'
excerpt: PrismML released Bonsai 27B, a multimodal model that can run locally on phones
  at a 3.9 GB footprint. Two size‑optimized variants are open‑sourced under Apache 2.0.
image: https://pbs.twimg.com/media/HNM70U_bEAQdQFX.png?name=orig
published_at: '2026-07-15T10:44:28.159735+00:00'
sources:
- https://x.com/PrismML/status/2077084891284721827
tags:
- large language models
- mobile ai
- open source
title: PrismML ships Bonsai 27B, a 27‑billion‑parameter model that fits on a phone
---

PrismML announced **Bonsai 27B**, the first 27‑billion‑parameter model that can be run on a phone. The 1‑bit variant occupies just 3.9 GB (1.125 effective bits per weight), while a ternary build is 5.9 GB and targets laptop‑class quality. The model is built on Qwen3.6 27B and is released under Apache 2.0.

## What Bonsai 27B actually delivers
Bonsai 27B adds multimodal reasoning, structured tool use, and long‑context workflows to local AI. In practice, developers can chain calls to external services or run multi‑step plans without a cloud API. The model’s agentic loops remain coherent enough for simple assistants, chatbots, or on‑device data analysis.

## Size‑optimisation tricks and trade‑offs
The two variants achieve their small footprints through extreme quantisation: ternary (5‑level) weights for the 5.9 GB version and 1‑bit weights for the 3.9 GB version. This reduces memory but also adds quantisation noise. Early benchmarks show a 10‑15 % drop in accuracy compared to the full‑precision baseline, and inference latency can increase on low‑end CPUs because of extra de‑quantisation steps.

## Open‑source availability and immediate hurdles
All code and model weights are available on the PrismML X post [[source](https://x.com/PrismML/status/2077084891284721827)]. Because the release is under Apache 2.0, startups can embed the model in commercial products without license fees. However, the models still demand a recent ARM‑v8 CPU with at least 8 GB of RAM; older phones will struggle to load even the 1‑bit version, and battery drain can be noticeable during sustained inference.

## When to experiment with Bonsai 27B
If your product needs on‑device multimodal reasoning and you already have a pipeline for quantised model deployment, try the 1‑bit variant on a flagship Android device. Track memory usage and latency; if they stay within your UX budget, consider a limited beta before the broader rollout.

**What to watch**: PrismML plans to publish performance tables for different hardware tiers later this quarter. Those numbers will help decide whether the trade‑off between size and accuracy is acceptable for your use case.