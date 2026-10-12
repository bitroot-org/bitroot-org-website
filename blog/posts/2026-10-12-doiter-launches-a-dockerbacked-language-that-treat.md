---
date: '2026-10-12'
excerpt: A cloud-native programming language which uses docker as virtual memory by
  representing pointers as docker containers, and fields as files. - simvux/doiter
image: https://bitroot.org/blog/media/2026-10-12-doiter-launches-a-dockerbacked-language-that-treat.png
published_at: '2026-10-12T18:24:05.588489+00:00'
sources:
- https://github.com/simvux/doiter
tags:
- programming language
- docker
- systems
title: Doiter launches a Docker‑backed language that treats containers as memory
---

Doiter, an experimental cloud‑native language, was just pushed to [GitHub](https://github.com/simvux/doiter) and creates a Docker container for every allocation or stack frame; its hello‑world sample spawns 51 containers and takes about a minute to run.

## Memory as containers
Doiter treats the running Docker daemon as its virtual memory. When a structure like `Point` is instantiated, the compiler launches a container to hold the fields (`x` and `y`). A second container represents the top‑level stack frame and stores a reference to the first. This design replaces traditional heap or stack with a hierarchy of Docker containers.

## Toolchain basics
The source builds with the Rust toolchain: `cargo build --release` produces a binary in `./target/release`. Running a program is as simple as `doiter samples/hello-world.dr`. If cleanup fails, `doiter --cleanup-all` removes all containers, while `doiter --no-cleanup` leaves them for manual inspection via `docker exec <CONTAINER> -it /bin/ash`.

## Performance and limits
The author notes the hello‑world sample runs in roughly a minute on a typical machine. Because every character becomes its own container (the sample creates 51 containers), the overhead is high. The language only supports two primitive types, `byte` and `char`, and uses a linked‑list implementation for strings, meaning there are no arrays or richer data structures. Containers are not reclaimed during execution; they are automatically removed after the program exits via “missile allocation”.

## Caveats and when to experiment
The repository’s FAQ bluntly advises, “No. This is a terrible idea on every level,” and labels the project a parody of unnecessary Docker use. It is not intended for production, has no pricing model, and provides no performance guarantees beyond the demonstrated minute‑long run. For teams that enjoy exploring extreme abstractions or need a quirky demo for a hackathon, Doiter can be a fun sandbox. Otherwise, stick to conventional languages.

**What to watch** – Keep an eye on the author’s real language effort, [luminalang/lumina](https://github.com/simvux/doiter), which may evolve from this experimental prototype.