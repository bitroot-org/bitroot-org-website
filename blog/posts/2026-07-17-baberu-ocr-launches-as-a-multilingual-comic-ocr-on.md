---
date: '2026-07-17'
excerpt: フルスクラッチで作った日本語・中国語・英語の漫画用マルチリンガルOCR「Baberu OCR」を簡単にさわれるようHuggingface Spacesに公開しました！ぜひ遊んでみてください！
image: https://pbs.twimg.com/media/HNZ_4vjaoAEai85.jpg?name=orig
published_at: '2026-07-17T10:39:25.439123+00:00'
sources:
- https://x.com/daichi_genshiai/status/2077989874398032361
tags:
- ocr
- multilingual
- huggingface
title: Baberu OCR launches as a multilingual comic OCR on Huggingface Spaces
---

GENSHI AI’s CEO announced the public release of **Baberu OCR**, a multilingual OCR tuned for manga and comics in Japanese, Chinese, and English. The model is hosted on a free Huggingface Space, so anyone can try it with a web UI and API endpoint.

## What Baberu OCR actually does
The service extracts text bubbles from scanned comic panels and returns plain‑text strings in the source language. It was built from scratch, meaning the training data and architecture are not tied to a third‑party OCR provider. For developers, the UI offers a drag‑and‑drop area; the backend returns JSON with bounding boxes and language tags.

## Cost and accessibility
Huggingface Spaces are free for low‑traffic demos, so the public demo incurs no direct cost. If you fork the Space and run it on your own compute, you’ll pay whatever your cloud provider charges for the GPU instance. The repo (if released) would let you self‑host without a subscription to a commercial OCR API.

## Trade‑offs and limitations
While the three‑language support is handy for East‑Asian comic pipelines, the model’s accuracy on dense text or stylized fonts still lags behind specialized OCRs like Google Cloud Vision. False positives on decorative lettering are common, so you’ll likely need a post‑processing step to filter noise. Also, the demo runs on shared hardware; heavy usage can hit rate limits or slow response times.

## When to give it a spin
If your startup processes user‑generated manga or wants a quick prototype for multilingual speech‑bubble extraction, try the public Space now. Keep an eye on the repo for future language additions and on Huggingface’s usage policies, as any change in free tier limits could affect reliability.

---
Sources: [Tweet announcing Baberu OCR](https://x.com/daichi_genshiai/status/2077989874398032361)