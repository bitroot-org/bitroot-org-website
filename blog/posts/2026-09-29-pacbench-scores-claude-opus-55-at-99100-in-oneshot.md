---
date: '2026-09-30'
excerpt: 'PacBench: how well a model and harness can recreate Pac-Man from a single prompt.'
image: 'null'
published_at: '2026-09-29T15:16:58.621304+00:00'
sources:
- https://jonclegg.github.io/pacman-bakeoff/
tags:
- 'ai benchmark'
- 'pac-man'
- 'large language model'
title: 'PacBench scores Claude Opus 5.5 at 99/100 in one‑shot Pac‑Man test'
---

The PacBench benchmark released its first public bake‑off, showing Claude Opus 5.5 achieving a 99 / 100 score on a one‑shot Pac‑Man implementation at a cost of $1.99 per run.

## How PacBench works
[PacBench](https://jonclegg.github.io/pacman-bakeoff/) runs a 90‑second automated play test followed by a source‑code and maze audit. Scores are out of 100, divided into Controls (20), Ghosts (25), Pac‑Man stuck (20), Maze (20) and Sound (15). The test checks for swipe controls, arcade‑accurate ghost behavior, no dead‑ends, and a two‑phrase audio intro with continuous siren.

## Claude Opus 5.5 results
Claude Opus 5.5 earned 99 / 100, missing only a single point in the "Pac‑Man stuck" sub‑score. The run took 9 minutes 17 seconds of wall‑time, generated 61 k output tokens, and performed 36.9 k thinking steps. The total cost recorded was $1.99. The HTML payload of the generated game was 10.8 KB.

## Limitations and cost considerations
The score is assigned by Opus 5.5 reviewing the live games on the site, not by an independent oracle, so the evaluation reflects the reviewer model’s judgment rather than a ground‑truth metric. The page only lists a per‑run cost of $1.99; broader pricing tiers or bulk discounts are not disclosed.

## When to try PacBench
If your startup is already experimenting with code‑generation LLMs and needs a concrete, domain‑specific success metric, a single Pac‑Man bake‑off run can give a quick sense of model capability without a large budget. Keep an eye on future releases for additional models and any announced pricing changes.
