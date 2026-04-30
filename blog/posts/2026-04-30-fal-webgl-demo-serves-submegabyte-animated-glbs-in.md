---
date: '2026-04-30'
excerpt: A new Fal‑powered WebGL demo shows how to turn AI‑generated images into animated
  GLB assets under 1 MB, using a fully static front‑end.
image: https://pbs.twimg.com/amplify_video_thumb/2049776252043800577/img/qiP2OE9xXmEWsuHh.jpg
published_at: '2026-04-30T20:25:55.177126+00:00'
sources:
- https://x.com/i/status/2049836416289407133
tags:
- fal
- webgl
- 3d pipeline
title: Fal WebGL demo serves sub‑megabyte animated GLBs in seconds
video: media/2026-04-30-fal-webgl-demo-serves-submegabyte-animated-glbs-in.mp4
---

Fal announced a WebGL showcase that delivers fully rigged GLB models between 400 KB and 800 KB after a 95 % size reduction, with baked animation and a looping background video generated in under ten seconds.

## From prompt to 3‑D model
The pipeline starts with a text‑to‑image model—either GPT‑Image‑2 or the FLUX.2 Klein 9B variant—for live "create your own" characters. The output image feeds into **meshy v6** which produces a rigged GLB and bakes the animation. A second pass on the same character generates a companion creature image, color‑locked to the original palette, which is turned into a static GLB without rigging.

## Texture and environment generation
Fal’s **PATINA** component extracts base‑color, normal, roughness, and metalness maps from the character image. These maps are used to create a per‑character floor that matches the surrounding environment, keeping the visual style coherent without manual texturing.

## Asset compression and front‑end
All assets run through **gltf‑transform**: resized to a 1024 px bounding box, compressed to WebP (quality 80), and Draco‑encoded, achieving roughly a 95 % reduction in file size. The front‑end is a single static `index.html` built with Three.js, featuring a marble disc with a displacement‑mapped plane, mirrored reflections, breathing companion animations, and CSS‑based palette swaps on click.

## Caveats and cost considerations
The tweet notes that the displayed metrics are decorative, so real‑world performance may vary. The workflow depends heavily on Fal’s proprietary services, and pricing is not disclosed in the announcement, which could affect feasibility for tight budgets. Additionally, aggressive compression may introduce visual artifacts, and the static front‑end limits dynamic content without rebuilding.

**When to try:** If your startup needs a fast way to prototype AI‑generated avatars with low‑bandwidth delivery, clone the [Claude Code skill](http://github.com/fal-ai-community/skills/blob/main/skills/claude.ai/fal-regenerate-3d/SKILL.md) and run a small test against your own assets. Watch the original announcement on [X](https://x.com/i/status/2049836416289407133) for updates on pricing and feature extensions.