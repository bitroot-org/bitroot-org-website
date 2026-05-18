---
date: '2026-05-18'
excerpt: shadcn/ui now includes a complete design‑system package—tokens, component
  definitions, and Figma import—distributed via its CLI. Engineers can pull a ready‑made
  system into any Tailwind project.
image: https://pbs.twimg.com/amplify_video_thumb/2056372181894926336/img/Sku8MNN6X8Et04te.jpg
published_at: '2026-05-18T18:28:03.748951+00:00'
sources:
- https://x.com/i/status/2056372444751909212
tags:
- design system
- tailwind
- cli
title: shadcn/ui ships a full design‑system CLI
video: media/2026-05-18-shadcnui-ships-a-full-designsystem-cli.mp4
---

shadcn/ui announced a "Complete Design Systems" solution that ships with the shadcn/ui CLI, exposing base and component tokens, custom token names, and Figma import support. The release follows the DTCG standard and works with any Tailwind‑compatible property.

## What the package contains
- **Base Tokens** and **Component Tokens** that map directly to Tailwind utilities.
- **Custom token names** so teams can keep their own naming conventions.
- An **import from Figma** workflow that generates the token JSON automatically.
- Distribution through the existing **shadcn/ui CLI**, making installation a single `npx shadcn add design-system` step.

## How it fits into a startup stack
The design‑system assets are pure JSON, so they can be version‑controlled alongside code. Adding them to a CI pipeline is as simple as committing the generated token file and running the CLI in the build step. Because the output is Tailwind‑compatible, no runtime library is added, keeping bundle size unchanged.

## Caveats and trade‑offs
- The system assumes you already use Tailwind; projects on other CSS frameworks will need a migration path.
- Token generation relies on the Figma file staying in sync; a stale design file can produce outdated tokens, leading to visual drift.
- The CLI is currently the only distribution channel, so teams that prefer npm packages must wrap the CLI call in a custom script.

## When to try it
If your startup already uses shadcn/ui and Tailwind, spin up a sandbox branch, run the CLI to pull the design system, and compare the generated token set against your existing style guide. Watch for any mismatches and evaluate whether the Figma import saves more time than the extra step of maintaining the design file.

**What to watch** – Future updates may add support for non‑Tailwind targets or a direct npm package; keep an eye on the [shadcn.run tweet](https://x.com/i/status/2056372444751909212) for announcements.