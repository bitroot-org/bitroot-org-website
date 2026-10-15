---
date: '2026-10-10'
excerpt: 'Carrier settings from iPhone, Pixel and Galaxy firmware, decoded and compared:
  APNs, VoLTE, 5G and Wi-Fi Calling per carrier, and what each build changed.'
image: https://bitroot.org/blog/media/2026-10-10-carrier-explode-20-adds-api-and-daily-cc0-carriers.png
published_at: '2026-10-10T14:56:15.476492+00:00'
sources:
- https://carrierexplode.com/
tags:
- carrier settings
- api
- mobile
title: carrier-explode 2.0 adds API and daily CC0 carrier‑settings dataset
---

carrier‑explode 2.0 is live with a "much improved backend" and a public API that returns carrier‑settings data as JSON. The site lets you look up APNs, VoLTE, Wi‑Fi Calling and 5G flags for iPhone, Pixel and Galaxy firmware bundles, then compare any two carriers or firmware versions side‑by‑side.

## Quick data access
You can pull the entire daily dataset in CC0 format, or query individual carriers through the JSON API. The UI also offers a searchable list of carriers, showing recent version jumps like AT&T moving from 72.7.1 to 73.0 for iOS builds.

## Comparison tools
Select two carriers or firmware versions and the diff view highlights what changed—useful for spotting when a carrier adds or drops a feature flag. The built‑in wiki explains each field’s meaning, so you don’t have to reverse‑engineer the binary formats yourself.

## Open‑source contribution
The project is still "working on our decoders," and contributors are invited to improve coverage via the GitHub repo. Until the decoders are complete, some carriers may show missing or incomplete flags.

## Caveats
The announcement page does not list any pricing, rate limits, or SLA guarantees for the API, so you’ll need to treat it as an un‑guaranteed free service. Additionally, the decoders are a work in progress, meaning some carrier bundles may be partially parsed.

**What to watch** – If you need reliable, programmatic access to carrier‑settings for automated testing or feature‑flag validation, keep an eye on the repo for decoder updates and test the API limits before integrating it into a production pipeline.