"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./ui/Logo";
import VibeToggle from "./vibe/VibeToggle";
import { cn } from "@/lib/cn";

const personas = [
  { label: "Content Creators", href: "/creators/", emoji: "🎬" },
  { label: "Vibe Coders", href: "/vibe-coders/", emoji: "⚡" },
  { label: "Founders", href: "/founders/", emoji: "🚀" },
];

const browse = [
  {
    title: "Add-ons",
    links: [
      { label: "Skills", href: "/skills/" },
      { label: "Plugins", href: "/plugins/" },
      { label: "MCP servers", href: "/mcp/" },
      { label: "CLIs & SDKs", href: "/cli/" },
      { label: "Packs", href: "/packs/" },
    ],
  },
  {
    title: "Founder shelf",
    links: [
      { label: "Kits", href: "/kits/" },
      { label: "Guides", href: "/guides/" },
      { label: "Tools", href: "/tools/" },
      { label: "Products", href: "/products/" },
      { label: "Newsletter", href: "/newsletter/" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  const clean = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  return clean(pathname).startsWith(clean(href));
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  // Menus remember the path they were opened on, so navigating closes them
  // without a setState-in-effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [browseAt, setBrowseAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const browseOpen = browseAt === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) =>
    setOpenAt((prev) => ((typeof v === "function" ? v(prev === pathname) : v) ? pathname : null));
  const setBrowseOpen = (v: boolean | ((prev: boolean) => boolean)) =>
    setBrowseAt((prev) => ((typeof v === "function" ? v(prev === pathname) : v) ? pathname : null));
  const closeTimer = useRef<number | null>(null);
  const browseActive = browse.some((g) => g.links.some((l) => isActive(pathname, l.href)));

  useEffect(() => {
    if (!browseOpen && !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBrowseAt(null);
        setOpenAt(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [browseOpen, open]);

  const openBrowse = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setBrowseOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setBrowseOpen(false), 160);
  };

  const linkCls = (active: boolean) =>
    cn(
      "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[15px] font-medium no-underline transition-colors",
      active ? "bg-tint text-ember" : "text-ink hover:bg-tint",
    );

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-[60px] w-full max-w-[1240px] items-center justify-between gap-2 rounded-full border border-line-2/70 bg-paper/85 pl-4 pr-1.5 sm:gap-3 sm:pl-5 sm:pr-2 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:pl-6">
        <Link href="/" className="shrink-0 text-ink no-underline" aria-label="Bitroot home">
          <Logo height={30} priority />
        </Link>

        {/* Desktop */}
        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {personas.map((p) => {
            const active = isActive(pathname, p.href);
            return (
              <Link key={p.href} href={p.href} aria-current={active ? "page" : undefined} className={linkCls(active)}>
                <span aria-hidden className="text-[15px] leading-none">{p.emoji}</span>
                {p.label}
              </Link>
            );
          })}

          <div className="relative" onMouseEnter={openBrowse} onMouseLeave={scheduleClose}>
            <button
              type="button"
              aria-expanded={browseOpen}
              aria-controls="browse-menu"
              onClick={() => setBrowseOpen((v) => !v)}
              onFocus={openBrowse}
              className={linkCls(browseActive || browseOpen)}
            >
              Browse
              <span aria-hidden className={cn("text-[11px] transition-transform", browseOpen && "rotate-180")}>▾</span>
            </button>
            <div
              id="browse-menu"
              className={cn(
                "absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200",
                browseOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
              )}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose();
              }}
            >
              <div className="grid grid-cols-2 gap-6 rounded-[26px] border border-line-2 bg-paper p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
                {browse.map((g) => (
                  <div key={g.title}>
                    <p className="m-0 mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-4">{g.title}</p>
                    <ul className="m-0 list-none p-0">
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="rule-row py-2.5 text-[15px]">
                            <span className="sq-bullet text-[11px]" />
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a href="/blog/" className={linkCls(false)}>
            <span aria-hidden className="relative inline-flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-live/40" />
              <span className="relative inline-flex size-2 rounded-full bg-live" />
            </span>
            Newslogger
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <VibeToggle round />
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full hover:bg-tint lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={cn("block h-[2px] w-5 bg-ink transition-transform", open && "translate-y-[7px] rotate-45")} />
            <span className={cn("block h-[2px] w-5 bg-ink transition-opacity", open && "opacity-0")} />
            <span className={cn("block h-[2px] w-5 bg-ink transition-transform", open && "-translate-y-[7px] -rotate-45")} />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-h-[calc(100dvh-88px)] w-full max-w-[1240px] overflow-y-auto rounded-[28px] border border-line-2/70 bg-paper shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] lg:hidden"
        >
          <nav aria-label="Mobile" className="px-5 pb-7 pt-2 sm:px-8">
            {personas.map((p) => (
              <Link key={p.href} href={p.href} className="rule-row">
                <span aria-hidden>{p.emoji}</span>
                {p.label}
                <span className="rule-arrow" aria-hidden>→</span>
              </Link>
            ))}
            {browse.map((g) => (
              <div key={g.title} className="mt-6">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-4">{g.title}</p>
                <div className="grid grid-cols-2 gap-x-5">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className="rule-row py-3 text-[15px]">
                      <span className="sq-bullet text-[11px]" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="/blog/" className="text-[15px] font-semibold text-ink underline underline-offset-4">Newslogger →</a>
              <a href="https://bitroot.club" target="_blank" rel="noreferrer" className="text-[15px] font-semibold text-ink underline underline-offset-4">
                Bitroot Club →
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
