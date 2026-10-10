---
date: '2026-10-09'
excerpt: Earlier this year I had the perfect excuse to experiment with some flexible
  LED filaments that had been sitting in my “interesting parts” bi...
image: https://bitroot.org/blog/media/2026-10-09-diy-flexible-neon-t-shirt-using-led-filaments.jpg
published_at: '2026-10-09T15:42:25.905552+00:00'
sources:
- http://scottbezek.blogspot.com/2026/10/making-flexible-neon-t-shirt-with-leds.html
tags:
- wearable
- hardware
- led
title: DIY flexible neon t-shirt using LED filaments
---

A maker turned a week‑long deadline into a wearable neon shirt by sewing flexible LED filaments onto a black tee and driving them with an ESP32, a USB battery bank, and a mix of boost and constant‑current drivers. The build used two 600 mm 12 V warm‑white strips, three 300 mm 3 V red strips, and a 1200 mm 24 V red strip sourced from [Adafruit](http://scottbezek.blogspot.com/2026/10/making-flexible-neon-t-shirt-with-leds.html).

## Stitch‑first design workflow
The creator first tested filament attachment on a piece of cross‑stitch fabric held in an embroidery hoop. By drawing the desired shape on tissue paper, tracing it onto the shirt, and sewing the filament with loop stitches, the path stayed taut and visible. For lettering, a small piece of heat‑shrink tubing was used to block off unwanted segments, mimicking the “blocked‑out” sections of traditional neon signs. When a single 300 mm filament was too short, three were soldered in series, leaving tiny dark gaps that blended into the design.

## Power and control stack
Each filament segment was soldered to enameled copper magnet wire, then to thin ribbon cables that ran to a 3D‑printed enclosure. An ESP32 generated PWM signals for flicker effects. The front‑text filaments (3 V) were driven by a TPS61169 constant‑current LED boost driver, while the back‑lamma filament (24 V) required a step‑up from the 5 V USB bank; a cheap constant‑voltage boost converter plus series resistors provided a stable supply. The warm‑white borders were under‑driven from 5 V using a ULN2003A transistor array, which the ESP32 also PWM‑dimmed.

## Cost snapshot and practicality
Adafruit filament costs more than comparable AliExpress parts, but the convenience of open‑source documentation may justify the premium for rapid prototypes. The remaining components—USB power bank, ESP32 breakout, boost converters, and basic sewing supplies—are typically under $50 total for a single shirt. No explicit pricing is listed in the source, so total spend will vary with part choices.

## Caveats and when to try it
The write‑up notes the shirt is not machine‑washable (or even hand‑washable) and was built for a one‑off event, so durability is limited. Also, the page provides no detailed pricing or supply‑chain guidance, which could affect scaling. If you need a quick visual demo or a hackable wearable for a hackathon, the approach is worth a try; for production‑grade wearables, you’ll need more robust encapsulation and tested power regulation.