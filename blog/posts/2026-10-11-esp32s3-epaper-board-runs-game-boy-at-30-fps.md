---
date: '2026-10-11'
excerpt: Enjoy the videos and music you love, upload original content, and share it
  all with friends, family, and the world on YouTube.
image: null
published_at: '2026-10-11T15:13:29.323585+00:00'
sources:
- https://www.youtube.com/watch?v=XiZmM6hwwAU
tags:
- esp32
- e-paper
- gameboy-emulator
title: ESP32‑S3 e‑paper board runs Game Boy at ~30 FPS
---

A maker released a short video showing a custom display driver for a Waveshare ESP32‑S3‑ePaper‑1.54 board that pushes the screen to about 30 display updates per second, enough to run a playable Game Boy emulator with four gray shades. The project uses an ESP32‑C3 with tactile switches and a 3‑D printed enclosure, and it stores ROMs on an SD card. The creator notes it took roughly a month of late‑night work to reach this state.

## Driving a normally slow display
E‑paper panels refresh by moving charged particles, which is why they are usually sluggish. The video walks through “shortening the waveform” and “per‑pixel driving” techniques that reduce the voltage‑hold time, allowing the panel to update faster. By tweaking the timing, the author achieved the 30 FPS target while still using the panel’s native four‑shade grayscale mode.

## Performance trade‑offs
The 30 FPS figure is impressive for e‑paper, but the approach has hidden costs. The video’s “FASTER… BUT AT WHAT COST?” segment suggests higher power draw and potential ghosting, although exact numbers aren’t provided. The driver is described as “vibe‑coded,” and the author admits that display drivers are not their area of expertise, which may affect stability in longer runs.

## Should you adopt it?
For startups looking for ultra‑low‑power, always‑on displays, this hack demonstrates a proof‑of‑concept rather than a production‑ready solution. The code base is hobby‑level, and there’s no mention of open‑source licensing, long‑term reliability, or integration tooling. If your product can tolerate a custom, experimental driver and you have the bandwidth to polish it, the demo could be a starting point. Otherwise, conventional LCD/OLED panels remain simpler to integrate.

**What to watch** – Keep an eye on the creator’s channel for any follow‑up releases that formalize the driver, add power‑consumption data, or provide a reusable library. Until then, treat the project as an interesting technical showcase rather than a drop‑in component.