---
date: '2026-10-14'
excerpt: Contribute to maharshi365/deslop development by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-10-14-deslop-releases-oxlint-plugin-to-catch-aislop-in-t.png
published_at: '2026-10-14T14:14:45.137156+00:00'
sources:
- https://github.com/maharshi365/deslop
tags:
- linting
- typescript
- oxlint
title: Deslop releases Oxlint plugin to catch AI‑slop in TypeScript
---

Deslop’s new **ai‑deslop** package ships as an Oxlint plugin that targets "AI‑slop" patterns in TypeScript code. The npm install command is straightforward:

```bash
npm install --save-dev ai-deslop
```

The package pulls in `@oxlint/plugins` as a runtime dependency, so you must keep that dependency in sync with your Oxlint version.

## Core rule set
Deslop bundles a *recommended* rule collection under the `deslop/*` namespace. It includes type‑safety checks like `no-chained-type-assertions`, `no-unknown-returns`, and `require-safety-comment-for-type-assertion`. Code‑quality rules cover anti‑pattern detections such as `no-array-filter-map` and `no-reduce-accumulator-copy`. Test‑specific rules flag poor practices like `no-call-only-assertions` and `no-poor-substring-tests`. All these rules are enabled by default when you import the `recommended` config.

## Plug‑in setup
Integrating Deslop into an Oxlint config mirrors a typical Oxlint setup. You import `defineConfig` from `oxlint` and the `configs` object from `ai-deslop`, then reference `deslopConfigs.recommended` for both `options` and `rules`:

```js
import { defineConfig } from "oxlint";
import { configs as deslopConfigs } from "ai-deslop";
export default defineConfig({
  jsPlugins: ["ai-deslop"],
  options: deslopConfigs.recommended.options,
  rules: deslopConfigs.recommended.rules,
});
```

The plugin ships compiled JavaScript, so it runs on Bun, Deno, or Node.js without extra build steps.

## Scope and limitations
Deslop re‑exports generic anti‑slop rules from the MIT‑licensed `dmmulroy/anti-slop` repository, then adds its own AI‑focused checks. Opt‑in rules such as `no-duplicate-consts` and `canonical‑class‑names` are available but not part of the default recommended set. The repository does not publish any pricing information or usage limits, so you’ll need to treat it as a free, open‑source tool.

## When to try it
If your startup’s codebase includes AI‑generated TypeScript or you want tighter type‑safety enforcement, add `ai‑deslop` to your CI lint step and watch for the new warnings. Keep an eye on the repo for future rule updates and for any changes to the required `@oxlint/plugins` version.

---

*Source: [Deslop GitHub repo](https://github.com/maharshi365/deslop)*