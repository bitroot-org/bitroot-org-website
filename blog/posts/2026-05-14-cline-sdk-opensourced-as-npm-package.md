---
date: '2026-05-14'
excerpt: Cline has released its SDK on npm, letting developers embed the same extension
  harness used in its coding agent. The package can be added with a single install
  command.
image: https://pbs.twimg.com/amplify_video_thumb/2054578938681405440/img/FXgnGDc0yIeZrbxm.jpg
published_at: '2026-05-14T02:18:29.845337+00:00'
sources:
- https://x.com/i/status/2054580767779700775
tags:
- sdk
- cli
- opensource
title: Cline SDK open‑sourced as npm package
video: media/2026-05-14-cline-sdk-opensourced-as-npm-package.mp4
---

Cline announced the release of the **Cline SDK** and made it publicly available on npm. You can pull it into a project with `npm i @cline/sdk` — the same harness that powers its extension and CLI.

## What the SDK contains
The package ships a JavaScript API that mirrors the internal "harness" Cline built for its coding agent in 2024. It includes utilities for command parsing, state management, and a thin wrapper for invoking the agent’s core logic. The source is hosted in the same repository used for the CLI, so any updates to the CLI automatically surface in the SDK.

## How to integrate it today
Add the dependency, import the `createClineClient` function, and pass your own configuration. The API is deliberately minimal: a `run` method accepts a prompt string and returns a result object. Because it mirrors the CLI, you can swap out the CLI binary for the SDK in CI pipelines with only a few lines of code. The documentation is limited to a short README and inline JSDoc comments.

## Trade‑offs and cautions
While the SDK is open‑source, it is still early in its lifecycle. The public docs lack detailed usage examples, and the API surface may change in upcoming minor releases, which could break downstream code. Additionally, the SDK pulls in a large runtime dependency tree, increasing bundle size for front‑end projects. Teams should treat it as a prototype tool rather than a production‑grade library until a stable version is tagged.

## When to give it a spin
If you already use Cline’s CLI in your development workflow, experiment by replacing a few internal scripts with the SDK on a non‑critical branch. Monitor the output for any regressions and keep an eye on the repository for version bumps. For teams looking to build custom extensions around Cline’s agent, the SDK offers a low‑friction entry point.

## What to watch
Watch the original announcement tweet for follow‑up posts and version announcements: [Cline on X](https://x.com/i/status/2054580767779700775).