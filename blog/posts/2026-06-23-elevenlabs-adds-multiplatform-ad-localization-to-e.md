---
date: '2026-06-23'
excerpt: ElevenLabs' new Ads Engine lets you pull Google, Meta, and LinkedIn campaigns
  into ElevenCreative, translate them into 50+ languages, and push the results back.
  Engineers need to weigh integration effort against potential reach.
image: https://pbs.twimg.com/amplify_video_thumb/2069106830585008128/img/AG7lyyRH-XI-r1Cf.jpg
published_at: '2026-06-23T01:54:26.240535+00:00'
sources:
- https://x.com/i/status/2069111326987673761
tags:
- ads
- localization
- elevenlabs
title: ElevenLabs adds multi‑platform ad localization to ElevenCreative
video: https://video.twimg.com/amplify_video/2069106830585008128/vid/avc1/3840x2160/JNV3XcjuWcKTO7Al.mp4?tag=28
---

ElevenLabs announced the **Ads Engine** feature inside its ElevenCreative platform. The tool can connect to Google, Meta, and LinkedIn ad accounts, translate existing creatives into more than 50 languages, and automatically send the localized assets back to the original ad platform. The announcement was made via a [tweet](https://x.com/i/status/2069111326987673761).

## What the feature actually does
The engine imports campaign data (copy, images, video) from the three major ad networks. Once inside ElevenCreative, users can select target languages and let the service generate localized versions. After translation, the updated creatives are pushed back to the source account, ready for immediate deployment. This eliminates the manual export‑translate‑import loop that many growth teams currently script.

## Integration considerations for startups
Connecting the three platforms requires OAuth credentials for each ad network, which adds a one‑time setup step. The API calls are synchronous, so latency will depend on the size of the asset bundle and the translation workload. For a typical startup with a few dozen ads, the overhead is modest, but large accounts could see noticeable processing time.

## Cost and pricing unknowns
ElevenLabs has not published pricing for the Ads Engine. Expect a usage‑based model (e.g., per‑translated asset) or a tiered subscription that aligns with their existing ElevenCreative plans. Early adopters should request a quote and compare it against in‑house translation pipelines or third‑party services.

## Caveats and potential friction points
* **Translation quality** – Automated output may need human review, especially for brand‑specific terminology or regulatory copy. False positives could lead to compliance issues on platforms like Meta.
* **Platform lock‑in** – Once campaigns are routed through ElevenCreative, rolling back to a native workflow might require additional export steps.
* **Rate limits** – Each ad network imposes its own API limits; high‑volume pushes could hit throttling, requiring back‑off logic.

## When to try it
If you have a pilot campaign targeting a new market, spin up a single ad set, run it through the Ads Engine for a few languages, and compare performance against manually localized assets. The results will reveal whether the time savings outweigh any translation refinement effort.