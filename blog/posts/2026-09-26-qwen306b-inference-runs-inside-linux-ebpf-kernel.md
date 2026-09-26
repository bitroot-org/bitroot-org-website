---
date: '2026-09-26'
excerpt: Can Linux eBPF execute a real language model? A Qwen3-0.6B experiment shows
  exactly which work runs in the kernel, how fast it is, and why INT4 and arena memory
  remain open tradeoffs.
image: https://bitroot.org/blog/media/2026-09-26-qwen306b-inference-runs-inside-linux-ebpf-kernel.png
published_at: '2026-09-26T13:32:24.885229+00:00'
sources:
- https://eunomia.dev/blog/2026/09/24/qwen3-ebpf-in-kernel-inference/
tags:
- ebpf
- language-model
- inference
title: Qwen3‑0.6B inference runs inside Linux eBPF kernel
---

A prototype runs the full 28‑layer decoder of the Qwen3‑0.6B model inside Linux eBPF, achieving a forward pass that selects the next token in roughly **1.2 seconds per token** on the test host. The work is split between a C driver (tokenizer, weight loading) and a series of bounded eBPF operators that perform matrix‑vector products, RMSNorm, SiLU, RoPE rotation, causal attention, and the final argmax. [Source](https://eunomia.dev/blog/2026/09/24/qwen3-ebpf-in-kernel-inference/)

## Architecture of the in‑kernel inference
The C side tokenizes input, embeds the first token, and dispatches a chain of 28 eBPF decoder layers. Each layer consists of a small set of BPF programs that read and write a KV map to reuse attention state across tokens. The implementation uses fixed‑point arithmetic (Q16 activations, Q24 weights, Q20 scales) to satisfy the eBPF verifier, and the `bpf_loop` helper processes up to 128 rows per call, reducing the total to about **4,169 BPF calls** for a single token.

## Performance and memory trade‑offs
Two weight handling paths were measured. The default path converts active matrix rows to Q24 and stores a 3.0 GB file (original 1.5 GB BF16 model). An optional arena path copies only the current 128‑row batch into a ~2 MiB BPF arena; both paths produced identical logits but showed no speed gain (≈ 1.22 s per token). Quantizing to INT4 reduced the forward pass to **0.956 s** but changed the next‑token prediction (ID 9 → 284) and increased logit error (MAE 1.837), indicating a loss of accuracy.

## Limits that keep this out of production
* The prototype is a research demo; 1.2 s per token is far slower than CPU/GPU inference.
* The KV map reserves ~224 KiB per position, so the maximum configured context (40,960 positions) would need ~8.75 GiB of kernel memory.
* The tokenizer, I/O, and model loading remain in userspace, so the kernel never sees raw text.
* No pricing, SLA, or stable API is provided—this is a source‑available experiment, not a product.

## When to try this approach
If your workload already lives in the kernel (e.g., packet‑level AI filtering) and you can tolerate high latency, the open‑source code and measurements give a concrete baseline for exploring tighter weight formats or mixed‑precision schemes. Otherwise, stick with traditional userspace inference.