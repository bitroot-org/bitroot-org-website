---
date: '2026-10-17'
excerpt: 'Qwen3.8-Flash-Next (MoE, NVFP4) and Qwen3.8-27B on two 16 GB consumer GPUs:
  two-GPU tensor parallel, experts offloaded to CPU. Formerly ninfer-tp2. - ValerioDolci/capy-flash'
image: https://bitroot.org/blog/media/2026-10-17-capy-flash-runs-125b-moe-model-on-two-consumer-gpu.jpg
published_at: '2026-10-17T12:37:52.377013+00:00'
sources:
- https://github.com/ValerioDolci/capy-flash
tags:
- ml inference
- moe
- local deployment
title: Capy-Flash runs 125B MoE model on two consumer GPUs
---

The **capy‑flash** project announced version v0.5.4, which can serve the 125 B Mixture‑of‑Experts (MoE) Qwen‑3.8‑Flash‑Next model on a single workstation equipped with two RTX 5070 Ti 16 GB cards, a Ryzen 9 9900X and about 70 GiB of free RAM. The installer script checks GPU, driver, AVX‑512 CPU and RAM requirements before downloading the 126.6 GB model artifact.

## Architecture and execution model
capy‑flash builds on the ninfer‑tp2 codebase and implements **tensor‑parallel inference over PCIe** without GPU peer‑to‑peer. Experts that don’t fit in VRAM (total 64.6 GiB) reside in locked host RAM and are computed on the CPU using an AVX‑512 NVFP4 kernel. The rest runs in FP32 partial‑sum mode on the two GPUs. It also supports **MTP speculative decoding** (K=3) and INT8 KV cache, with a context window up to 262 k tokens.

## Performance numbers
On the reference hardware, the engine achieves **3,977 tokens/s pre‑fill** for a 55k‑token prompt and **100.8 tok/s generation** in an agentic replay benchmark, beating the Strata baseline (78.3 tok/s). Time‑to‑first‑token median drops to **1.82 s** (vs 2.42 s for Strata). Quality on GSM8K (0.9765) and MMLU‑Pro (0.8452) is statistically non‑inferior to the NVIDIA GB300 reference.

## Getting started and practical limits
Installation is a one‑liner:
```bash
curl -fsSL https://raw.githubusercontent.com/ValerioDolci/capy-flash/main/install.sh | bash -s -- --check
```
The script validates the environment and then fetches the model from the Hugging Face repo. Running the server is as simple as invoking `serve-flash-next.sh` with the provided profile. Note that the server **handles only one request at a time** (`--max-concurrency 1`) and has been tested solely on the described machine. It also requires an AVX‑512 capable CPU and ~70 GiB RAM; the page‑locked expert allocation alone is 64.6 GiB. No pricing or commercial licensing details are provided.

## What to watch
If your startup already has two RTX 50‑series GPUs and a server‑class CPU, try capy‑flash for low‑latency local LLM APIs, but monitor RAM usage and single‑request limits. Future releases may relax concurrency constraints or add multi‑node support, which would broaden its applicability.