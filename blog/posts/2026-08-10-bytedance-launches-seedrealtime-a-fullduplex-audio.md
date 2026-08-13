---
date: '2026-08-10'
excerpt: ByteDance's Seed team released SeedRealtime, an end‑to‑end model that fuses
  audio, video and text, but it currently lacks a public API or open weights.
image: https://bitroot.org/blog/media/2026-08-10-bytedance-launches-seedrealtime-a-fullduplex-audio.png
published_at: '2026-08-10T19:19:32.491982+00:00'
sources:
- https://www.marktechpost.com/2026/08/09/bytedance-seed-introduces-seedrealtime-a-native-audio-visual-full-duplex-llm-that-watches-listens-and-speaks-in-one-model/
tags:
- audio-visual ai
- llm
- real-time interaction
title: ByteDance launches SeedRealtime, a full‑duplex audio‑visual LLM
---

ByteDance's Seed team rolled out SeedRealtime, a native audio‑visual full‑duplex LLM that runs perception, understanding, decision‑making and expression in a single end‑to‑end model. The model is already powering the Doubao consumer assistant, but ByteDance has not released weights, a parameter count, or an API. [source](https://www.marktechpost.com/2026/08/09/bytedance-seed-introduces-seedrealtime-a-native-audio-visual-full-duplex-llm-that-watches-listens-and-speaks-in-one-model/)

## How the architecture differs

SeedRealtime fuses audio, video and text inside one transformer‑style backbone, eliminating the cascade of separate ASR, vision‑language, and TTS modules that typically add latency and information loss. Turn‑taking is handled internally, so the model does not rely on an external voice‑activity detector.

## Demo scenarios that illustrate the claim

The launch video shows seven use cases; four are highlighted as load‑bearing. In a noisy dinner, the model binds spoken names to faces and keeps each voice linked to its identity. In a museum, it watches the camera feed and volunteers a reminder when a target exhibit appears, without being asked. It can also interrupt a coffee‑making workflow to comment on crema color, and it ignores off‑topic chatter while still recalling information that scrolled off‑screen at an airport.

## Integration reality for startups

Despite the impressive demos, the service is not currently consumable by third‑party teams. ByteDance has published no technical report, no parameter count, and no public endpoint on Volcano Engine or BytePlus. The only tangible deliverable is a reference architecture that can guide engineers building their own real‑time multimodal stacks. This means you would need to recreate the model yourself or wait for an open‑source release, which adds engineering overhead.

## When to try it

If your product already streams audio and video and you need sub‑second, turn‑taking interaction—e.g., a virtual receptionist that can see and hear simultaneously—experiment with the reference design as a prototype before committing to a full rebuild. Keep an eye on ByteDance’s future announcements for a public API or weight release.