---
date: '2026-07-10'
excerpt: OpenHands adds Agent Canvas, a control center that lets you run multiple
  LLM coding agents from one UI and hook them into GitHub, Slack, Notion, and more.
image: https://pbs.twimg.com/media/HMxlaO8akAERz3C.jpg?name=orig
media:
- type: image
  url: https://pbs.twimg.com/media/HMxlaO8akAERz3C.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HMxlapUbMAAdKxe.jpg?name=orig
- type: image
  url: https://pbs.twimg.com/media/HMxlbDzaUAAyaYF.jpg?name=orig
published_at: '2026-07-10T11:44:24.088229+00:00'
sources:
- https://x.com/DivyanshT91162/status/2075145051681009898
tags:
- ai coding
- self-hosted
- devops
title: OpenHands launches Agent Canvas for self‑hosted AI coding teams
---

OpenHands has released Agent Canvas, a self‑hosted control center that can orchestrate Claude Code, Codex, Gemini, OpenHands, or any ACP‑compatible agent from a single UI — the announcement was posted on [X](https://x.com/DivyanshT91162/status/2075145051681009898).

## One‑stop UI for multiple LLM agents
Agent Canvas presents a dashboard where you select the backend LLM and issue commands without changing your workflow. Switching from Claude Code to Gemini is a click, not a reinstall, which saves time when you want to compare model outputs or fall back to a cheaper engine.

## Flexible deployment options
You can run the stack locally on a laptop, inside a Docker container, on cloud VMs, or on any private infrastructure you already manage. The same configuration file works across these environments, so you can prototype on a workstation and then promote the same setup to production hardware.

## Automations for real engineering work
The platform includes built‑in actions that map AI output to common developer tasks:
- Decompose GitHub issues into subtasks.
- Generate status reports.
- Post updates to Slack channels.
- Trigger CI/CD pipelines via webhooks.
- Schedule recurring jobs (e.g., nightly code reviews).
All integrations are configurable through YAML, and the system works with GitHub, Slack, Notion, Linear, and any LLM you choose.

## Tradeoffs and considerations
While the code is 100 % open source, you still need to provision compute for the models you run. Running a Claude‑scale model on‑prem can be expensive, and Docker images may require GPU drivers that aren’t trivial to set up. The automation layer can also generate noisy tickets if prompts are not tuned, leading to false‑positive work items. Since there’s no commercial support, you’ll rely on community contributions for bug fixes.

**When to try it**: Spin up Agent Canvas on a low‑risk side project or a staging repository to evaluate cost and false‑positive rates before wiring it into production pipelines. Keep an eye on the repository for stability patches and community‑contributed adapters.