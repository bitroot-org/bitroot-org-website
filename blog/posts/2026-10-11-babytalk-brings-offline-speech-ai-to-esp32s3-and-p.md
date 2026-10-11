---
date: '2026-10-11'
excerpt: Optimized ESP32-S3/P4 fully offline speech to text and text to speech system
  for Micropython and AtomVM, featuring a finetuned STT model for noisy environments,
  plus a data generation/field capture...
image: https://bitroot.org/blog/media/2026-10-11-babytalk-brings-offline-speech-ai-to-esp32s3-and-p.png
published_at: '2026-10-11T15:14:59.362408+00:00'
sources:
- https://github.com/tlack/babytalk
tags:
- esp32
- offline-ml
- speech
title: BabyTalk brings offline speech AI to ESP32‑S3 and P4
---

The BabyTalk library now lets ESP32‑S3 and ESP32‑P4 chips run full‑sentence English speech‑to‑text and optional text‑to‑speech entirely offline, using a 4‑bit Citrinet model that fits in 6 MB of flash and 84.5 KB of internal RAM.

## Running on the ESP32
BabyTalk ships firmware for three environments: C/ESP‑IDF, MicroPython v1.27.0, and AtomVM (Erlang/Elixir). The same engine reads 16 kHz PCM audio, extracts log‑mel features, runs the compressed Citrinet‑256 neural net, and outputs raw text (e.g., "what's the weather like today"). A wake phrase can be any string you type – the model scores its output against the phrase without a separate keyword model. Text‑to‑speech is optional and uses a [sanoTTS](https://github.com/Ampixa/sanoTTS) voice that turns the transcript into 24 kHz audio. The library supports popular boards such as the Waveshare ESP32‑S3‑CAM and ESP32‑P4‑WIFI6, but it requires at least 16 MB flash and 8 MB PSRAM (e.g., an "N16R8" module).

## Memory and speed trade‑offs
The 4‑bit speech model occupies 6 MB of flash and never copies itself into RAM; only a 0.2 MB slice is read while transcribing a 4‑second clip. Adding the nano TTS voice adds another 1.9 MB of flash. Both functions share a single 84.5 KB internal‑RAM block, which can be moved to PSRAM at a slight speed penalty. On an ESP32‑S3 the 4‑bit model transcribes 1 s of speech in about 0.35 s, while the ESP32‑P4 (with an 8‑bit model) can process 2 s of speech in 0.30 s, roughly 1.7× faster. The optional weight cache improves latency but consumes ~6 MB of PSRAM, limiting clip length.

## When to try BabyTalk
If your product needs voice input on a battery‑powered edge device, must keep audio private, or operates in environments without Wi‑Fi, BabyTalk offers a fully offline solution that avoids cloud latency and data‑usage costs. It works well for English commands and short conversational replies, and the MIT‑licensed code can be extended with custom models via the provided fine‑tuning scripts.

## Cautions
The library is English‑only and its word‑error rate rises to 8.2 % on clean speech for the 4‑bit model, higher in noisy settings. Accuracy is lower than cloud services such as Whisper, and the hardware requirements (16 MB flash, 8 MB PSRAM) rule out smaller ESP32 variants.

**What to watch:** the next release plans larger vocabularies and multilingual models; keep an eye on the repo for those updates before committing to a production build.