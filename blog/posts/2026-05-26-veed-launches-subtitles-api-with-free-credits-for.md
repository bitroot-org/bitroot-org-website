---
date: '2026-05-26'
excerpt: VEED announced a Subtitles API that supports over 100 languages and offers
  free credits to the first 100 users who retweet the launch tweet.
image: https://pbs.twimg.com/amplify_video_thumb/2059269424025382912/img/QmhqClgMjoPy4stw.jpg
published_at: '2026-05-26T19:22:24.950568+00:00'
sources:
- https://x.com/i/status/2059269493382434992
tags:
- api
- subtitles
- video
- ai
title: VEED launches Subtitles API with free credits for early users
video: media/2026-05-26-veed-launches-subtitles-api-with-free-credits-for.mp4
---

VEED rolled out its Subtitles API, promising subtitles for any video in 100+ languages with a free credit batch for the first 100 users who retweet the launch tweet [VEED’s launch tweet](https://x.com/i/status/2059269493382434992).

## What the API delivers
The endpoint accepts a video URL or raw file and returns a timed‑text track in the requested language. VEED claims sub‑second rendering and transcription accuracy comparable to its web editor.

Supported languages exceed a hundred, from English and Mandarin to less common tongues like Swahili, making it a catch‑all for global products.

## Pricing model and free tier
VEED is handing out free API credits via direct message to the first 100 retweeters, a typical hack for early adoption. After the giveaway, pricing is announced on the VEED pricing page (not linked here).

Credits are consumed per minute of processed video, so heavy usage can quickly outpace the free allotment.

## Risks and limitations
Transcription accuracy still depends on audio quality; noisy backgrounds can generate false positives, requiring post‑processing.

The service is hosted on VEED’s cloud, so latency may increase for large files or regions far from their data centers, and you’re locked into their API contract if you embed it deeply.

## When to give it a spin
If your startup needs quick multilingual captions for demos or user‑generated content, sign up for the free credits now and run a few test videos to benchmark latency and error rates.

Re‑evaluate after the trial period; compare cost and accuracy against self‑hosted ASR solutions before committing.