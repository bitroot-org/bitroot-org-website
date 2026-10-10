---
date: '2026-10-09'
excerpt: Reverse-engineered an old Nokia's firmware and added a custom AI Agent. Native
  functions like calls, alarms, or alarms can now be easily handled just by chatting.
  - anupray95/AI-Agent-on-a-NOKIA
image: https://bitroot.org/blog/media/2026-10-09-ai-chat-agent-runs-on-a-nokia-110-4g-via-a-hacked.png
published_at: '2026-10-09T15:41:20.732313+00:00'
sources:
- https://github.com/anupray95/AI-Agent-on-a-NOKIA
tags:
- ai
- embedded
- nokia
- prototype
title: AI chat agent runs on a Nokia 110 4G via a hacked calculator app
---

Anup Ray reverse‑engineered the firmware of a Nokia 110 4G and turned the stock Calculator app into a native AI chat client. The prototype loads into RAM from a PC, then runs unplugged on mobile data, using the DeepSeek chat API for language understanding and tool calls.

## How the hack works
The Calculator entry point was repurposed to host a custom UI that accepts text typed on the numeric keypad. Messages are sent to the DeepSeek API, and the response can trigger native phone functions. The entire agent is compressed to fit the device’s 48 MB memory, and the payload reuses existing buffers to stay within limits. The code runs entirely in RAM; there is no permanent flash modification yet.

## What the agent can do today
- **Answer questions** using the phone’s SIM data.
- **Read battery percentage**.
- **Turn the torch on or off**.
- **Start a phone call**.
- **Set an alarm**.
These actions are demonstrated in a short YouTube demo linked from the repo. The app was built with the help of OpenAI Codex and tested on the actual handset.

## Limitations and open questions
The prototype is a **working RAM‑loaded app**, not a permanently installed package. After any restart or power‑off the agent must be re‑loaded from a computer. The source code is not publicly available because it contains sensitive data, so reproducing the hack will require digging into the firmware yourself. The announcement does not include pricing, performance benchmarks, or a roadmap for a stable release.

## When to try it
If you are experimenting with AI agents on ultra‑constrained hardware or need a proof‑of‑concept for embedding language models in legacy devices, this demo shows a viable path. Keep an eye on the GitHub repo [AI‑Agent‑on‑a‑NOKIA](https://github.com/anupray95/AI-Agent-on-a-NOKIA) for any updates, and follow the creator on [LinkedIn](https://www.linkedin.com/in/anup-ray-dev/) or [X](https://x.com/asubidha7) for future releases.