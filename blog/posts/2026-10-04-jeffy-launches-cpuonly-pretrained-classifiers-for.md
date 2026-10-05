---
date: '2026-10-04'
excerpt: Pretrained text classifiers you can run and retrain on CPU - nicobrenner/jeffy
image: https://bitroot.org/blog/media/2026-10-04-jeffy-launches-cpuonly-pretrained-classifiers-for.png
published_at: '2026-10-04T14:31:51.350826+00:00'
sources:
- https://github.com/nicobrenner/jeffy
tags:
- local ml
- pretrained classifiers
- cpu inference
title: Jeffy launches CPU‑only pretrained classifiers for local use
---

Jeffy released its first version (v0.1.0‑alpha.12) on GitHub, offering 16 pretrained classifiers that run entirely on a CPU. The first prediction pulls a 1.2 GB sentence encoder (bge-large-en-v1.5) and then answers in ~50–80 ms per request【https://github.com/nicobrenner/jeffy】.

## Quick start & performance
Install with the recommended `uvx` command, launch the server with `jeffy-serve`, and hit the local endpoint `http://localhost:8400/v1/predict` to classify text. A sample call for the banking intent classifier returns a label and a confidence of 0.999 in under a tenth of a second. The package itself is only 1.5 MB; the heavy encoder is cached after the first download, keeping subsequent inferences fast and memory‑light (~2 GB total).

## Built‑in catalog
The shipped heads cover common tasks: spam detection, news topic, sentiment, banking intents, and even a Doom game‑state decision model. Test accuracies range from 90 % (ag_news) up to 100 % (doom_fire) on held‑out splits. Each classifier’s manifest lists its source dataset, license, and test metrics, providing transparency for compliance teams.

## Custom training & deployment
Beyond the defaults, you can train a new head from a CSV, TSV, or JSONL file using `jeffy-train`. The tool reports a split‑test accuracy (e.g., 100 % on a 24‑example demo) and saves the model to a directory that can be served with `JEFFY_PACK_DIR=my_models uvx jeffy-serve`. The API remains the same—just POST JSON to `http://localhost:8400/v1/predict` with your custom `task` identifier.

## Caveats
Jeffy does not provide zero‑shot or LLM fallback; every task requires a trained head, and unknown tasks return an error. Some models, such as SNLI (65.6 % accuracy) and tweet sentiment (66.2 %), fall short of task‑specific baselines. There is also no hosted service—everything runs locally, and the public playground is only a demo, not a production endpoint.

**When to try it** – If your startup needs a lightweight, privacy‑preserving text classifier and can tolerate the lack of zero‑shot capabilities, spin up Jeffy on a dev box and experiment with the built‑in heads before committing to a custom model.