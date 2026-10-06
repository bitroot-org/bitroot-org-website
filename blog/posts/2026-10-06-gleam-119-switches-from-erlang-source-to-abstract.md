---
date: '2026-10-06'
excerpt: 'News post: Gleam v1.19.0 released!'
image: https://bitroot.org/blog/media/2026-10-06-gleam-119-switches-from-erlang-source-to-abstract.png
published_at: '2026-10-06T15:35:29.423867+00:00'
sources:
- https://gleam.run/news/gleam-doesnt-compile-to-erlang-source-anymore/
tags:
- gleam
- compiler
- erlang
title: Gleam 1.19 switches from Erlang source to abstract forms
---

Gleam 1.19.0 has been released, and the language’s Erlang code generator has been rewritten to emit **Erlang abstract forms** instead of raw Erlang source files. This change lets the compiler feed a binary‑encoded intermediate representation directly to the Erlang compiler, skipping the front‑end parsing step.

## Faster builds and more accurate metadata
The new generator reduces full‑project build times dramatically. In the project's own benchmark (compiling 100 modules with 100 functions each), v1.19 outperformed v1.17 by a noticeable margin, with the full build completing well under the 500 ms ceiling shown for the older version. Because the abstract forms retain original Gleam line numbers, BEAM crash reports now point to the exact Gleam source instead of the generated Erlang code, which should make debugging easier.

## Compiler quality and code‑size improvements
Beyond speed, the rewrite modernizes a long‑standing part of the codebase, aligning it with current Erlang conventions. For the JavaScript target, pattern‑matching compilation now produces flatter `if` chains, and short list literals are emitted as direct constructor calls rather than an array‑to‑list conversion, giving modest runtime gains for libraries that use many small lists.

## Limitations and what’s left out
The announcement does not provide any pricing or licensing details—Gleam remains a community‑sponsored project, with most sponsors contributing $5‑$20 USD per month. Also, while the team discusses the idea of generating BEAM bytecode directly, they note the significant maintenance burden and have not pursued that path yet.

## When to try it
If your startup already runs Gleam on the Erlang VM or targets JavaScript, upgrade to v1.19 to benefit from faster compilation and clearer error locations. Keep an eye on the upcoming support for Elixir’s Mix build tool, which will make integrating Gleam libraries into mixed‑language projects smoother.

[Read the full release announcement](https://gleam.run/news/gleam-doesnt-compile-to-erlang-source-anymore/).