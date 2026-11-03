"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import type { InstallStep, CatalogItem } from "@/content/catalog";

/**
 * Install command with one tab per agent and a copy button. Copies fire the
 * existing `copy_click` event with catalog properties (no new event name).
 */
export default function InstallBox({
  steps,
  item,
}: {
  steps: InstallStep[];
  item: Pick<CatalogItem, "slug" | "type" | "tier">;
}) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const step = steps[tab] ?? steps[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(step.command);
    } catch {
      return;
    }
    track("copy_click", {
      pathname: window.location.pathname,
      item_slug: item.slug,
      item_type: item.type,
      agent: step.agent,
      tier: item.tier,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="overflow-hidden r-vibe-lg border-[1.5px] border-ink bg-ink text-paper">
      {steps.length > 1 && (
        <div role="tablist" aria-label="Install for" className="flex flex-wrap gap-1 border-b border-paper/15 px-2 pt-2">
          {steps.map((s, i) => (
            <button
              key={`${s.label}-${i}`}
              role="tab"
              type="button"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={cn(
                "px-3 py-2 text-[13px] font-medium r-vibe transition-colors",
                i === tab ? "bg-pop text-pop-ink" : "text-paper/70 hover:text-paper",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <span aria-hidden className="select-none pt-[3px] font-mono text-[14px] text-pop">$</span>
        <pre className="m-0 min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[14px] leading-[1.7]">
          {step.command}
        </pre>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 r-pill bg-pop px-3.5 py-2 text-[13px] font-semibold text-pop-ink transition-transform hover:-translate-y-px"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {steps.length === 1 && (
        <div className="border-t border-paper/15 px-5 py-2.5 font-mono text-[12px] text-paper/60">
          {step.label}
        </div>
      )}
    </div>
  );
}
