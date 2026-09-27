---
date: '2026-09-27'
excerpt: A practical introduction to TLA+, why it matters for agentic coding, and
  how AI could take formal verification from models to machine-checked proofs and
  ultimately to verified software.
image: https://bitroot.org/blog/media/2026-09-27-reasonable-launches-tlatoverus-pipeline-and-proof.png
published_at: '2026-09-27T14:26:33.527217+00:00'
sources:
- https://reasonable.io/blog/tla-tutorial/
tags:
- tla+
- formal verification
- rust
title: Reasonable launches TLA+‑to‑Verus pipeline and proof dataset
---

Reasonable announced a pipeline that turned **16,459** TLA+ specification/property pairs into **over 3,000** machine‑checked safety and liveness proofs in Verus, and released the supporting dataset and transpiler as a first step toward fully automated verification [Reasonable blog](https://reasonable.io/blog/tla-tutorial/).

## From TLA+ models to machine‑checked proofs
The team built a TLA+‑to‑Verus transpiler and compared it with an agentic workflow where one LLM generates the translation and another reviews it. The pipeline also includes a prover–reviewer loop that checks for shortcuts such as `assume(false)`. From the original specifications, the system produced more than 3,000 verified proofs and a 40‑task evaluation set.

## How the proof stack works
Verus lets specifications, proofs, and Rust implementation coexist in the same language, enabling "refinement" proofs that the code respects the model. The pipeline first checks a finite model with TLC, then lifts the results into Verus where safety (nothing bad ever happens) and liveness (something good eventually happens) properties are proved. The approach still relies on finite‑instance model checking; the state space grows quickly (e.g., from 38 states for three nodes to >1 M for nine).

## Practical considerations for startups
The post does not list any pricing or licensing details, so the cost of adopting the pipeline is unclear. The tooling focuses on translating existing TLA+ models, so you need a model to begin with. Scaling to large systems may require manual proof effort because TLAPS automation is limited for liveness arguments, and the verification only covers the model, not the implementation itself.

## Cautionary note
While the pipeline automates many steps, it does not eliminate the classic spec‑to‑implementation gap: the TLA+ model and the Rust code can diverge as the code evolves. Also, the page provides no information on usage limits, support contracts, or enterprise‑grade features.

**What to watch**: Reasonable promises follow‑up posts that dive into each component of the pipeline. If you already have TLA+ models for a critical distributed component, try feeding a small subset through the transpiler to gauge how much manual proof work remains.