---
date: '2026-04-23'
excerpt: Nvidia now offers free hosted APIs for around 80 AI models, letting developers
  plug them into IDEs and agents without paying for inference.
image: https://pbs.twimg.com/media/HGhtdU7aMAAl5f5.png?name=orig
published_at: '2026-04-23T08:56:46.160041+00:00'
sources:
- https://x.com/dhruvtwt_/status/2047006444701274380
tags:
- nvidia
- ai models
- api
- free inference
title: Nvidia launches free hosted APIs for 80 AI models
---

Nvidia announced that developers can access roughly 80 AI models through hosted APIs at no cost, including MiniMax M2.7, GLM 5.1, Kimi 2.5, DeepSeek 3.2, GPT‑OSS‑120B, and Sarvam‑M. The free tier is activated by grabbing an API key from the [Nvidia Build portal](https://build.nvidia.com/models) and pointing requests to `https://integrate.api.nvidia.com/v1`.

## Model catalog and integration points
The catalog spans large‑language, code‑completion, and multimodal models. Nvidia lists the full set on its model hub, and the tweet that sparked the news highlighted the most popular picks. The models can be called directly from tools like [OpenClaude](https://github.com/openclaude), [OpenCode](https://github.com/opencode), the [Zed IDE](https://zed.dev), and the [Cursor IDE](https://cursor.com), as well as custom agents such as Hermes. This breadth means you can swap models without rewriting client code, as long as the target API follows OpenAI‑compatible conventions.

## Getting started in minutes
1. Create an account on the Nvidia Build site and generate an API key.
2. Set `base_url = "https://integrate.api.nvidia.com/v1"` in your client library.
3. Choose a model identifier, for example `minimaxai/minimax-m2.7`.
4. Send standard chat or completion requests; responses are returned in the usual JSON schema.

## Pricing, quotas, and hidden costs
The free tier currently has no per‑request charge, but Nvidia imposes rate limits and monthly usage caps that are not publicly documented. Exceeding those limits will trigger throttling, and the only way to lift them is to move to a paid plan. For hobby projects this is fine, but production workloads should treat the free tier as a preview rather than a reliable backbone.

## Risks and lock‑in considerations
Because the API surface mirrors OpenAI's, migrating away is technically straightforward, yet the model selection and performance characteristics are Nvidia‑specific. If your stack depends heavily on a particular model's quirks, you may face re‑training or prompt‑tuning effort when switching providers. Additionally, the lack of SLA guarantees on the free tier could affect latency‑sensitive services.

## What to watch
Monitor Nvidia's usage‑policy updates and the announced quota thresholds; a change could force you to shift to a paid tier or a different vendor. If you’re prototyping a new feature, try the free APIs now and benchmark latency and output quality before committing to any long‑term integration.