---
date: '2026-09-29'
excerpt: E-paper shopping list for the M5Stack PaperMono, with a FastAPI server and
  phone web UI - seamusc/papermono-shopping-list
image: https://bitroot.org/blog/media/2026-09-29-papermono-turns-an-eink-fridge-magnet-into-a-synce.png
published_at: '2026-09-29T15:17:19.556894+00:00'
sources:
- https://github.com/seamusc/papermono-shopping-list
tags:
- e-ink
- iot
- fastapi
title: PaperMono turns an e‑ink fridge magnet into a synced shopping list
---

The new **PaperMono Shopping List** project ships firmware for the M5Stack PaperMono, a 3.97" ESP32‑S3 e‑paper touchscreen, turning the device into a fridge‑mounted shopping list that stays in sync with a phone‑hosted web UI. The repo provides a complete 2,400‑line C++ firmware and a FastAPI + SQLite server, both under GPL‑3.0.

## How the UI works on e‑ink
The UI uses fast partial screen updates for taps, scrolling, and typing, forcing a full refresh after every ten partial updates to curb ghosting. An on‑screen keyboard redraws only changed parts and suggests previously added items. All touch interactions – tap, swipe, side buttons – work without noticeable lag, despite the e‑ink medium.

## Sync and power strategy
Wi‑Fi is enabled only during sync events: on a schedule you set in the phone UI, when you tap the screen and the last sync is over five minutes old, or immediately after an edit. Edits queue on the device’s flash until the next sync, letting the list function fully offline. Power‑button shutdown triggers a deep‑sleep fallback, and the device powers off automatically at a safe battery voltage, with the front‑light disabled by default.

## Server side and optional AI sorting
The companion server runs a FastAPI service with a SQLite store and a simple web UI. New items can be sent to Claude via the optional **Claude Code CLI** for automatic aisle classification; this feature is disabled by default (`SHOPPING_LIST_CLASSIFIER=none`). All communication is plain HTTP, and the server expects to run on a LAN or behind a reverse proxy, as it has no built‑in authentication.

## Limitations to consider
The project is a personal hobby effort running on a single PaperMono C153 at the author’s home. There is no on‑device Wi‑Fi credential provisioning – credentials are compiled into the firmware – and the server lacks authentication, so it should not be exposed to the public internet. These constraints mean the solution is best suited for a trusted home network and for makers comfortable flashing firmware.

## When to try it
If you already have a PaperMono or are budgeting for a low‑cost e‑ink display, clone the repo, follow the quick‑start steps, and evaluate the offline‑first experience in your own kitchen. Keep an eye on the repository for any added authentication features or broader hardware support before deploying in a shared environment.