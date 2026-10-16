---
date: '2026-10-16'
excerpt: Sygal converts PDF, Word, Excel, images and web pages into clean Markdown
  and JSON, locally on your Mac or PC. One-time purchase, no subscription.
image: https://bitroot.org/blog/media/2026-10-16-sygal-launches-localfirst-documenttomarkdown-conve.png
published_at: '2026-10-16T13:40:24.135228+00:00'
sources:
- https://sygal.app
tags:
- document conversion
- markdown
- local-first
- ai tools
title: Sygal launches local‑first document‑to‑Markdown converter
---

Sygal announced a local‑first converter that transforms PDFs, Word files, spreadsheets, screenshots, web pages and even YouTube links into clean Markdown and structured JSON on‑device, priced at a €25 one‑time purchase with a 14‑day free trial.

## On‑device processing and OCR flexibility
The tool runs entirely on macOS 12+ or Windows 10+ and never uploads your original files. For images, scans or PDFs that need OCR, you supply your own API key to a provider of choice—OpenAI, Claude, Mistral, NVIDIA, Gemini or a custom service—so only the image data travels over the network. The rest of the conversion stays local, and the app includes a native preview that lets you edit the Markdown before exporting.

## Broad format support and unified output
Sygal handles 29 formats, including PDF, DOCX, XLSX, PPTX, HTML, CSV, EPUB, IPYNB, ZIP, various image types and URLs. Regardless of source, the result is a single, predictable Markdown file plus an optional JSON representation, which can be dropped straight into RAG pipelines, vector stores or AI agents. Token counts drop 2‑to‑7× compared with raw PDFs or screenshots, reducing LLM costs.

## Pricing model and CLI access
The launch offer is €25 for a licence covering two seats, with no recurring subscription, usage meter or telemetry. A 14‑day trial requires no credit card. For automation, Sygal provides a CLI (`npm install -g sygal-cli`) that outputs strict JSON suitable for orchestrators like Hermes or OpenClaw.

## What to watch before adopting
While the core conversion is local, OCR still sends image data to the provider you configure, so you must manage any associated API costs and ensure the provider’s privacy guarantees. The pricing page lists only the one‑time licence fee; OCR usage fees are not included.

**When to try**: If your startup builds AI‑augmented workflows that ingest heterogeneous documents and you need a single, privacy‑first step to produce token‑efficient Markdown, spin up the free trial and test batch conversion on a representative file set.