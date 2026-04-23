---
date: '2026-04-23'
excerpt: Nvidia now provides free access to around 80 large language models via hosted
  APIs, with a simple key‑based setup. Engineers can experiment without paying for
  inference.
image: https://pbs.twimg.com/media/HGhtdU7aMAAl5f5.png?name=orig
published_at: '2026-04-23T09:12:29.006793+00:00'
sources:
- https://x.com/dhruvtwt_/status/2047006444701274380
tags:
- nvidia
- ai models
- hosted api
title: Nvidia launches free hosted APIs for ~80 AI models
---

Nvidia announced that roughly 80 AI models are now available through hosted APIs at no cost. The rollout includes MiniMax M2.7, GLM 5.1, Kimi 2.5, DeepSeek 3.2, GPT‑OSS‑120B, Sarvam‑M, and more, all reachable with a single API key from the [model catalog](https://build.nvidia.com/models).

## Quick start for developers

Grab an API key from the catalog page and point your client at the base URL `https://integrate.api.nvidia.com/v1`. A minimal Python snippet looks like:
```python
import os, requests
api_key = os.getenv("NVIDIA_API_KEY")
base_url = "https://integrate.api.nvidia.com/v1"
model = "minimaxai/minimax-m2.7"
# send request …
```
The free tier currently offers generous rate limits for experimentation, making it easy to plug these models into tools like OpenClaude, OpenCode, Zed IDE, Hermes agent, or Cursor IDE.

## Where the free tier stops being free

While the inference itself is billed at $0, the service imposes throttling: high‑throughput workloads quickly hit per‑minute caps, and commercial use is explicitly prohibited without a paid plan. Additionally, the model list may change without notice, so long‑term projects should treat the offering as provisional.

## Quality and compatibility considerations

The hosted models vary widely in size and training data, which means latency and output consistency differ from one model to another. Early users report occasional "cold‑start" delays for the larger 120B‑parameter models, and some APIs return generic error messages that make debugging harder. If your stack relies on strict SLAs, you’ll need a fallback strategy.

## When to try it

If you are prototyping a chatbot, code‑assistant, or internal tool and want to avoid upfront cloud costs, enable the free Nvidia API today and run a few benchmark queries. Monitor request latency and error rates; if they stay under your tolerance for a week, consider integrating the model into a low‑risk feature. Keep an eye on the [tweet thread](https://x.com/dhruvtwt_/status/2047006444701274380) for updates on rate limits and any transition to paid tiers.