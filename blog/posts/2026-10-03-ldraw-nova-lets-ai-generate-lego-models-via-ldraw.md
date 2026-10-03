---
date: '2026-10-03'
excerpt: Agent tooling for generative LEGO models building, built with Astra and Opus
  5.5, powered by Jev - anteloc/ldraw-nova
image: https://bitroot.org/blog/media/2026-10-03-ldraw-nova-lets-ai-generate-lego-models-via-ldraw.png
published_at: '2026-10-03T14:06:19.646834+00:00'
sources:
- https://github.com/anteloc/ldraw-nova
tags:
- lego
- ai
- open-source
- generative-models
title: ldraw-nova lets AI generate LEGO models via LDraw language
---

The open‑source project **ldraw-nova** hit version v0.6.0, adding a Docker‑wrapped web app that lets AI agents turn a free‑form prompt into a complete LDraw LEGO© model. The app serves the UI at `https://localhost:8443` (or `http://localhost:8765` for plain HTTP) and can stream results to a Meta Quest 3 for VR preview.

## How the pipeline works
The agent receives a natural‑language prompt, reads the bundled `instructions.md` and other reference docs, then plans the build. It iteratively renders images, checks collisions and gaps, and refines placement until it deems the model finished. The final artefacts include the raw LDraw source, a Blender‑editable glTF (`.glb`) file, a 3‑D viewer/player, and the full chat history. Under the hood, the agent uses **jev‑rerank**, a semantic search tool backed by TypeSafe’s Jev System One model. Supplying a `TYPESAFE_API_KEY` enables re‑ranking; without it the system falls back to a basic full‑text search, which can degrade model quality.

## Getting it running
1. Clone both repositories at the matching tag:
   ```bash
   git clone --branch v0.6.0 https://github.com/anteloc/ldraw-nova.git
   git clone --branch v0.6.0 https://github.com/anteloc/ldraw-nova-docker.git
   ```
2. Build the Docker image (first build needs ~5 GB disk space):
   ```bash
   cd ldraw-nova-docker
   docker compose build
   ```
3. Launch the service with `docker compose up -d` and open the UI in a browser.

The setup requires only Git and Docker, and the app runs without authentication – so you should restrict network access to trusted devices.

## Trade‑offs and current limits
* **Performance** – The generation loop is slow, especially on low‑end models. Only high‑end LLMs (e.g., GPT‑6 Astra, Claude Opus 5.5) reliably produce large, correct models.
* **VR support** – The Quest 3 view suffers from performance and handling issues; it is listed as a known problem.
* **Pricing** – The tool itself is free and open source, but the optional Jev re‑ranking incurs cost via the TypeSafe API key.
* **Scope** – Current model families (humans, animals, Technic machines, spaceships) vary in quality; spaceships are noted as “not very good.”

## When to try it
If your startup already experiments with LLM‑driven design and you have Docker expertise, spin up ldraw‑nova on a dev machine to prototype LEGO‑style visualizations or generate quick mock‑ups for packaging concepts. Keep expectations modest until the performance and VR bugs are addressed.