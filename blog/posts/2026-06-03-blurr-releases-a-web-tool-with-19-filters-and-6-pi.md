---
date: '2026-06-03'
excerpt: Blurr’s new pixel‑effects service lets you drop any image into a browser
  and walk away with an art‑style output, all via a free web interface.
image: https://pbs.twimg.com/amplify_video_thumb/2061501354384998400/img/RtWD2EdXgZ4g2pXY.jpg
published_at: '2026-06-03T18:59:45.078081+00:00'
sources:
- https://x.com/i/status/2061501427353288954
tags:
- image processing
- web tool
- design
title: Blurr releases a web tool with 19 filters and 6 pixel effects
video: media/2026-06-03-blurr-releases-a-web-tool-with-19-filters-and-6-pi.mp4
---

Blurr just released a web‑based pixel‑effects tool that ships with 19 image filters and 6 dedicated pixel‑effects. The service lives at [ditther.com](http://ditther.com) and is advertised as a zero‑click way to turn a photo into something that "feels like art" — just drop an image and walk away.

## Quick look at the feature set
The UI presents a list of preset filters (e.g., vintage, neon, glitch) plus a separate panel for pixel‑level transformations such as dithering and mosaic. Selecting a preset instantly updates a preview, and the "Remix" button applies a random combination, which the tweet notes produced some of the best results. No API or SDK is announced, so the tool is currently a browser‑only experience.

## How this fits into a startup workflow
For engineers building internal tools or quick‑look visualizations, the service can replace ad‑hoc Photoshop scripts. Because it runs entirely in the browser, there’s no server‑side cost or credential management. You can embed the URL in an internal dashboard to let non‑designers generate stylized assets on demand. The lack of programmatic access means you’ll need to manually download the output, which may be a friction point for automated pipelines.

## Caveats and cost considerations
The site does not publish a pricing model, implying a free‑to‑use tier, but there’s no guarantee of service level or uptime. Performance depends on client hardware; large images can stall on low‑end devices. The presets are fixed, so fine‑grained control over parameters is limited, and false‑positive visual artifacts may appear when the algorithm misinterprets image content. Finally, because the tool is not open‑source, you’re locked into the vendor’s roadmap.

## When to try it
If you need a fast, no‑install way to generate stylized thumbnails or mock‑up graphics for a demo, give the tool a spin today. For production pipelines that require batch processing or API access, keep an eye on whether Blurr releases an SDK or webhook integration.

*Source: [Blurr tweet](https://x.com/i/status/2061501427353288954)*