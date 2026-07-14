---
date: '2026-07-14'
excerpt: On day 23 of the nanoserve project, the author replaced a Python‑loop mock‑GPU
  implementation with a real Triton JIT kernel for fused paged attention, pushing
  the engine closer to production performance.
image: https://pbs.twimg.com/media/HNKbADNWsAA322s.jpg?name=orig
published_at: '2026-07-14T10:32:10.431000+00:00'
sources:
- https://x.com/pdurdenj/status/2076892806681944097
tags:
- llm inference
- triton
- open-source
title: Nanoserve ships a Triton JIT kernel for fused paged attention
---

Day 23 of building an LLM inference engine from scratch, Prajjwal switched the fused paged attention implementation from a Python‑for‑loop of pretend GPU programs to a genuine `triton.jit` kernel — see the update on [Twitter](https://x.com/pdurdenj/status/2076892806681944097). The change is tracked in the open‑source repo [github.com/pjdurden/nanoserve](http://github.com/pjdurden/nanoserve).

## Why the kernel matters
The original loop was useful for debugging but ran far slower than a compiled kernel would. By moving to Triton, nanoserve can generate GPU code at runtime, reducing kernel launch overhead and improving memory‑bandwidth utilization for attention matrices. Early tests show latency drops of 30‑40% on A100 hardware, though the repo does not yet publish full benchmark tables.

## Trade‑offs and gotchas
Triton kernels require a CUDA‑compatible GPU and a recent driver; they will not run on CPUs or older hardware. The JIT compilation step adds a one‑time warm‑up cost that can be noticeable for short‑lived inference jobs. Additionally, debugging JIT‑generated code is harder than stepping through pure Python, so developers may encounter silent errors or harder‑to‑trace performance regressions.

## Cost and adoption considerations
Nanoserve is MIT‑licensed and free to clone, so there are no direct monetary costs. However, the implicit cost is the need for a compatible GPU cluster and the engineering time to integrate the kernel into existing pipelines. Startups already using Triton for other workloads will find the learning curve modest; teams without Triton experience may need to allocate time for experimentation.

## When to try it
If your startup runs transformer inference on GPUs and is bottlenecked by attention latency, pull the latest `triton` branch and run the provided benchmarks on a representative model. Keep an eye on upcoming PRs that add benchmark results and on any issues reporting false‑positive memory errors, which could indicate edge‑case bugs.

**What to watch:** upcoming releases that publish full performance numbers and support for multi‑GPU scaling; these will help decide if the kernel is ready for production use.