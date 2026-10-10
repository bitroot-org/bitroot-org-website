---
date: '2026-10-07'
excerpt: Sprout – a modern motherboard for old iPods.
image: assets/ipod-labels.svg?v=20260720-red
published_at: '2026-10-07T15:56:25.450725+00:00'
sources:
- https://certainthings.studio/sprout/
tags:
- iPod
- hardware
- retro
- mod
title: Sprout adds Bluetooth, Wi‑Fi and streaming to classic iPods
---

The team behind **Sprout** announced a drop‑in motherboard that converts an iPod mini, 3rd‑generation, or 4th‑generation iPod into a Bluetooth‑enabled, Wi‑Fi‑capable music player; the Pico version runs on a Raspberry Pi RP2350 and can address up to 2 TB via an SD‑C​ard.

## Two hardware flavors

- **Sprout Pico** – built around the RP2350 microcontroller. It adds Bluetooth audio, Wi‑Fi, a CS43131‑class Hi‑Fi DAC, and USB‑C digital audio out while keeping the original iPod case untouched.
- **Sprout Pi** – swaps in a Raspberry Pi Compute Module Zero on top of the Pico board. In addition to the Pico features it runs a full Linux stack, enabling Spotify/Apple Music streaming (when paired with a 2 TB SD card) and the ability to install custom apps.

## Plug‑and‑play with legacy iPods

Installation requires no soldering; the board simply replaces the original motherboard and connects to the existing remote connector via two GPIO pins. All original parts – screen, click wheel, battery – remain in place and can be restored later. Battery life targets 20 hours on the mini (1,200 mAh battery) and 40 hours on 3G/4G models (2,500 mAh battery) when streaming over Bluetooth.

## Supported formats and connectivity

Both variants decode MP3, AAC, ALAC, FLAC and Opus. Audio can be output through the built‑in 3.5 mm jack (Hi‑Fi DAC) or via USB‑C digital out. Wireless options include Bluetooth, standard Wi‑Fi, AirPlay, and (in development) Google Cast. The Pi version also exposes a Linux environment for developers to run arbitrary code.

## Cautionary notes

- The announcement does not include pricing or shipping timelines, so budgeting remains speculative.
- Streaming support depends on APIs that change frequently; the page notes that availability at launch may differ from the prototype.
- No official warranty or mass‑production guarantees are mentioned, which is typical for niche reverse‑engineering projects.

**When to try it** – If your startup has a hobby‑hardware budget and you need a quick, retro‑styled audio prototype, ordering a Sprout board (once price details emerge) could be a low‑effort way to test custom Linux apps on a familiar form factor. Keep an eye on the [Sprout](https://certainthings.studio/sprout/) site for price updates and final release notes.