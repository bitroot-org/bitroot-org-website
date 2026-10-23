---
date: '2026-10-23'
excerpt: 'Pick hardware and a model, and feel the real speed of a local LLM before you buy. Simulates tokens/sec and time-to-first-token from verified benchmarks for GPUs, Macs, and more.'
image: https://bitroot.org/blog/media/2026-10-17-llmspeed-adds-a-web-simulator-for-local-llm-hardwa.png
published_at: '2026-10-17T12:37:06.247757+00:00'
sources:
- https://llmspeed.dev/
tags:
- 'llm'
- 'performance'
- 'tool'
title: 'llmspeed adds a web simulator for local LLM hardware performance'
---

The new **llmspeed** web app (https://llmspeed.dev/) shows estimated token speeds for a short prompt on a single device, drawing from community benchmarks such as r/LocalLLaMA and localscore.ai. The page lists dozens of hardware profiles—from NVIDIA RTX 4090 24GB to Mac Studio M5 Ultra 512GB—so you can compare projected throughput for models like Llama 3.1 8B or GPT‑OSS 120B.

## Quick overview of the simulator

llmspeed is a JavaScript‑based front‑end that reads pre‑computed benchmark numbers and, for some setups, projects speeds from similar hardware specs. It does not run the model locally; instead it reports an estimate (tokens per second) for a “short prompt” on the selected device. The tool is open‑source, with code and data hosted on GitHub, but the site itself is the only official entry point.

## How the estimates are derived

The numbers come from publicly shared runs on Reddit’s r/LocalLLaMA, localscore.ai, and other community sources. Where direct measurements are missing, the site derives values from comparable configurations or spec‑based projections. This approach gives a ballpark figure rather than a precise measurement, which can be useful for early hardware decisions.

## Getting started

Visit the site, pick a hardware profile from the “Browse by hardware” list, then select a model from the “Browse by model” column. The interface instantly updates the estimated speed. No account, API key, or installation is required—just a modern browser that supports JavaScript.

## Limitations and missing details

The page does not list any pricing information or usage limits, and it does not run any inference locally, so the numbers may differ from real‑world performance under load. The estimates are also tied to community benchmarks, which can vary in methodology. Engineers should treat the figures as a starting point rather than a guarantee.

**When to try it** – If you are evaluating GPU or Apple silicon upgrades for a local LLM deployment, run llmspeed first to gauge relative throughput before ordering hardware. Use the results to narrow down candidates, then validate with a real benchmark on the actual machine.
