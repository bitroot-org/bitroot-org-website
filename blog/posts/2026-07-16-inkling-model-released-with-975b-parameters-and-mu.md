---
date: '2026-07-16'
excerpt: Inkling, the first open model from Thinky Machines, ships 975 B parameters,
  1 M token context, and native text, image, and audio reasoning, with a ready‑to‑run
  stack.
image: https://pbs.twimg.com/amplify_video_thumb/2077457043691319296/img/IfrTS5_Mp9k_TIPl.jpg
published_at: '2026-07-16T10:50:43.044395+00:00'
sources:
- https://x.com/lmsysorg/status/2077457150046269779
tags:
- large language model
- multimodal
- open source
title: Inkling model released with 975B parameters and multimodal support
video: media/2026-07-16-inkling-model-released-with-975b-parameters-and-mu.mp4
---

Inkling, Thinky Machines’ inaugural open model, launched today with a 975 B total parameter count, 41 B active Mixture‑of‑Experts (MoE) units, and a context window that can stretch to 1 M tokens. It claims native reasoning over text, images, and audio, and the serving stack is already live.

## Architecture and performance
Inkling’s backbone combines a ShortConv feed‑forward layer, relative‑position attention, and a shared‑expert sink MoE. The team reports a pre‑fill CUDA graph and an MXFP8 KV cache that keep latency low even at massive scale. While the design sounds efficient, the reliance on MoE routing can introduce uneven GPU utilization, which may surface as jitter in real‑time apps.

## Training and inference stack
The model runs on a customized Megatron backend that supports full‑parameter and LoRA‑based reinforcement learning (RL). Specialized kernels enforce inference‑time consistency, and cross‑runtime parameter synchronization helps keep distributed training in sync. Day‑0 support is provided for SGLang and Miles, and speculative decoding (DFlash) is sourced from Modal for low‑latency serving. All components are open‑source, but stitching them together still requires a non‑trivial engineering effort.

## Cost and operational trade‑offs
Running a 975 B MoE model typically demands dozens of A100‑40GB GPUs just for inference, pushing cloud costs into the high‑four‑figure range per day. The MXFP8 cache reduces memory pressure, yet the 1 M token window means the KV store can grow rapidly, potentially spilling over to host memory. Teams should benchmark latency under realistic traffic before committing to production use.

## When to try Inkling
If your startup needs multimodal reasoning and can allocate a dedicated GPU cluster, spin up the reference stack from the [tweet](https://x.com/lmsysorg/status/2077457150046269779) and run a small benchmark on a 1‑M token prompt. Watch for updates to the DFlash decoder and any pricing changes to Modal’s speculative service, as those will directly affect latency and cost.