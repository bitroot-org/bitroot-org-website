---
date: '2026-09-27'
excerpt: 'Michael Spivak''s Calculus formalized in Lean 4: every theorem and every
  problem of all 30 chapters and 9 appendices, in both the 3rd and 4th editions -
  stormj-UH/spivak-lean'
image: https://bitroot.org/blog/media/2026-09-27-spivak-calculus-fully-formalized-in-lean-4.png
published_at: '2026-09-27T14:27:10.815692+00:00'
sources:
- https://github.com/stormj-UH/spivak-lean
tags:
- formal verification
- lean
- calculus
title: Spivak Calculus fully formalized in Lean 4
---

The repository now builds both the 3rd‑edition and 4th‑edition formalizations with a single command: `lake build SpivakCalculus.Fourth` (129 + 29 modules) 【source】.

## Complete textbook coverage
The code reproduces the entire text of Chapters 1‑30 and all nine appendices for both editions, including every definition, theorem, corollary, worked example, and every problem (lettered parts included). Problem numbers follow the 3rd edition unless otherwise noted, and a per‑chapter concordance links the two numberings【source】.

## Lean‑native definitions and Mathlib bridges
Spivak’s original constructions—ε‑δ limits, derivative as a limit of difference quotients, lower/upper‑sum integrals, and the definitions of \(\pi\), sin, cos, log, exp, complex numbers, and reals as Dedekind cuts—are used throughout. Identification lemmas (e.g., `Chapter15.piS_eq`, `Chapter18.expS_eq`) prove that these match Mathlib’s standard functions, allowing later chapters to reuse Mathlib results【source】.

## Audits, proofs, and licensing
The project contains a full axiom audit (`AuditAll.lean`) that reports only three axioms across 9,110 declarations, and a quick‐check file (`Verify.lean`) that prints axioms for 148 representative results, including the transcendence of \(e\) and \(\pi\). No `sorry` or `axiom` placeholders remain. The code is released under Apache 2.0, with a NOTICE stating it is an independent formalization and not endorsed by the book’s publisher【source】.

## Build considerations and limitations
A clean build from scratch takes several hours because most of the time is spent compiling Mathlib dependencies. Users must first fetch pre‑built Mathlib artifacts via `lake exe cache get`. The repository does not list any pricing (it is free) but does not provide binary releases, so you need a Lean 4 toolchain and patience for the initial compile【source】.

**When to try it**: If your startup is already using Lean 4 for verification or wants a rigorously audited calculus library, clone the repo and run the `lake build` command. Keep an eye on the project's `PROGRESS.md` for updates on remaining corrections and any future edition support.