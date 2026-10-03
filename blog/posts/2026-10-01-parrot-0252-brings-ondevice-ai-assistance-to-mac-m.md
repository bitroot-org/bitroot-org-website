---
date: '2026-10-01'
excerpt: A meeting recorder for your Mac with a live AI assistant. Answers from your
  own documents, mid-call. Free and open source.
image: https://bitroot.org/blog/media/2026-10-01-parrot-0252-brings-ondevice-ai-assistance-to-mac-m.png
published_at: '2026-10-01T15:52:58.192198+00:00'
sources:
- https://openparrot.app
tags:
- meeting recorder
- ai assistant
- macos
title: Parrot 0.25.2 brings on‑device AI assistance to Mac meetings
---

Parrot 0.25.2 was released on 1 Oct 2026 for macOS 14+ on Apple Silicon (23 MB) and adds quieter transcripts and a live AI co‑pilot that can surface answers from your own documents while you talk. The app remains free and open‑source, with no account or telemetry required. [Parrot](https://openparrot.app)

## Live assistance works on the fly
Parrot watches for the start of any call—Zoom, Google Meet, Teams or even a speaker‑phone—and offers answer suggestions drawn from PDFs, text files or markdown you drop into its knowledge base. The assistant runs on your Mac, using Apple’s language models for indexing, and cites the source document for each reply. You can also switch the “brain” to Claude, OpenAI, Gemini, Ollama or other providers; only the transcript text (not audio) is sent to those services.

## Post‑call reporting and coaching
When the call ends, Parrot auto‑generates a summary, action items and a coaching panel that flags missed objections or low talk‑time balance. Each card links back to the exact transcript timestamp, so you can replay the line that triggered a suggestion. The report respects the profile you selected (sales discovery, interview, investor update, etc.) and can pull in custom vocabularies for accurate name recognition.

## Pricing and data‑flow transparency
All on‑device features—transcription via Whisper, speaker detection and document indexing—cost $0.00. If you enable a cloud model (e.g., Claude) for live cards, the UI shows a per‑hour charge of $0.06 for assistant cards and $0.01 for the post‑call report, totaling about $0.07 per hour of call time. You must provide your own API keys, and any text sent to the provider is logged in your Keychain, not stored by Parrot.

## Caveats to consider
The product does not list a free‑tier limit for cloud models; usage costs accrue as soon as you enable them, and the app does not hide those charges. Additionally, while audio never leaves the Mac, transcript snippets are transmitted to the selected AI provider, which may affect compliance for highly regulated environments.

**When to try it**: If your startup already uses an LLM like Claude or OpenAI and you need on‑device meeting notes without a separate recording bot, give Parrot a spin on a low‑stakes call and monitor the per‑hour token cost before scaling up.