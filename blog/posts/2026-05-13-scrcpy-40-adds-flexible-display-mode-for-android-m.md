---
date: '2026-05-13'
excerpt: "scrcpy 4.0 is out \U0001F680\n\nTry the new flex display feature (and more):
  https://github.com/Genymobile/scrcpy/releases/tag/v4.0"
image: https://pbs.twimg.com/amplify_video_thumb/2054463118177116160/img/8Xiqdw9phqhc-lHC.jpg
published_at: '2026-05-13T14:36:27.083950+00:00'
sources:
- https://x.com/i/status/2054463213022929032
tags:
- android mirroring
- open source
- screen casting
title: scrcpy 4.0 adds flexible display mode for Android mirroring
video: media/2026-05-13-scrcpy-40-adds-flexible-display-mode-for-android-m.mp4
---

scrcpy 4.0 was released today, adding a **flex display** option that lets you change the resolution of the mirrored Android screen on the fly — no need to stop and restart the session. The announcement came via a tweet that links to the full changelog on GitHub [scrcpy 4.0 release](https://github.com/Genymobile/scrcpy/releases/tag/v4.0).

## Flexible display without interruption
The flex display mode works by adjusting the virtual display size via ADB commands, which the client then renders at the new dimensions. For developers who test UI layouts on multiple screen sizes, this means a single device can simulate several form factors in one session, cutting down on plug‑and‑play cycles.

## Zero cost, but hardware still matters
scrcpy is open source and free, so there’s no licensing fee to adopt it. However, the real‑time encoding still depends on the host CPU and the device’s hardware encoder. On older phones or low‑end laptops you may see higher latency or dropped frames when scaling up the display size.

## Caveats and false‑positive signals
The new feature only works on Android 5.0+ and requires ADB 1.0.41 or newer. Some users report that rapid size changes can cause temporary flicker, which could be mistaken for UI bugs in automated tests. Also, because the tool streams over USB or Wi‑Fi, network instability can introduce additional jitter.

## When to try it in your pipeline
If your startup’s QA process includes responsive‑design verification on Android, enable the flex display in a staging branch and run a quick smoke test on a single device. Watch for CPU usage spikes and verify that your CI runners have enough headroom. If the performance hit is acceptable, roll it out to the full test suite.

**What to watch:** Keep an eye on the project's GitHub issues for any regressions related to the flex mode, and plan a fallback to the classic fixed‑size mode for devices that don’t meet the encoder requirements.