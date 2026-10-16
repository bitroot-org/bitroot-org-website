---
date: '2026-10-15'
excerpt: When programming high performance applications, such as video games, you
  learn neat tricks for writing fast code that makes the most of limited resources.
  Memory allocation is a huge topic for perf…
image: https://bitroot.org/blog/media/2026-10-15-doubleheaded-stack-allocator-cuts-fragmentation-in.png
published_at: '2026-10-15T13:49:35.484576+00:00'
sources:
- https://blog.demofox.org/2026/10/03/the-double-headed-stack-allocator/
tags:
- memory allocation
- stack allocator
- game development
title: Double‑headed stack allocator cuts fragmentation in games
---

A new blog post on the Double Headed Stack Allocator shows how two independent systems can share a single memory block without fragmentation by using a stack that grows upward for one side and downward for the other, meeting in the middle when memory runs out. The implementation keeps two "top‑of‑stack" (tos) indices—one starts at 0 and increments, the other starts at the block’s end and decrements.

## Core idea
The allocator works like two classic bump allocators placed back‑to‑back. Level geometry allocations push the level tos upward, while character‑form allocations push the character tos downward. Allocation is a simple integer add or subtract, and deallocation is resetting the corresponding tos (or partially resetting to a saved value). When the two tos values cross, the buffer is exhausted. This design eliminates the external fragmentation that occurs when level and character data are allocated and freed on independent timelines.

## Real‑world impact
In a 2010 open‑world game project, the author replaced per‑frame heap allocations for animation blending with a single‑sided stack allocator and saw "night and day" profiling results: allocation became an integer addition and freeing the entire frame reduced to a single assignment. Extending that to a double‑headed version allows two subsystems (e.g., streaming world geometry and shapeshifting character assets) to coexist in the same 100 MB pool without the 40 MB fragmentation problem illustrated in the post.

## Thread safety and trade‑offs
Because each tos update can be an atomic add/subtract, multiple threads can allocate from either side safely, making the allocator suitable for fork‑join CPU work or GPU‑side algorithms. The approach, however, does not invoke constructors or destructors automatically; placement new must be used for complex types, and manual destructor calls are error‑prone. The author notes that RAII patterns could help but are not built into the allocator. Also, the blog does not provide built‑in bounds‑checking beyond asserts, so misuse can lead to overflow.

## When to try it
If your startup’s engine or tool needs a fast, low‑overhead transient allocator for two competing memory users and you can tolerate manual lifetime management, prototype the double‑headed stack using the example code from the blog. Compare its allocation latency against your current heap or single‑sided stack, and watch for any missed destructor calls.

*Further reading*: the original post on the technique [(demofox.org)](https://blog.demofox.org/2026/10/03/the-double-headed-stack-allocator/) and a related Vulkan memory pool description [(VulkanMemoryAllocator)](https://gpuopen-librariesandsdks.github.io/VulkanMemoryAllocator/html/custom_memory_pools.html#linear_algorithm).