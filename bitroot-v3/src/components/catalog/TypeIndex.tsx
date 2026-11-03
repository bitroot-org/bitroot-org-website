import Link from "next/link";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/JsonLd";
import PixelHeading from "@/components/ui/PixelHeading";
import PixelSteps from "@/components/ui/PixelSteps";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd } from "@/lib/seo";
import {
  itemPath,
  itemsOfType,
  TYPE_META,
  TYPE_ORDER,
  type CatalogType,
} from "@/content/catalog";
import CatalogBrowser from "./CatalogBrowser";

const TITLES: Record<CatalogType, { title: string; description: string }> = {
  skill: {
    title: "Free Claude Skills for Creators, Vibe Coders & Founders",
    description:
      "Hand-picked Claude and Codex skills (SKILL.md) for video, images, coding and marketing. One-command installs that work in Claude Code, Codex, Cursor and Gemini CLI.",
  },
  plugin: {
    title: "Claude Code Plugins Worth Installing",
    description:
      "Claude Code and Codex plugins that bundle skills, commands and MCP servers. Picked for creators, vibe coders and founders, with install commands.",
  },
  mcp: {
    title: "Best MCP Servers for Claude Code, Cursor & Codex",
    description:
      "A short, hand-picked list of MCP servers for docs, browsers, design, databases and image generation, with one-line install commands.",
  },
  cli: {
    title: "AI CLIs & SDKs for Creators",
    description:
      "Command-line tools and SDKs for building with AI and driving coding agents: the skills CLI, AI SDK, Claude Agent SDK and more.",
  },
  pack: {
    title: "Agent Packs: Skills + MCP Servers That Work Together",
    description:
      "Starter packs of skills, plugins and MCP servers for creators, vibe coders and founders, set up with one command. Free starter packs, paid pro packs.",
  },
};

export function typeIndexMetadata(type: CatalogType) {
  return buildMetadata({ ...TITLES[type], path: TYPE_META[type].path });
}

export default function TypeIndex({ type }: { type: CatalogType }) {
  const meta = TYPE_META[type];
  const items = itemsOfType(type).sort(
    (a, b) =>
      Number(a.status === "coming-soon") - Number(b.status === "coming-soon") ||
      Number(!!b.trending) - Number(!!a.trending),
  );

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLES[type].title,
          description: TITLES[type].description,
          path: meta.path,
          items: items.map((i) => ({ name: i.name, path: itemPath(i) })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: meta.label, path: meta.path },
        ])}
      />

      <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20">
        <PixelSteps
          cells={[[0, 0], [1, 1, 2]]}
          className="absolute right-0 top-10 hidden sm:block"
        />
        <Container>
          <PixelHeading as="h1" className="text-[clamp(52px,9vw,120px)]">
            {meta.label} <span aria-hidden className="emoji">{meta.emoji}</span>
          </PixelHeading>
          <p className="mt-6 max-w-[56ch] text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-ink-2">
            {meta.blurb}
          </p>
          <nav aria-label="Other add-on types" className="mt-8 flex flex-wrap gap-2">
            {TYPE_ORDER.filter((t) => t !== type).map((t) => (
              <Link
                key={t}
                href={TYPE_META[t].path}
                className="r-pill border-[1.5px] border-ink px-3.5 py-1.5 text-[14px] font-medium text-ink no-underline transition-colors hover:bg-ink hover:text-paper"
              >
                <span aria-hidden className="emoji mr-1">{TYPE_META[t].emoji}</span>
                {TYPE_META[t].label}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      <section className="bg-tint py-16 sm:py-20">
        <Container>
          <CatalogBrowser items={items} filterBy="persona" idPrefix={`type-${type}`} />
        </Container>
      </section>
    </>
  );
}
