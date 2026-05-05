---
date: '2026-05-05'
excerpt: SubQ’s new model uses a sub‑quadratic sparse‑attention design to handle 12 million‑token
  contexts, delivering speed and cost advantages over existing attention engines.
image: https://pbs.twimg.com/amplify_video_thumb/2051654813717573632/img/aGtVgqlCkr4yOfHF.jpg
published_at: '2026-05-05T18:17:11.580017+00:00'
sources:
- https://x.com/i/status/2051663268704636937
tags:
- llm
- sparse attention
- performance
- cost
title: SubQ launches a sub‑quadratic LLM with 12M‑token context
video: media/2026-05-05-subq-launches-a-subquadratic-llm-with-12mtoken-con.mp4
---

SubQ announced a new LLM that uses a fully sub‑quadratic sparse‑attention architecture and supports a 12 million token context window, claiming 52× faster throughput than FlashAttention at 1 million tokens and less than 5% of the cost of Opus. The announcement was made in a [tweet](https://x.com/i/status/2051663268704636937).

## Sparse attention vs. classic attention
Standard transformer attention computes every pairwise token interaction, giving O(N²) complexity. SubQ’s SSA layer prunes the interaction graph, keeping only the relationships that appear statistically relevant. In practice this reduces the raw compute by roughly a factor of 1,000, enabling longer contexts without a proportional rise in hardware demand.

## Reported speed and price benefits
The model is advertised as 52× faster than FlashAttention when processing a 1 million‑token sequence. Cost‑wise, SubQ claims to run at under 5% of the expense of the Opus model, which positions it as a potentially affordable option for workloads that need very long context windows, such as legal document analysis or code‑base summarization.

## Caveats and trade‑offs
The speed and cost numbers come from the vendor’s internal benchmarks; real‑world results may vary with different hardware or batch sizes. Sparse attention can sometimes miss subtle long‑range dependencies, which could affect downstream quality on tasks that rely on nuanced context. Additionally, SubQ is not yet open‑source, so integration will depend on the provider’s API terms and pricing tiers, which have not been disclosed.

## When to experiment
If your startup regularly processes documents exceeding a few thousand tokens—e.g., multi‑page PDFs, extensive logs, or large code diffs—monitor SubQ’s API rollout and test it on a representative sample before committing to production. Early trials can reveal whether the speed gains outweigh any potential quality loss for your specific use case.