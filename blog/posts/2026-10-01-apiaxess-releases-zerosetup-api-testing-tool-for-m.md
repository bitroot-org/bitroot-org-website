---
date: '2026-10-01'
excerpt: An API security workbench for web and Android apps. Point a browser or an
  Android target at an app and its API surface lands in one session. Free and open
  source.
image: https://bitroot.org/blog/media/2026-10-01-apiaxess-releases-zerosetup-api-testing-tool-for-m.png
published_at: '2026-10-01T15:53:55.690813+00:00'
sources:
- https://apiaxess.dev
tags:
- api testing
- mobile
- security
title: Apiaxess releases zero‑setup API testing tool for mobile and web
---

Apiaxess 0.1.0 is now downloadable for Windows and Linux, with macOS coming soon, and its demo captures 2,481 flows and merges 128 endpoints from a sample Northwind app in a single session.

## Capture without preparation
The tool boots an Android emulator that already trusts its certificate, so you can install an APK and start sniffing traffic instantly. On the web side it launches an isolated Chromium profile that routes through the same proxy, leaving your regular browser untouched. The UI shows live traffic, e.g., a `POST /v1/cart/items` returning 201 in 53 ms, and you can pause, modify, or drop matching requests with an intercept toggle.

## Integrated workbench and export
Captured requests can be resent, fuzzed, or fed into a full‑blown Intruder‑type attack—all four attack types run without throttling. When you’re done, apiaxess can dump the recovered surface to OpenAPI 3.1, Postman collections, HAR files, or even a ready‑to‑run Python client, all from a single command. Endpoints are labeled as "confirmed" (live capture) or "inferred‑from‑code", and first‑party versus third‑party sources are distinguished.

## Open source, but no pricing details
Apiaxess is Apache‑2.0 licensed and its source is publicly visible, so you can audit the certificate handling and verify there is no telemetry. The site does not list any pricing tier or usage limits, so teams will need to test whether the free offering meets their scale needs before adopting it widely.

## When to try it
If your startup builds native Android apps or relies on web front‑ends and you need quick API surface discovery without fiddling with certificates or proxy configs, spin up the Windows binary and run it against a staging build. Verify the exported spec against your existing contracts, and only move to production once you’ve confirmed the captured endpoints cover your critical flows.