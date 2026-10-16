---
date: '2026-10-04'
excerpt: The ESP-SDR firmware turns the ESP32 into a native Software-Defined Radio
  (SDR) using the chip's built-in radio without additional hardware.
image: https://bitroot.org/blog/media/2026-10-04-esp32-firmware-adds-native-245-ghz-sdr-capability.jpg
published_at: '2026-10-04T14:32:34.266012+00:00'
sources:
- https://www.cnx-software.com/2026/10/04/esp-sdr-firmware-turns-esp32-into-a-2-4-5-ghz-software-defined-radio-sdr/
tags:
- esp32
- sdr
- firmware
title: ESP32 firmware adds native 2.4/5 GHz SDR capability
---

ESP‑SDR firmware bypasses the ESP32’s Wi‑Fi/BLE modem and streams raw I/Q samples over USB or UART, supporting dual‑band 2.4 GHz (2.2‑2.7 GHz) and 5 GHz (4.8‑6.0 GHz) on chips such as the ESP32‑C5. The project is open‑source and was announced in a recent CNX Software article[link](https://www.cnx-software.com/2026/10/04/esp-sdr-firmware-turns-esp32-into-a-2-4-5-ghz-software-defined-radio-sdr/).

## How the firmware works
The code taps a debug I/Q sampling path left in the silicon, configures special registers, and writes raw I/Q data directly into internal SRAM. A ring buffer moves these samples to the host computer, where the browser‑based ESP‑WebSDR tool visualises the spectrum and waterfall in real time. Flashing the firmware can also be done from Chrome or Edge.

## Supported chips and performance
The firmware runs on a wide range of ESP32 variants: ESP32, ESP32‑C3, ESP32‑C5, ESP32‑C6, ESP32‑C61, ESP32‑S2, ESP32‑S3, and the preview ESP32‑S31. Sample rates reach up to 80 MSa/s, yielding roughly 2.56 Gbps of raw data and a usable bandwidth of 13‑54 MHz depending on the chip. On‑chip FFT can compress data by sending only spectrum points instead of full I/Q streams.

## Practical limits to consider
USB and UART cannot sustain the full 2.56 Gbps, so ESP‑WebSDR captures short I/Q snapshots and may miss transient signals between windows. Continuous high‑throughput streaming is only available on the ESP32‑S31 via the experimental SoapyESPSDR, which streams 8‑16 MSa/s over Gigabit Ethernet to GNU Radio or Gqrx. The article does not list any pricing for the firmware itself, and the hardware cost is roughly under $5 for a compatible ESP32 board.

## When to try it
If you need occasional spectrum snapshots for 2.4 GHz or 5 GHz hobby projects and want to avoid buying a separate RTL‑SDR dongle, flashing ESP‑SDR on a cheap ESP32 board is a low‑cost experiment. Keep an eye on the SoapyESPSDR roadmap for full‑rate streaming support before using it in production‑grade RF monitoring.