---
date: '2026-09-25'
excerpt: The voice-first physical AI interface for modern productivity — push-to-talk
  dictation into any app, replies from your agents, and rate limits right on the glass.
image: https://bitroot.org/blog/media/2026-09-25-zeph-ships-25-diy-voicefirst-ai-desk-companion.png
published_at: '2026-09-25T14:21:11.171169+00:00'
sources:
- https://zephclick.com
tags:
- voice interface
- hardware
- ai assistants
- productivity
title: Zeph ships $25 DIY voice‑first AI desk companion
---

Zeph announced a DIY hardware companion priced around $25 that puts a press‑to‑talk button on your desk and lets you interact with AI agents without a laptop mic or hotkey. The first units ship with an AMOLED 2.16" Waveshare ESP32‑S3 board and run firmware version v0.16.5.

## A physical shortcut for AI agents
The device sits on your workspace and captures voice input system‑wide, sending the transcript to any integrated agent such as Claude, Google Gemini, GitHub Copilot, Cursor, Perplexity, Notion, or Ollama. A glance at the glass‑panel shows real‑time signals like rate‑limit usage or CI status, letting you approve a deploy or answer a stand‑up prompt with a single press.

## Local‑first privacy model
Zeph defaults to on‑device processing: audio and state stay encrypted locally, and no cloud round‑trip is required unless you bring your own model (BYOK) or opt into a cloud service. This private‑plus approach is highlighted on the product page as a core design choice.

## Open SDK for custom WASM apps
Developers can ship sandboxed WebAssembly apps to the Zeph ecosystem using a single SDK that runs on every Zeph board. The SDK is portable across current and future hardware revisions, meaning a custom glance or voice command you write today will work on the 1.8" or 2.16" models without changes.

## Caveats to consider
The website does not publish detailed pricing beyond the approximate $25 figure, nor does it list shipping limits or warranty terms; purchases are routed through third‑party stores, which may affect delivery speed and support. Additionally, the device’s capabilities are confined to the agents listed on the site, so integration with proprietary internal tools will require custom SDK work.

## When to try it
If your startup already uses voice‑enabled AI agents and you’re looking for a cheap, on‑desk way to cut typing friction while keeping data local, ordering a Zeph unit now can give you a tangible testbed before scaling to a team‑wide rollout. Keep an eye on the upcoming “fleet” features for bulk provisioning and SSO support.

[Zeph product page](https://zephclick.com)