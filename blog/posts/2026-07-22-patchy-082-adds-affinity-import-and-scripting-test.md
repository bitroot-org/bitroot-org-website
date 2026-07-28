---
date: '2026-07-22'
excerpt: Patchy 0.82 brings Affinity Designer (.af) import and a new breakout test
  inside layered images, with builds for Windows, macOS, and Linux.
image: https://pbs.twimg.com/ext_tw_video_thumb/2079761693270253569/pu/img/NPDG_lAtWAUCWx7T.jpg
published_at: '2026-07-22T10:59:49.283047+00:00'
sources:
- https://x.com/rtsoft/status/2079761713381970211
tags:
- patchy
- image editing
- open source
title: Patchy 0.82 adds Affinity import and scripting test
video: media/2026-07-22-patchy-082-adds-affinity-import-and-scripting-test.mp4
---

Patchy 0.82 was released today, adding native import support for Affinity Designer files (.af) and a new breakout test that runs directly inside a layered image. Windows, macOS, and Linux binaries plus source are available on the project's GitHub page.

## New capabilities
The most visible addition is the ability to open *.af* files, which lets designers bring Affinity assets into Patchy without conversion. The release also ships an "included test" that demonstrates the scripting engine by rendering a breakout animation inside a layered document. Both features are bundled in the same installer, keeping the upgrade path simple.

## Practical impact for startup engineers
If your product includes an internal image‑processing pipeline, Patchy can now serve as a drop‑in for Affinity assets, reducing the need for custom parsers. The scripting test doubles as a quick sanity check for your own automation scripts; you can drop it into a CI step to verify that the interpreter behaves as expected across platforms.

## Caveats and trade‑offs
Patchy remains a niche, community‑driven tool. The Affinity import is still marked as "experimental" and may miss newer .af features, so expect occasional rendering quirks. Documentation is sparse, and the UI is minimal, which can increase onboarding time for teams unfamiliar with the codebase. Additionally, the binary sizes are larger than a pure‑CLI solution, which could affect container image layers.

## When to give it a try
If your startup already consumes Affinity assets or you need a lightweight scripting sandbox for image layers, spin up a short‑lived container with the latest binary and run the provided test script as part of your build pipeline. For teams without Affinity dependencies, monitor the project for a more mature release before adopting it in production.

[Patchy on GitHub](https://github.com/SethRobinson/Patchy) • [Announcement tweet](https://x.com/rtsoft/status/2079761713381970211)