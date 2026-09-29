---
date: '2026-09-29'
excerpt: How Godot's GDExtension system and the godot-cpp bindings work, and how to
  use Conan to bring C and C++ libraries into a Godot game, with a flecs example that
  simulates 100,000 particles.
image: https://blog.conan.io/assets/img/small-search.svg
published_at: '2026-09-29T15:16:07.988770+00:00'
sources:
- https://blog.conan.io/cpp/conan/gamedev/godot/cmake/2026/09/29/Using-Any-Cpp-Library-In-Godot.html
tags:
- godot
- conan
- c++
- gdextension
title: Use any C++ library in Godot via Conan and CMake
---

Godot developers can now add any C or C++ library to a project by using the **godot-cpp 10.0.0** package that landed in ConanCenter, and building the extension with Conan and CMake. The blog post demonstrates a GDExtension that simulates **100,000 particles** using the ECS library **flecs** 4.1.6.

## How Conan simplifies the build

Conan treats `godot-cpp` like any other dependency. You declare it in a `conanfile.py` along with the third‑party library (e.g., `flecs`) and Conan resolves, downloads pre‑built binaries when available, and builds the rest from source. The two relevant options are `api_version` (default picks the oldest Godot version you support, 4.3‑4.7) and `target` (default `template_debug`). Each combination is built once and reused across projects, eliminating the per‑project recompilation of `godot-cpp` for every platform.

## Minimal CMake integration

The CMakeLists.txt simply finds the Conan‑generated packages:
```cmake
find_package(godot-cpp REQUIRED CONFIG)
find_package(flecs REQUIRED CONFIG)
add_library(gdexample SHARED src/register_types.cpp src/swarm.cpp)
target_link_libraries(gdexample PRIVATE godot-cpp flecs::flecs_static)
```
The `GODOTCPP_TARGET` cache variable ensures the shared library name matches the target Godot expects (`template_debug` or `template_release`). Building the extension is a single command:
```
conan build . --build=missing
```
On Windows you may need `-s compiler.cppstd=17` because `godot-cpp` requires C++17.

## Running the example

Clone the full demo from the Conan examples repository [GitHub](https://github.com/conan-io/examples2.git) and open `demo/project.godot` in Godot 4.7. The `Swarm` node appears in the editor like any built‑in node, exposing `count` and `flee_radius` properties that can be tweaked in the Inspector. Press Play and move the mouse to see the particles flee.

## Caveats to consider

The announcement does not discuss pricing or usage limits—ConanCenter is free, but you must provide compatible toolchains. On Linux the extension links `libstdc++` dynamically, so the target system must have a matching version, or you must static‑link and hide symbols manually. These runtime requirements are not covered in the post.

**When to try it**: If your Godot game needs a native simulation, physics, or ML library, add it via Conan today; the single‑command build and reusable binaries make multi‑platform shipping much faster.