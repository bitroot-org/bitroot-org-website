---
date: '2026-07-21'
excerpt: Baidu’s Unlimited-OCR model can process whole 100‑page PDFs locally with
  a 32K context window, offering a free alternative to cloud OCR services.
image: https://pbs.twimg.com/amplify_video_thumb/2079433693265833984/img/QDmtJh7IOXQoBavt.jpg
published_at: '2026-07-21T10:59:05.160906+00:00'
sources:
- https://x.com/AlexMurdock5499/status/2079433722252657068
tags:
- ocr
- open source
- local ai
title: 'Unlimited-OCR open‑source: 3B model reads 100‑page PDFs in one pass'
video: media/2026-07-21-unlimited-ocr-opensource-3b-model-reads-100page-pd.mp4
---

Baidu released Unlimited-OCR, a 3‑billion‑parameter model that can parse a 100‑page PDF in a single pass, thanks to a 32K token context window. The model is fully open source and runs locally via frameworks like Transformers, Ollama, or llama.cpp. [Unlimited-OCR](https://huggingface.co/baidu/Unlimited-OCR)

## How the model handles long documents

Unlike traditional OCR pipelines that split PDFs page‑by‑page, Unlimited-OCR feeds the entire document into a single forward pass. This preserves cross‑page context, which can improve entity extraction and table continuity. The multilingual tokenizer also supports dozens of languages out of the box, making it a handy component for document‑automation pipelines and Retrieval‑Augmented Generation (RAG) systems.

## Trade‑offs and limitations

The 32K context window comes at a memory cost: a GPU with at least 24 GB VRAM is recommended for reasonable latency on a 100‑page file. Accuracy is reported at 93 % on benchmark suites, which is strong but still leaves room for false positives, especially on complex layouts or low‑resolution scans. The model is free, but you’ll need to manage updates and security patches yourself.

## Cost comparison with cloud OCR

Commercial cloud OCR services charge per page or per character, often running $0.01–$0.05 per page after a free tier. Running Unlimited-OCR locally eliminates those recurring fees but adds infrastructure overhead. For startups that already provision GPUs for other AI workloads, the incremental cost can be near‑zero; for teams without GPU resources, the hardware expense may outweigh the savings.

## When to try it

If your stack already includes a GPU‑enabled inference server and you need to process large, multi‑page PDFs without losing context, spin up Unlimited-OCR on a test branch and benchmark latency against your current cloud provider. Watch for memory spikes and verify accuracy on your domain‑specific documents before replacing any production OCR component. [Alex Murdock's tweet](https://x.com/AlexMurdock5499/status/2079433722252657068)