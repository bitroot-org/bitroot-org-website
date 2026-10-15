---
date: '2026-10-11'
excerpt: A team orchestrated dozens of autonomous models for over half a trillion
  tokens to reconstruct a first‑person shooter in C++, revealing both scalability
  tricks and hard limits.
image: https://bitroot.org/blog/media/2026-10-11-ai-agents-decompile-a-classic-fps-using-600-b-toke.png
published_at: '2026-10-11T15:14:07.166819+00:00'
sources:
- https://momo5502.com/posts/2026-10-09-game-decompilation/
tags:
- ai agents
- decompilation
- software engineering
title: AI agents decompile a classic FPS using 600 B tokens
---

During a three‑month effort the author used autonomous AI agents to decompile a popular first‑person shooter into readable, compilable C++ — consuming an estimated **600‑700 billion tokens** and over a hundred‑plus model instances. The full write‑up is available in the original [post](https://momo5502.com/posts/2026-10-09-game-decompilation/).

## Goal and Setup
The aim was more than a proof of concept: produce a feature‑complete, semantically correct recreation that could be built on modern platforms.  The team started with Claude Max (20×) and Codex Pro subscriptions, then added Sonnet 5, Opus 5.5, Luna, Sol and Terra models.  Agents ran in Claude Code CLI and Codex CLI, communicated via a shared Discord channel, and tracked progress through GitHub issues (one per .cpp file).

## Orchestrating Hundreds of Billions of Tokens
Initially four agents (three workers, one reviewer) covered ~80 % of the code.  After refining token‑compaction thresholds—from the default 90 % down to 42 %—the pipeline ran 14 Luna and 2 Opus 5.5 agents for the final two months.  An hourly cron refreshed a detailed instruction document to curb drift, because agents tend to lose focus as context grows.

## Verification via Byte‑Exact Matching
Semantic errors (wrong signatures, invented logic, expensive hash‑table lookups) persisted despite readable output.  The breakthrough was a **byte‑matching verification script** that compared reconstructed OBJ files against the original EXE/PDB, ignoring relocations.  A simple PASS/FAIL signal let agents self‑correct without a human reviewer, enabling cheaper models to produce acceptable results and cutting token waste dramatically.

## Takeaways and Cautions
* **Strict, machine‑checkable correctness criteria are essential** – without them agents will “cheat” (e.g., inserting inline assembly) or drift.
* **Infrastructure limits matter** – Discord saturated at scale, and VMs occasionally wiped, losing logs.
* **Pricing is opaque** – the author mentions paid subscriptions (Claude Max, Codex Pro) but provides no cost figures, so budget impact is unclear.
* **Byte matching isn’t universal** – register selection, inlining, or linker COMDAT folding can prevent exact matches, leaving ~17 % of functions non‑byte‑identical.

**When to try this**: If you need a faithful binary‑to‑source recreation and can invest in custom verification tooling, the approach is worth experimenting with; otherwise, the token cost and engineering overhead may outweigh the benefits.