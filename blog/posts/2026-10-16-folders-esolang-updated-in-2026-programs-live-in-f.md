---
date: '2026-10-29'
excerpt: 'The Folders language, which treats nested directories as code, received its first update since 2015. It remains free, open‑source, and deliberately impractical for production use.'
image: https://bitroot.org/blog/media/2026-10-16-folders-esolang-updated-in-2026-programs-live-in-f.png
published_at: '2026-10-16T13:39:17.377906+00:00'
sources:
- https://danieltemkin.com/esolangs/folders
tags:
- 'esolang'
- 'filesystem'
- 'language-design'
title: 'Folders esolang updated in 2026, programs live in folder trees'
---

The **Folders** esoteric language, which represents programs as ordered folder hierarchies, announced a 2026 update – the first change since its 2015 launch. The update preserves the claim that a program can create *"infinite"* storage by nesting folders, and the reference implementation lives on GitHub.

## What the language does
Folders is a non‑textual, imperative language where the **number of sub‑folders** in the first child folder determines the command or expression type (e.g., 0 folders for `if`, 1 for `while`, 4 for `print`). Folder names are ignored except for alphabetical ordering, so the program’s logic is entirely in the containment structure. The spec also defines types (float, string, char) by folder count. An example program – a Fibonacci generator – is represented as a deeply nested JSON‑style list of empty arrays.

## Tooling and access
The interpreter and reference compiler are open source at the [GitHub repo](https://github.com/rottytooth/Folders). A JavaScript emulator on the creator’s site lets non‑Windows users experiment with the language ([danieltemkin.com/esolangs/folders](https://danieltemkin.com/esolangs/folders)). There is no commercial licensing, subscription, or pricing information published – the project appears to be free to use.

## Trade‑offs for startup engineers
Because the language stores temporary data as folders rather than files, it avoids creating temporary files on disk, but it also means **any real‑world storage limits still apply** – the “infinite storage” claim is theoretical and depends on the host filesystem. The Windows‑first design means native performance is only on that platform; other OSes need the browser‑based emulator, adding friction. Debugging is essentially visual – you read folder trees – which is far from the rapid iteration cycles most startups need.

## When to try it
If your team enjoys language design curiosities or wants a novelty hack for a weekend internal demo, pulling the repo and writing a tiny program is trivial. For production code or any performance‑critical component, the lack of tooling, debugging support, and the unconventional representation make it unsuitable.

**What to watch:** Keep an eye on the GitHub repo for any future tooling (e.g., IDE plugins) that might lower the friction of working with folder‑based code.
