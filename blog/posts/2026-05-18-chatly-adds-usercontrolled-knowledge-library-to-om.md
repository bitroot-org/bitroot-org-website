---
date: '2026-05-18'
excerpt: Chatly’s new Sources library lets teams upload files and references that
  OmniAgent uses as the primary context for every answer, cutting down on copy‑paste.
  The feature is free to try but may carry hidden costs and privacy considerations.
image: https://pbs.twimg.com/ext_tw_video_thumb/2056408379233329152/pu/img/vnqzDQtVaEscS51I.jpg
published_at: '2026-05-18T18:36:54.800233+00:00'
sources:
- https://x.com/i/status/2056408432677142920
tags:
- ai workspace
- knowledge management
- prompt engineering
title: Chatly adds user‑controlled knowledge library to OmniAgent
video: media/2026-05-18-chatly-adds-usercontrolled-knowledge-library-to-om.mp4
---

Chatly announced a new **Sources** library that lets you upload files, documents, and references, which OmniAgent treats as the primary context for every answer. The announcement was made via a tweet that links directly to the feature page [here](https://chatlyai.app/customize/sources?utm_source=x&utm_medium=social&utm_campaign=post) [source](https://x.com/i/status/2056408432677142920).

## How the library works
Sources acts as a structured knowledge base you own. After uploading PDFs, CSVs, or plain‑text files, OmniAgent pulls relevant snippets into its prompt construction, so you no longer need to paste snippets manually. The system claims to prioritize your library over generic web data, which can improve answer relevance in narrow domains.

## Impact on prompt engineering
For engineers who already write custom prompts, Sources reduces the need for elaborate prompt scaffolding. Instead of crafting a "system message" that lists context, you let the library surface the right content automatically. This can speed up iteration cycles when building internal bots that answer product‑specific questions.

## Trade‑offs and limits
The feature is currently in beta and its pricing is not public, so teams should assume a possible shift from free to paid after a usage threshold. Because the library is user‑controlled, any outdated or noisy documents can increase hallucination risk, especially if the uploader does not curate the content. Privacy is also a concern: uploaded files are stored on Chatly’s servers, which may not meet strict compliance regimes.

## When to try it
If you already have a set of internal FAQs, API specs, or design docs that you repeatedly reference in AI‑assisted tools, spin up a Sources library on a small test team. Monitor response relevance and latency for a week; if the improvements outweigh any cost or compliance overhead, consider rolling it out more broadly. Watch for a pricing announcement and any enterprise‑grade security add‑ons before scaling.