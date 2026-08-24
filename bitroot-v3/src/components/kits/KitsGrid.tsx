"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Item } from "@/content/data";
import Tag from "@/components/ui/Tag";

type Difficulty = "all" | "starter" | "intermediate" | "advanced";

const difficultyLabels: Record<Difficulty, string> = {
  all: "All",
  starter: "Starter",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function KitsGrid({ kits }: { kits: Item[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [query, setQuery] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    kits.forEach((k) => k.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [kits]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return kits.filter((k) => {
      if (difficulty !== "all" && k.difficulty !== difficulty) return false;
      if (activeTag && !k.tags.includes(activeTag)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${k.title} ${k.summary} ${k.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [kits, difficulty, activeTag, query]);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(difficultyLabels) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-[12px] font-mono px-3.5 py-1.5 rounded-full border transition-colors ${
                difficulty === d
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper border-line text-ink-3 hover:border-ink-3"
              }`}
            >
              {difficultyLabels[d]}
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M11 11l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search kits…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-paper border border-line rounded-full pl-9 pr-3 py-2 text-[13px] font-mono text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors"
          />
        </div>
      </div>

      {/* Tag filter row */}
      <div className="mb-8 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-4 mr-1">
          stack:
        </span>
        <button
          onClick={() => setActiveTag(null)}
          className={`text-[11px] font-mono px-2 py-0.5 rounded-[5px] border transition-colors ${
            activeTag === null
              ? "bg-ember-bg border-ember-line text-ember"
              : "bg-paper-2 border-line text-ink-3 hover:border-ink-3"
          }`}
        >
          any
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-[11px] font-mono px-2 py-0.5 rounded-[5px] border transition-colors ${
              activeTag === tag
                ? "bg-ember-bg border-ember-line text-ember"
                : "bg-paper-2 border-line text-ink-3 hover:border-ink-3"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-line rounded-xl bg-paper-2/30">
          <div className="font-display text-lg text-ink-2 mb-1">
            No kits match.
          </div>
          <p className="text-[13px] text-ink-3">
            Try clearing the filters above, or{" "}
            <a
              href="https://github.com/bitroot/bitroot/discussions"
              className="prose-link"
            >
              tell us what you&apos;d build
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filtered.map((kit) => (
            <Link
              key={kit.slug}
              href={kit.href}
              className="repo-card group relative mb-5 flex break-inside-avoid flex-col rounded-2xl border border-line bg-paper p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-ink-3"
                  >
                    <path
                      d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9zM5 6h6M5 9h4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="font-mono text-[11px] text-ink-4 uppercase tracking-wider">
                    kit / {kit.slug}
                  </span>
                </div>
                {kit.difficulty && (
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border ${
                      kit.difficulty === "starter"
                        ? "bg-live-bg border-green-200 text-live"
                        : kit.difficulty === "intermediate"
                        ? "bg-ember-bg border-ember-line text-ember"
                        : "bg-paper-2 border-line text-ink-3"
                    }`}
                  >
                    {kit.difficulty}
                  </span>
                )}
              </div>

              <h3 className="font-display text-[20px] font-bold text-ink group-hover:text-ember transition-colors mb-2 leading-tight">
                {kit.title}
              </h3>
              <p className="text-[13.5px] text-ink-3 leading-relaxed mb-4">
                {kit.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {kit.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              <div className="dotted-line mb-3 mt-auto" />

              <div className="flex items-center justify-between text-[11px] font-mono text-ink-4">
                <span>updated {kit.updatedAt}</span>
                <span className="inline-flex items-center gap-1 text-ink-3 group-hover:text-ember transition-colors">
                  read more
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
