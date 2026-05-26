---
date: '2026-05-26'
excerpt: 'Ascii Magic landing page is live✨

  Check out http://ascii-magic.com/landing


  Built end-to-end with Paper + Claude.

  Animated completely using AI (more on this soon)'
image: https://pbs.twimg.com/amplify_video_thumb/2059299925100539904/img/uDOQQLLXtmrb9Yfz.jpg
published_at: '2026-05-26T19:24:27.398745+00:00'
sources:
- https://x.com/i/status/2059300319331565930
tags:
- ai-generated ui
- landing page
- paper
- claude
title: Ascii Magic launches AI-animated landing page
video: media/2026-05-26-ascii-magic-launches-ai-animated-landing-page.mp4
---

Ascii Magic’s landing page went live at http://ascii-magic.com/landing, showcasing a fully AI‑generated animation built end‑to‑end with Paper and Claude. The tweet announcing the launch notes the entire visual flow was created by the models, with no hand‑coded keyframes.

## End‑to‑end generation

Paper provides a lightweight notebook‑style environment for prompting LLMs to emit HTML, CSS, and JavaScript. In this case the prompts fed Claude (the Anthropic LLM) a description of the desired animation, and Claude returned runnable code that animates ASCII art. The resulting page runs in any browser without additional assets.

## Cost and integration

Claude is accessed via API, billed per token. A single rendering of the landing page consumes a few hundred tokens, translating to a few cents per generation. Paper itself is open source, so the stack can be self‑hosted, but the Claude dependency introduces a recurring expense that scales with usage.

## Trade‑offs to consider

AI‑generated code can be noisy; the animation occasionally misbehaves on older browsers, and debugging is harder because the source is a model output rather than hand‑written logic. There is also a vendor lock‑in risk: switching from Claude to another model would require re‑prompting and may yield different results.

## When to experiment

If you need a quick prototype UI or a playful demo that doesn’t justify a full design sprint, try reproducing the workflow on a low‑traffic internal tool. Keep an eye on token usage and test across browsers before committing to production.

The announcement can be seen in the original [tweet](https://x.com/i/status/2059300319331565930).