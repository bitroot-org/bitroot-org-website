---
date: '2026-07-18'
excerpt: A new open‑source utility converts any phone‑recorded video into a 996k‑point,
  60 fps walkable 3D scene that runs entirely on your GPU, with no cloud dependence.
image: https://pbs.twimg.com/amplify_video_thumb/2078311452012847104/img/9MH3xfRXdaHzSPNE.jpg
published_at: '2026-07-18T10:12:25.524236+00:00'
sources:
- https://x.com/0x0SojalSec/status/2078311540282012024
tags:
- 3d reconstruction
- open-source
- mobile
title: Open-source tool turns phone video into a local 3D walkable world
video: https://video.twimg.com/amplify_video/2078311452012847104/vid/avc1/2940x1846/sANthlRyS6_BusGx.mp4?tag=29
---

An open‑source project announced on X can ingest a handheld MP4 video and output a 996 k‑point, 60 fps walkable 3D world that runs 100 % locally on a GPU, with no cloud services involved. The tool works with any phone video and can render the result in a Minecraft‑style or photorealistic view.

## How it works
The pipeline takes a video of you walking through a space, extracts frames, and runs a depth‑estimation model to build a dense point cloud. The point cloud is then optimized into a mesh that can be navigated at real‑time frame rates. Because all processing happens on the local GPU, latency is minimal and privacy is preserved.

## Performance and hardware limits
The demo runs at 60 fps on a recent consumer‑grade GPU (e.g., an RTX 3060). Older or integrated graphics may drop below real‑time, and memory consumption scales with video length and scene complexity. Expect the 996 k‑point output to occupy several hundred megabytes of VRAM during rendering.

## Trade‑offs and cautionary notes
While the tool produces coherent scenes, it can generate noisy points in low‑texture areas or rapid motion, leading to occasional gaps in the mesh. The current implementation does not support dynamic objects, so moving people or pets may appear as artifacts. Additionally, the open‑source license and lack of commercial support mean you’ll need to maintain the code yourself for production use.

## When to try it
If your startup needs rapid prototyping of indoor navigation or AR experiences and you have access to a decent GPU, cloning the repo and feeding a short walkthrough video is a low‑cost way to get a usable 3D environment. Watch for updates on the project's GitHub for performance optimizations and support for larger scenes. For the initial announcement, see the [tweet](https://x.com/0x0SojalSec/status/2078311540282012024).