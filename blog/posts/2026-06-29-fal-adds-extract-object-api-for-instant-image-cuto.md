---
date: '2026-06-29'
excerpt: Fal’s new Extract Object model returns a clean RGBA PNG cutout from a single
  API call, turning natural‑language prompts into ready‑to‑use assets.
image: https://pbs.twimg.com/ext_tw_video_thumb/2071631718763626496/pu/img/7U36B0aChwwFAUjV.jpg
published_at: '2026-06-29T19:20:37.442226+00:00'
sources:
- https://x.com/i/status/2071631739705762296
tags:
- image processing
- api
- computer vision
title: Fal adds Extract Object API for instant image cutouts
video: media/2026-06-29-fal-adds-extract-object-api-for-instant-image-cuto.mp4
---

Fal announced the launch of its Extract Object model, a single‑call API that isolates any object in an image and returns a clean RGBA‑PNG cutout ready for compositing. The endpoint also accepts a natural‑language prompt to specify the target, removing the need for manual masking. [tweet](https://x.com/i/status/2071631739705762296)

## How the API extracts objects
The service accepts a JPEG or PNG and a prompt like “the red car” and returns a 32‑bit RGBA image where the background is transparent. Internally it runs a segmentation model and then converts the mask to an alpha channel, so the response is already composable without additional processing. The API response format is a JSON payload with a base64‑encoded PNG, which can be streamed directly into a front‑end canvas.

## Plug‑in to existing pipelines
Because the call is a standard HTTP POST, it fits into CI/CD image‑generation steps or into on‑the‑fly UI editors. No SDK is required; a simple `curl` works. For teams already using Fal’s other models, the same authentication token applies, reducing credential churn.

## Caveats and cost signals
Fal has not published pricing for the Extract Object endpoint, so early adopters should expect a pay‑per‑call model similar to its text‑generation APIs. The model may struggle with tightly overlapping objects or very small items, producing noisy edges that still need manual cleanup. Rate limits are also unknown, which could affect high‑throughput batch jobs. Finally, the API only returns a PNG; if a different format is needed, an extra conversion step adds latency.

## When to experiment
If your product needs quick asset generation—e.g., e‑commerce listings, ad creatives, or UI mockups—try the API on a handful of representative images before committing to a larger volume. Monitor response times and false‑positive rates, and compare the cost against a custom in‑house segmentation pipeline.