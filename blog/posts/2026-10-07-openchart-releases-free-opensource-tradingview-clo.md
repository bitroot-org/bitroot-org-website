---
date: '2026-10-07'
excerpt: OSS Tradingview with your own AI, free and unlimited. - longsurf-ai/openchart
image: https://bitroot.org/blog/media/2026-10-07-openchart-releases-free-opensource-tradingview-clo.png
published_at: '2026-10-07T15:56:14.882459+00:00'
sources:
- https://github.com/longsurf-ai/openchart
tags:
- open-source
- charting
- ai agents
title: OpenChart releases free open‑source TradingView clone with AI agents
---

OpenChart released a free desktop app for macOS Apple Silicon, available as a downloadable .dmg from its [GitHub repo](https://github.com/longsurf-ai/openchart). The project also supports self‑hosting via source, requiring Node 24, npm 11.11.1, and Bun 1.4.2.

## Quick start and local install
Clone the repository, then use the provided `just` commands to install dependencies, build the Tea language runtime, and launch the desktop client:
```
git clone https://github.com/longsurf-ai/openchart.git
cd openchart
just install --frozen-lockfile
just desktop
```
The “just install” step also compiles Tea, a domain‑specific language for market analysis. A separate setup guide walks you through creating your first chart and alert.

## AI agents at every step
OpenChart lets you hook any existing LLM provider—Claude, Codex, Gemini—into the workflow. Agents can generate statistical scripts, research market moves, and power price‑cross alerts. The UI includes a “Describe what to watch” pane that translates natural‑language conditions into Tea monitors, and a “Explain what moved the chart” tool that annotates bars with source‑linked commentary.

## Costs and limitations
The desktop client itself is free, but AI usage follows the pricing of whichever model you connect (e.g., Claude, Gemini). Optional cloud market data is billed separately, and the repository does not list a unified pricing tier for those services. In other words, you may still incur costs from your LLM provider or data feed.

## When to try it
If you already have API access to an LLM and need a customizable charting stack without vendor quotas, spin up OpenChart locally and experiment with Tea scripts. Watch the repo for upcoming releases that add more built‑in studies and tighter integration with popular data sources.