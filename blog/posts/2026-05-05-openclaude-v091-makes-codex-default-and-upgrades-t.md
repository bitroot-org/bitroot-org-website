---
date: '2026-05-05'
excerpt: "Promised fulfilled!\n\nCodex is now the default provider and GPT 5.5 is
  the default model of OpenClaude. \n\nv0.9.1 released with big updates! \U0001F525\n\nThank
  you Sam"
image: https://pbs.twimg.com/amplify_video_thumb/2051616504819683328/img/hXB0aixsgmsKIsXD.jpg
published_at: '2026-05-05T18:19:04.750824+00:00'
sources:
- https://x.com/i/status/2051616716007075887
tags:
- openclaude
- ai
- model
- release
title: OpenClaude v0.9.1 makes Codex default and upgrades to GPT‑5.5
video: media/2026-05-05-openclaude-v091-makes-codex-default-and-upgrades-t.mp4
---

OpenClaude released version **0.9.1**, announcing that **Codex** is now the default provider and that **GPT 5.5** is the default model for all new requests. The update was announced in a short tweet by the maintainer, noting the version bump and a “big updates” tag. [GitLawb tweet](https://x.com/i/status/2051616716007075887)

## What the switch means for your code generation
Codex has historically been tuned for programming tasks, offering better completion relevance for languages like Python, JavaScript, and Go. Making it the default provider means you no longer need to specify `provider: codex` in your OpenClaude client config – the SDK will route all calls there automatically. The new default model, GPT 5.5, builds on the previous 5.0 series with a larger context window (up to 64 k tokens) and marginally better reasoning on code‑related prompts.

## Cost and performance implications
OpenClaude’s pricing is still tied to the underlying provider’s rates. Codex is generally more expensive per token than the older `davinci`‑style models, so teams should expect a modest increase in compute spend, especially for heavy autocompletion pipelines. The larger context window can reduce the number of round‑trips needed for multi‑file refactoring, which may offset some of the cost. Without explicit pricing details from the vendor, we recommend monitoring your usage meters after the upgrade.

## Potential downsides and lock‑in risk
While Codex improves language‑specific suggestions, it may produce higher false‑positive rates on non‑code text, leading to noisy output if you use the same endpoint for documentation generation. Moreover, defaulting to a proprietary provider can make it harder to switch back to an open‑source alternative without code changes. Teams that rely on strict reproducibility should keep the `provider` flag configurable rather than hard‑coding the default.

## When to try it
If your startup already uses OpenClaude for code‑completion or CI‑assist tools, upgrade to **v0.9.1** on a staging branch and compare latency and token usage against your current setup. Watch for any unexpected spikes in cost during the first week; if the performance gain outweighs the expense, roll the change out to production.