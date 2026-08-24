---
date: '2026-07-14'
excerpt: The new llm-dequant tool streams NVFP4 compressed tensors into dense BF16
  safetensors, unlocking models for llama.cpp and other pipelines.
image: https://pbs.twimg.com/media/HNJdH--asAALUg3.jpg?name=orig
published_at: '2026-07-14T10:32:15.302334+00:00'
sources:
- https://x.com/ViC305/status/2076826735421849706
tags:
- llm
- dequantization
- open-source
- model-conversion
title: llm-dequant adds NVFP4-to-BF16 checkpoint conversion
---

The newly released open‑source tool **llm-dequant** (installable via `pip install llm-dequant`) converts NVFP4‑compressed tensors to dense BF16 safetensors in a streaming fashion, handling a 295B MoE checkpoint (~597 GB) on a few hundred megabytes of RAM.

## The NVFP4 lockout problem
Many fine‑tuned LLM checkpoints are shipped only in the NVFP4 compressed‑tensor format. This format cannot be read by popular inference runtimes like llama.cpp, nor can it be merged or further fine‑tuned because the required GGUF conversion path is missing. The result is a practical dead‑end for startups that need to ship models quickly.

## How llm-dequant works
The tool reads an NVFP4 file chunk‑by‑chunk, expands each block to dense BF16, and writes a safetensors file. It relies on three runtime dependencies—torch, safetensors, and numpy—so no heavy external stack is required. A CI‑enforced bit‑exact test guarantees that the output round‑trips to the original checkpoint byte‑for‑byte, and a `verify` command lets you confirm this before committing hundreds of gigabytes to disk.

## Cost and practical limits
`llm-dequant` is free to install and runs on any platform that supports PyTorch. Memory usage stays low thanks to streaming, but CPU/GPU cycles are still needed to decompress and re‑encode large models, so conversion can take hours on commodity hardware. The tool currently only supports NVFP4 → BF16; other compression formats are out of scope. Users should also verify the output on a small subset before processing full checkpoints to avoid I/O surprises.

## When to try it
If you have a fine‑tuned model locked in NVFP4 and need to run it with llama.cpp, merge it with other checkpoints, or fine‑tune further, llm-dequant offers a pragmatic bridge. Start by converting a modest‑size checkpoint to validate your pipeline, then scale up to larger models. Keep an eye on the original announcement on [X](https://x.com/ViC305/status/2076826735421849706) for future format support and performance tweaks.