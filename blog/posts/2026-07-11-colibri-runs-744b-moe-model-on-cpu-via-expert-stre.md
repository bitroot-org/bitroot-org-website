---
date: '2026-07-11'
excerpt: Colibri streams expert weights from NVMe to run the 744‑billion‑parameter
  GLM‑5.2 MoE model on a consumer‑grade CPU, offering a free alternative to GPU clusters.
image: https://pbs.twimg.com/media/HM6zQ46b0AAx1bG.jpg?name=orig
published_at: '2026-07-11T10:10:16.299387+00:00'
sources:
- https://x.com/techwith_ram/status/2075793871834161160
tags:
- llm inference
- mixture-of-experts
- open source
title: Colibri runs 744B MoE model on CPU via expert streaming
---

An open‑source engine called **Colibri** can run the 744‑billion‑parameter GLM‑5.2 mixture‑of‑experts model on a single CPU machine with only 16–25 GB of RAM by streaming expert weights from NVMe storage, as announced in a recent [tweet](https://x.com/techwith_ram/status/2075793871834161160).

## Streaming experts, not full models
Colibri avoids loading the entire model into memory. For each generated token it pulls only the relevant expert weights from an NVMe drive, keeping RAM usage low. The inference core is written in pure C with minimal dependencies, and it supports native speculative decoding, which can cut the number of forward passes needed for each token.

## Performance trade‑offs
Running a 744B MoE on CPU is impressive, but latency is still higher than GPU‑accelerated inference. Streaming from disk introduces I/O overhead, and the speed benefit of speculative decoding varies with model size and prompt complexity. Developers should expect slower throughput—often several times slower than a comparable GPU setup—especially on older NVMe drives.

## Cost and accessibility
Because no GPUs are required, the upfront hardware cost drops dramatically. The engine is 100 % free and open source, so there are no licensing fees. The primary expense is a fast NVMe SSD and a CPU with enough cores to keep the pipeline fed. Electricity consumption may rise during prolonged inference, which could matter for long‑running services.

## When to try it
Startups that lack GPU budgets but need to experiment with very large MoE models can use Colibri for prototyping or low‑volume workloads. It is less suited for high‑throughput production APIs where response time is critical. Keep an eye on the project's updates for performance optimizations and broader hardware support before adopting it for latency‑sensitive services.

**What to watch**: upcoming benchmarks comparing CPU‑only streaming inference against GPU clusters, and community reports on NVMe bottlenecks as model usage scales.