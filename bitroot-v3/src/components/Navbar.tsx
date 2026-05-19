"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./ui/Logo";
import { pillars } from "@/content/data";
import { cn } from "@/lib/cn";

type IconKey =
  | "home"
  | "products"
  | "kits"
  | "guides"
  | "tools"
  | "newsletter";

type NavLink = {
  label: string;
  href: string;
  icon: IconKey;
  pillarKey?: "kits" | "guides" | "products" | "tools";
};

const nav: NavLink[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Products", href: "/products", icon: "products" },
  { label: "Kits", href: "/kits", icon: "kits", pillarKey: "kits" },
  { label: "Guides", href: "/guides", icon: "guides", pillarKey: "guides" },
  { label: "Tools", href: "/tools", icon: "tools", pillarKey: "tools" },
  { label: "Newsletter", href: "/newsletter", icon: "newsletter" },
];

function pillarFor(key: NonNullable<NavLink["pillarKey"]>) {
  return pillars.find((p) => p.key === key);
}

const segmentShell =
  "inline-flex items-center backdrop-blur-lg border border-line/80 bg-paper/85 shadow-[0_14px_36px_-16px_rgba(20,18,42,0.22)]";

const dropdownEase = "cubic-bezier(0.22, 1, 0.36, 1)";

function NavIcon({ name, size = 22 }: { name: IconKey; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M3.5 11.5L12 4l8.5 7.5" />
          <path d="M5.5 10v9.5h13V10" />
        </svg>
      );
    case "products":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="7" height="7" rx="1.8" />
          <rect x="13" y="4" width="7" height="7" rx="1.8" />
          <rect x="4" y="13" width="7" height="7" rx="1.8" />
          <rect x="13" y="13" width="7" height="7" rx="1.8" />
        </svg>
      );
    case "kits":
      return (
        <svg {...props}>
          <path d="M12 3l8.5 4.5v9L12 21l-8.5-4.5v-9L12 3z" />
          <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
          <path d="M7.75 5.25l8.5 4.5" opacity="0.5" />
        </svg>
      );
    case "guides":
      return (
        <svg {...props}>
          <path d="M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" />
          <path d="M5 4v13a3 3 0 003 3" />
          <path d="M8.5 8.5h6M8.5 12h4" />
        </svg>
      );
    case "tools":
      return (
        <svg {...props}>
          <path d="M14.5 4.5l5 5-9 9-3.5 1 1-3.5 9-9-2.5-2.5z" />
          <path d="M13 6l5 5" />
        </svg>
      );
    case "newsletter":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3.5 7l8.5 6 8.5-6" />
        </svg>
      );
  }
}

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeMenu]);

  const openMenu = (label: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  function NavItem({ link }: { link: NavLink }) {
    const pillar = link.pillarKey ? pillarFor(link.pillarKey) : null;
    const hasDropdown = !!pillar;
    const isOpen = activeMenu === link.label;
    const isActive = link.href === pathname;

    return (
      <div
        className="relative"
        onMouseEnter={() => hasDropdown && openMenu(link.label)}
        onMouseLeave={() => hasDropdown && scheduleClose()}
        onFocus={() => hasDropdown && openMenu(link.label)}
        onBlur={(e) => {
          if (
            hasDropdown &&
            !e.currentTarget.contains(e.relatedTarget as Node)
          ) {
            scheduleClose();
          }
        }}
      >
        <Link
          href={link.href}
          className={cn(
            "group/icon relative inline-flex items-center justify-center h-12 w-12 rounded-xl transition-all duration-200",
            isActive
              ? "text-ink bg-gradient-to-b from-paper to-paper-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(191,207,231,0.55),inset_0_-1px_2px_rgba(20,18,42,0.06),0_2px_4px_-1px_rgba(20,18,42,0.10),0_8px_18px_-8px_rgba(20,18,42,0.10)]"
              : isOpen
                ? "text-ink bg-paper-2/85 shadow-[inset_0_0_0_1px_rgba(191,207,231,0.55)]"
                : "text-ink-3 hover:text-ink hover:bg-paper-2/70",
          )}
          aria-haspopup={hasDropdown ? "menu" : undefined}
          aria-expanded={hasDropdown ? isOpen : undefined}
          aria-current={isActive ? "page" : undefined}
          aria-label={link.label}
        >
          <NavIcon name={link.icon} />

          {/* hover tooltip — hidden when dropdown opens */}
          <span
            className={cn(
              "pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-ink text-paper text-[10.5px] font-mono px-2 py-1 shadow-[0_8px_20px_-8px_rgba(20,18,42,0.4)] transition-opacity duration-150",
              isOpen ? "opacity-0" : "opacity-0 group-hover/icon:opacity-100",
            )}
            role="tooltip"
          >
            {link.label}
            {hasDropdown && <span className="text-ink-4 ml-1">▾</span>}
          </span>

          {/* dropdown indicator dot */}
          {hasDropdown && (
            <span
              className={cn(
                "absolute bottom-1 w-1 h-1 rounded-full transition-colors",
                isOpen ? "bg-ember" : "bg-ink-4/50",
              )}
              aria-hidden
            />
          )}
        </Link>

        {hasDropdown && pillar && (
          <div
            role="menu"
            aria-label={`${link.label} menu`}
            className={cn(
              "absolute left-1/2 top-full -translate-x-1/2 pt-3 w-[340px] origin-top",
              isOpen
                ? "opacity-100 visible translate-y-0 scale-100"
                : "opacity-0 invisible -translate-y-1 scale-[0.96] pointer-events-none",
            )}
            style={{
              transitionProperty: "opacity, transform, visibility",
              transitionDuration: "260ms",
              transitionTimingFunction: dropdownEase,
            }}
          >
            <div className="rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-24px_rgba(23,21,18,0.28),0_8px_20px_-12px_rgba(23,21,18,0.12)] overflow-hidden">
              {/* Header — pairs the icon with the section title so users
                  know exactly what they're hovering. */}
              <div className="px-4 pt-3.5 pb-3 border-b border-line/80 bg-gradient-to-b from-paper-2/40 to-transparent">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-paper border border-line text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(20,18,42,0.05)]">
                    <NavIcon name={link.icon} size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[14.5px] font-bold text-ink leading-tight">
                      {link.label}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-4 mt-0.5">
                      {pillar.subtitle}
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-ink-3 leading-snug mt-2">
                  {pillar.description}
                </p>
              </div>
              <ul className="py-1.5">
                {pillar.items.slice(0, 4).map((item) => (
                  <li key={item.slug} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-2 hover:bg-paper-2 transition-colors group"
                    >
                      <div className="font-display text-[13.5px] font-semibold text-ink group-hover:text-ember transition-colors leading-snug">
                        {item.title}
                      </div>
                      <div className="text-[11.5px] text-ink-3 leading-snug mt-0.5 line-clamp-1">
                        {item.summary}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line/80 px-4 py-2.5">
                <Link
                  href={link.href}
                  role="menuitem"
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-mono text-ember hover:text-ink transition-colors"
                >
                  view all {pillar.items.length} {link.label.toLowerCase()}
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="px-4 sm:px-6 pt-3 sm:pt-4">
        {/* Desktop — canvas-style toolbar on every route */}
        <div className="hidden md:flex relative items-start justify-between">
          {/* Logo — top left, smaller, less-rounded than the toolset */}
          <Link
            href="/"
            className={cn(
              segmentShell,
              "px-3.5 h-11 mt-2 rounded-lg text-ink hover:text-ember transition-colors",
            )}
            aria-label="Bitroot home"
          >
            <Logo size={20} />
          </Link>

          {/* Tool cluster — absolutely centered */}
          <nav
            className={cn(
              segmentShell,
              "absolute left-1/2 top-0 -translate-x-1/2 rounded-2xl gap-1 px-2 py-2",
            )}
            aria-label="Primary"
          >
            {nav.map((link) => (
              <NavItem key={link.href} link={link} />
            ))}
          </nav>

          {/* Newslogger — top right, mirrors the logo chip */}
          <Link
            href="/blog/"
            className={cn(
              segmentShell,
              "group/news px-3 h-11 mt-2 rounded-lg gap-2.5 text-ink hover:text-ember transition-colors",
            )}
            aria-label="Newslogger — open the blog"
          >
            <span
              aria-hidden
              className="relative inline-flex size-2 items-center justify-center"
            >
              <span className="absolute inline-flex size-full rounded-full bg-live/40 animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-live pulse-live" />
            </span>
            <span className="font-display text-[13px] font-semibold leading-none">
              Newslogger
            </span>
            <span
              aria-hidden
              className="text-ink-4 group-hover/news:text-ember translate-x-0 group-hover/news:translate-x-0.5 transition-all text-[12px] leading-none"
            >
              →
            </span>
          </Link>
        </div>

        {/* Mobile shell */}
        <div className="md:hidden mx-auto flex items-center justify-between backdrop-blur-lg border border-line h-12 px-4 rounded-full bg-paper/95 shadow-[0_12px_32px_-16px_rgba(20,18,42,0.18)]">
          <Link
            href="/"
            className="text-ink hover:text-ember transition-colors"
          >
            <Logo />
          </Link>
          <button
            className="flex flex-col gap-1 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-ink transition-transform ${
                open ? "translate-y-[5.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-ink transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-ink transition-transform ${
                open ? "-translate-y-[5.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper">
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
            <nav className="py-4 flex flex-col gap-1">
              {nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-[15px] text-ink-2 py-2 px-3 rounded-full hover:bg-paper-2"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://bitroot.club"
                target="_blank"
                rel="noreferrer"
                className="text-[15px] text-ink-2 py-2 px-3 rounded-full hover:bg-paper-2"
              >
                Join Bitroot Club →
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
