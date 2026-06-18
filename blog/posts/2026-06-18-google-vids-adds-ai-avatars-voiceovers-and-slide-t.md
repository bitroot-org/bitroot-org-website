---
date: '2026-06-18'
excerpt: Google Vids now lets users turn Slides into videos with AI avatars and voiceovers
  in 24 languages. The beta is free but pricing and quality limits remain to be seen.
image: https://pbs.twimg.com/amplify_video_thumb/2067619336911831040/img/xTSx0rYPwTjeiJVB.jpg
published_at: '2026-06-18T18:11:59.599640+00:00'
sources:
- https://x.com/i/status/2067631530890113477
tags:
- video generation
- ai avatars
- google vids
title: Google Vids adds AI avatars, voiceovers, and slide-to-video conversion
video: media/2026-06-18-google-vids-adds-ai-avatars-voiceovers-and-slide-t.mp4
---

Google announced major enhancements to its Vids product, adding AI‑generated avatars, multilingual voiceovers and a one‑click slide‑to‑video conversion that now supports 24 languages, including Hindi, as shared in a recent [tweet](https://x.com/i/status/2067631530890113477).

## AI‑powered avatars and voiceovers
The update lets users pick from a library of pre‑built digital avatars or upload a photo to generate a custom likeness. Built‑in text‑to‑speech runs the script in the avatar’s mouth, producing a voiceover in any of the supported languages. The workflow is fully web‑based, so no local GPU is required. Teams can script product demos or onboarding tours, then export a shareable video without a video editor. The avatars are accessible via a simple REST endpoint, making it easy to embed in CI pipelines.

## Turn Slides into videos
With a single click inside a Google Slides deck, Vids renders each slide as a storyboard frame and stitches them together with the chosen avatar and voiceover. Users can select a target language, and the service automatically translates the slide text before synthesis. The generated video respects slide animations, so transition effects appear as cut‑scenes in the final clip. The resulting MP4 can be downloaded or shared directly from the Vids UI.

## Limitations and cost signals
The avatars currently sound best with short, scripted narration; longer, spontaneous dialogue can sound robotic. Language models are biased toward English, so translations may need manual polishing. Google has not published pricing, but the feature is gated behind the Vids beta, implying a potential shift to a paid tier later. Early adopters should also consider the lock‑in risk of storing assets only on Google’s platform. Because the service runs in the cloud, large decks may incur longer processing times, and there is no on‑premise option.

Pricing hint: the beta currently offers unlimited renders, but Google’s roadmap suggests a per‑minute charge for high‑volume users.

What to watch: try the slide‑to‑video flow on a low‑stakes internal demo this quarter and monitor the quality of the generated voiceovers before committing a product launch to the platform.