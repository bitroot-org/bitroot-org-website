---
date: '2026-07-18'
excerpt: A Chinese developer published a fully local, Apache 2.0‑licensed badminton
  Hawk‑Eye pipeline with code, model weights, and a zero‑cost deployment option.
image: https://pbs.twimg.com/amplify_video_thumb/2078329244912914432/img/TZCsjCJe1q3rgi-9.jpg
published_at: '2026-07-18T10:13:07.429677+00:00'
sources:
- https://x.com/0xTria/status/2078329275065696557
tags:
- computer vision
- sports analytics
- open source
title: Open-source badminton Hawk‑Eye system released by Chinese developer
video: media/2026-07-18-open-source-badminton-hawkeye-system-released-by-c.mp4
---

A Chinese developer just released an open‑source badminton Hawk‑Eye system, with the complete pipeline and model weights available on GitHub under an Apache 2.0 license. The repository is free to clone and run locally, requiring no cloud services.

## Architecture at a glance
The stack stitches together several existing models: RTMPose or YOLO‑Pose for dual‑player skeleton extraction, a custom YOLO detector for shuttle tracking, and a court‑keypoint homography that maps detections onto a standard court layout. From there it segments rally start/end, computes distance, live speed, max speed, rally count, and renders a stats panel with heatmaps and a mini‑court map.

## Zero‑cost deployment
All components run on‑premises, so there are no API fees or subscription tiers. The tweet announcing the release notes "this repo: $0" and that the weights are hosted alongside the code. For startups that already have GPU‑enabled servers, the only expense is the compute time needed for inference.

## Limitations to watch
The pipeline relies on accurate pose estimation; occlusions or poor lighting can cause false positives in shuttle detection. The homography assumes a standard court geometry, so venues with non‑standard markings may need manual calibration. Because the project is community‑driven, documentation is sparse and there is no official support channel, which could increase integration time.

## When to try it
If your product needs live badminton analytics—e.g., a coaching app or a venue‑level broadcast overlay—prototype with the repo now and benchmark inference latency against your hardware. Monitor the project's issue tracker for updates and be prepared to contribute fixes if you encounter edge cases. For teams without GPU resources, consider a cloud GPU trial before committing to on‑prem deployment.

[Original tweet](https://x.com/0xTria/status/2078329275065696557)