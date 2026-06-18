---
date: '2026-06-18'
excerpt: "Introducing eve, an agent framework.\n\n\U0001D68A\U0001D690\U0001D68E\U0001D697\U0001D69D/\n
  \ \U0001D68A\U0001D690\U0001D68E\U0001D697\U0001D69D.\U0001D69D\U0001D69C\n  \U0001D692\U0001D697\U0001D69C\U0001D69D\U0001D69B\U0001D69E\U0001D68C\U0001D69D\U0001D692\U0001D698\U0001D697\U0001D69C.\U0001D696\U0001D68D\n
  \ \U0001D69D\U0001D698\U0001D698\U0001D695\U0001D69C/\n  \U0001D69C\U0001D694\U0001D692\U0001D695\U0001D695\U0001D69C/\n
  \ \U0001D69C\U0001D68A\U0001D697\U0001D68D\U0001D68B\U0001D698\U0001D6A1/\n  \U0001D69C\U0001D68C\U0001D691\U0001D68E\U0001D68D\U0001D69E\U0001D695\U0001D68E\U0001D69C/\n\nLike
  Next.js, for agents.\nhttps://vercel.com/blog/introducing-eve"
image: null
published_at: '2026-06-18T18:08:57.497843+00:00'
sources:
- https://x.com/i/status/2067180054979936413
tags:
- ai agents
- framework
- vercel
title: Vercel launches Eve, a Next.js‑style framework for AI agents
---

Vercel announced Eve, an open‑source agent framework that mirrors Next.js’s file‑system routing, shipping with a predefined directory layout (`agent/`, `agent.ts`, `instructions.md`, `tools/`, `skills/`, `sandbox/`, `schedules/`) out of the box. The announcement came via a tweet and a short blog post [link](https://vercel.com/blog/introducing-eve).

## Core Concepts

Eve treats each AI agent as a module with its own TypeScript entry point (`agent.ts`) and a markdown file for system prompts (`instructions.md`). Subfolders expose reusable capabilities: `tools/` for external APIs, `skills/` for composable functions, `sandbox/` for isolated test runs, and `schedules/` for recurring tasks. The layout lets developers use familiar Next.js conventions—pages become agents, API routes become tools—reducing the learning curve for teams already on Vercel.

## Deployment and Cost

Eve runs on Vercel’s serverless functions, so you can deploy an entire agent fleet with a single `vercel` command. Billing follows Vercel’s usual pay‑as‑you‑go model (execution time, bandwidth, and storage). There’s no separate license fee, but heavy usage could increase costs compared to a self‑hosted solution. For low‑traffic prototypes, the free tier often suffices.

## Limitations to Consider

The framework is newly released, so the ecosystem of pre‑built tools and community examples is still small. Debugging can be noisy; the sandbox logs all tool calls, which may surface false‑positive errors if external APIs are flaky. Because Eve leans on Vercel’s infrastructure, moving to another provider would require refactoring the deployment pipeline, raising a modest lock‑in risk.

## When to Try Eve

If your startup already uses Vercel for web services and wants to prototype AI‑driven workflows without building a custom orchestration layer, spin up a sandboxed agent with `vercel dev` and evaluate latency and cost. Keep an eye on the upcoming road‑map blog posts for expanded tooling and pricing details.