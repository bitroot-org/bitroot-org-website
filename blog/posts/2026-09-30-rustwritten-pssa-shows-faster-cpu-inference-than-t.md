---
date: '2026-09-30'
excerpt: A custom AI architecture being developed in rust . Contribute to Sparticle62ops/pssa
  development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-09-30-rustwritten-pssa-shows-faster-cpu-inference-than-t.png
published_at: '2026-09-30T15:31:30.254243+00:00'
sources:
- https://github.com/Sparticle62ops/pssa
tags:
- language model
- rust
- non‑transformer
title: Rust‑written PSSA shows faster CPU inference than transformers
---

The **PSSA** repo (https://github.com/Sparticle62ops/pssa) introduces a small language model that is *not* a transformer.  With the default 1.5 M‑parameter configuration it reaches a training cross‑entropy of 3.98 on WikiText‑103, beating a transformer baseline (4.43) while generating 200 tokens in 226 ms versus 2,735 ms on the same CPU.

## Architecture highlights
PSSA processes tokens left‑to‑right through a selective state‑space recurrence, reads from a 512‑slot episodic memory bank in hyperbolic space, and rewrites part of its own weights on‑the‑fly.  The core is hand‑written linear algebra in Rust, avoiding any PyTorch or TensorFlow dependency.  Because it carries a fixed‑size state, per‑token cost grows linearly with sequence length, unlike the quadratic cost of attention.

## Training and speed claims
Two models were trained on identical data, tokenizer, optimizer schedule, and seed for 12.7 M tokens.  PSSA hit the 3.98 loss after roughly 2 M tokens, whereas the transformer needed the full budget.  In generation, PSSA was about **12× faster** on CPU (226 ms vs 2,735 ms for 200 tokens).  On matched CPU hardware, training throughput was 4.1× higher (1,716 tokens/s vs 415 tokens/s).

## Caveats and open questions
The authors note several limitations: the experiments use 1.5 M‑parameter models on a modest token budget, so text quality is still poor (e.g., "a barget of the Prian Academy").  Speed numbers are CPU‑to‑CPU; GPU training rates are not hardware‑matched.  Two key evaluations are missing: retention after a corpus switch and the impact of ablating the memory bank.  The project also requires a Rust toolchain and optional CUDA support, and the current codebase is a research prototype, not a production‑ready library.

## When to try it
If you have spare GPU time and want to experiment with a non‑transformer architecture that can run efficiently on CPUs, clone the repo and run `cargo build --release` followed by `./target/release/oxide_ai_pssa`.  Watch for future updates on larger‑scale experiments and community contributions that improve kernel performance and add modern recurrent baselines.

**What to watch:** upcoming benchmarks that test PSSA at 10× the current parameter count and evaluate long‑term skill retention after corpus changes.