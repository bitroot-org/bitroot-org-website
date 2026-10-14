---
date: '2026-10-12'
excerpt: 'Lukáš Lalinský introduced zt, a Zig library that transpiles HTML templates to Zig code at build time, giving compile‑time safety and zero‑allocation rendering.'
image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGCiIOvA3_lwHEh0I7S6MXo2OYtSDnnrAh05ZN9Op0Vw&s=10
published_at: '2026-10-12T18:25:33.512347+00:00'
sources:
- https://lalinsky.com/2026/10/11/type-safe-html-templating-in-zig.html
tags:
- 'zig'
- 'templating'
- 'type-safe'
title: 'Zig gains a compile‑time type‑safe HTML templating library'
---

Lukáš Lalinský released **zt**, a Zig library that parses HTML templates and transpiles them to Zig source during `zig build`, so the generated code writes directly to a `std.Io.Writer` with no intermediate allocations. The announcement is detailed in his blog post [Type‑safe HTML templating in Zig](https://lalinsky.com/2026/10/11/type-safe-html-templating-in-zig.html).

## Compile‑time safety without runtime surprises
All template inputs are typed, and the Zig compiler checks them. A typo like `{u.nmae}` in a template triggers a compiler error that points to the exact line in the generated code and the original template. Mismatched argument types (e.g., passing a plain string where `HomePage` expects a `?User`) also fail to compile, eliminating a whole class of runtime template bugs.

## Zero‑allocation rendering and XSS protection
The generated render functions simply write bytes to a `std.Io.Writer`, letting you stream directly to a socket or buffer. No heap allocations are performed. Every dynamic value is HTML‑escaped by default, and URL attributes are validated against dangerous schemes. To emit raw HTML you must use an explicit `{!value}` syntax, making unsafe output easy to spot.

## Early‑stage project and syntax quirks
While the core ideas work, the library is still immature. Block‑level control flow is parsed as plain Zig, so a line that starts with `if` outside of an element causes a parse error; the author is considering a `@if` style syntax to resolve the ambiguity. The project has no listed pricing or licensing details, and the blog notes that it "is not very mature yet" and welcomes feedback via GitHub issues.

**When to try it**: If you are already using Zig for backend services and want a fast, type‑checked way to generate HTML without pulling in a heavyweight templating engine, clone the repo and run the example in the Dusty `TODO` app. Keep an eye on the project's GitHub issue tracker for updates to the control‑flow syntax and maturity milestones.
