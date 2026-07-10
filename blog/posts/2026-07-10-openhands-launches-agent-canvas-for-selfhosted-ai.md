---
date: '2026-07-10'
excerpt: OpenHands unveiled Agent Canvas, a control center that lets you run multiple
  LLM coding agents from a single interface and automate real engineering tasks.
image: https://pbs.twimg.com/media/HMxlaO8akAERz3C.jpg?name=orig
media:
- type: image
  url: https://pbs.twimg.com/media/HMxlaO8akAERz3C.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HMxlapUbMAAdKxe.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HMxlbDzaUAAyaYF.jpg?name=orig
published_at: '2026-07-10T13:09:32.272835+00:00'
sources:
- https://x.com/DivyanshT91162/status/2075145051681009898
tags:
- openhands
- ai coding
- self-hosted
title: OpenHands launches Agent Canvas for self‑hosted AI coding teams
---

OpenHands introduced **Agent Canvas**, a self‑hosted control center that can run Claude Code, Codex, Gemini, OpenHands, or any ACP‑compatible agent from one UI. The tweet announcing it notes you can switch backends on‑the‑fly without breaking your workflow【https://x.com/DivyanshT91162/status/2075145051681009898】.

## Unified agent orchestration
Agent Canvas bundles the output of different LLM coding agents into a single dashboard. You can spin up an agent on your laptop, inside Docker, on a cloud VM, or on any private infrastructure you control. The UI lets you select the backend per task, making it easy to compare model outputs or fallback to a cheaper model when needed.

## Built‑in engineering automations
Beyond code generation, the platform can decompose GitHub issues into subtasks, generate progress reports, push updates to Slack, trigger CI/CD pipelines via webhooks, and schedule recurring jobs. It integrates out‑of‑the‑box with GitHub, Slack, Notion, and Linear, and any LLM that speaks the ACP protocol.

## Caveats to consider
Running an always‑on AI team requires provisioning compute for each agent, which can add non‑trivial cost if you rely on large models like Claude or Gemini. Self‑hosting also shifts responsibility for security patches and scaling to your ops team. The automation layer may generate noisy reports or duplicate tasks, so you’ll need to tune filters before trusting it in production.

## When to give it a spin
If you already experiment with multiple LLM coding agents and have the bandwidth to manage Docker or VM deployments, try deploying Agent Canvas on a small test repo. Observe how the issue‑decomposition and Slack notifications affect your sprint cadence before rolling it out to a larger codebase.