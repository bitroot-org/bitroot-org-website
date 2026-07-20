---
date: '2026-07-20'
excerpt: ZeroPrep auto‑generates slide decks from live speech, adding near‑real‑time
  images, and the code is now open‑source on GitHub. It can shrink prep time for demo
  talks, but output quality varies with the source audio.
image: https://pbs.twimg.com/media/HNpVGoHbQAA_XzT.jpg?name=orig
published_at: '2026-07-20T11:37:34.661586+00:00'
sources:
- https://x.com/ramsri_goutham/status/2079069398267281715
tags:
- presentation
- automation
- open-source
title: ZeroPrep turns spoken talks into slide decks, now open source
---

ZeroPrep, the tool that won the OpenAI Codex Hyderabad hackathon, is now open‑sourced on GitHub. It takes a spoken presentation and spits out a full slide deck, complete with near‑real‑time generated images.

## How ZeroPrep builds a deck
ZeroPrep listens to a microphone or audio file, runs the transcript through a language model, and formats the result into markdown‑based slides. It then calls an image generation model to create visuals that match the slide titles, stitching them into the final deck. The pipeline runs locally, so no cloud quota is consumed beyond the model calls.

## What you get for free
The repository ([ZeroPrep](https://github.com/ramsrigouthamg/zeroprep)) is MIT‑licensed, so you can clone, modify, and ship it without licensing fees. There is no paid tier; the only cost is the compute you provision for the language and image models, which can be run on a modest GPU or via hosted APIs if you prefer.

## Caveats and trade‑offs
The generated images are created “near real‑time,” but latency can spike on large prompts or slow internet, making live demo use jittery. Transcript accuracy heavily influences slide quality—background noise or fast speech can produce vague or irrelevant bullet points. Because the tool relies on external AI APIs for image synthesis, you remain dependent on those services' rate limits and pricing.

## When to try it
If you’re preparing a technical demo or internal lightning talk and want to skip slide design, clone the repo and run a short test run on a recorded rehearsal. Watch the output for mismatched visuals, and be ready to edit the markdown before the final presentation. For production‑level decks, treat ZeroPrep as a first draft generator rather than a finished product.

*What to watch*: upcoming updates may add better speaker diarization and offline image models, reducing API lock‑in and latency.