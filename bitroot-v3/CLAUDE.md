@AGENTS.md

# bitroot.org v3

Next.js 16.2.3 + React 19 + Tailwind 4 site for bitroot.org. The adjacent `bitroot-club/` project is a separate Next.js app and is **not** part of this project — don't read or edit it from here.

Ignore `bitroot-v3-framer-comparison/` — it's a static Framer export kept only for visual reference.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)

No test runner is configured.

## Stack

- **Next.js 16.2.3** — App Router. This is a recent major; APIs have shifted (async `params`, new `PageProps` helpers, etc.). **Always check `node_modules/next/dist/docs/` before writing route/page code** rather than relying on memory.
- **React 19.2.4**
- **Tailwind 4** via `@tailwindcss/postcss`. Design tokens live inside `@theme inline { ... }` in `src/app/globals.css` — custom animations must be registered as `--animate-*` keys inside that block or Tailwind won't emit the utility.
- **TypeScript 5**, strict mode. Path alias: `@/*` → `./src/*`.
- **shiki 4** — code highlighting, initialized in `src/lib/shiki.ts` with theme `github-dark-default` and a fixed lang list. Used by `src/components/ui/CodeBlock.tsx` (async server component).
- **shaders 2.5** — used in `src/components/home/ClubBanner.tsx` for the animated gradient + film-grain effect (`Shader`, `LinearGradient`, `FilmGrain` from `shaders/react`).
- **Fonts** (loaded in `src/app/layout.tsx` via `next/font/google`): `Funnel_Display` → `--font-display`, `Geist` → `--font-sans`, `Geist_Mono` → `--font-mono`.

## Routing (`src/app/`)

- `/` — home
- `/kits`, `/kits/[slug]`
- `/stacks`, `/stacks/[slug]`
- `/guides`, `/guides/[slug]`
- `/tools`, `/tools/[slug]`
- `/templates`
- `/about`, `/community`, `/newsletter`

No `loading.tsx`, `error.tsx`, `not-found.tsx`, or API `route.ts` files yet. Only one root `layout.tsx`.

## Content model (`src/content/`)

Site content is authored as typed TS modules, not MDX or a CMS. Detail pages look up records by slug from these modules.

- **`data.ts`** — central index. Exports an `Item` type (`slug`, `category: "kit"|"stack"|"guide"|"template"|"tool"`, `title`, `summary`, `tags[]`, `updatedAt`, `href`, optional `cost`, `difficulty`) and an array of every item across categories. Home/listing pages read from this.
- **`kits-content.ts`** — `KitContent` records keyed by slug. Fields include `github`, `demo?`, `tagline`, `oneLiner`, `stack[]` (`{name, why}`), `features[]` (`{title, description, icon}`), `installCommand`, `envExample`, `walkthrough[]` (`{title, body, code}`), `gotchas[]`, `whyNot`, `license`.
- **`guides-content.ts`** — `GuideContent` records. `body` is a typed node array (`GuideNode` union: `p | h2 | h3 | ul | ol | callout | code | divider`), rendered by a switch in the guide detail page. Also has `tagline`, `timeEstimate`, `youWillNeed[]`, `youWillEndUpWith`, `toc[]`.
- **`stacks-content.ts`** — `StackContent` records. `picks[]` is the core: each `StackPick` has `role`, `name`, `url`, `cost`, `why`, optional `swap`, `verdict`. Plus `tradeoffs[]`, `whenNot`, `changelog[]`, `totalCost`, `reviewedAt`, `lastChanged`.

When adding content, extend the typed arrays — don't invent new schemas. New categories need both a `data.ts` entry and a detail content module if the route renders a detail page.

## Components (`src/components/`)

Flat top-level shared components:
- `Navbar.tsx`, `Footer.tsx` — site chrome
- `PageHeader.tsx` — shared page header block
- `ItemCard.tsx` — renders an `Item` from `data.ts` (used by listing pages)
- `NewsletterForm.tsx`

Subfolders are grouped by page/feature:
- `home/` — `Hero.tsx`, `PersonaHero.tsx`, `PillarGrid.tsx`, `PrinciplesStrip.tsx`, `NewsletterCard.tsx`, `RecentlyUpdated.tsx`, `ClubBanner.tsx` (shader)
- `kits/` — `KitsGrid.tsx`
- `tools/` — `ReadmeGenerator.tsx` (an actual interactive tool, not a list)
- `ui/` — low-level primitives: `Container`, `Tag`, `UpdatedAt`, `CodeBlock` (async, shiki), `CopyButton`, `InlineCode`, `ClubNudge`, `Logo`

Prefer adding new building blocks into `ui/` when they're reusable, or into the matching feature folder when they're page-specific.

## Styling (`src/app/globals.css`)

Tailwind 4 with `@theme inline` tokens. Key design tokens:

- **Colors** — `paper` / `ink` neutral family with `-2/-3/-4` tints, `ember` (warm amber accent), `live` (terminal green), plus separate background/line tokens
- **Fonts** — `--font-sans` (Geist), `--font-display` (Funnel Display), `--font-mono` (Geist Mono)
- **Custom keyframes** — `pulse-dot`, `marquee`, `fade-up`, `cursor-blink`, `word-swap`
- **Utility classes** — `.paper-grid`, `.dotted-line`, `.repo-card`, `.prose-link`, `.marquee-track`, `.fade-up`, `.cursor-blink`, `.word-swap`, `.persona-word`, `.ruled-paper`
- Shiki overrides style `.shiki` blocks with dark bg `#0f0e0b`, padding, border-radius

**Reminder** — any new scroll/loop animation must be declared inside `@theme` as `--animate-<name>: <keyframes> ... ;` with the `@keyframes` block alongside, otherwise `animate-<name>` utilities won't work in Tailwind 4.

## Conventions

- Content is typed TS, not MDX — edit `src/content/*.ts` to add kits/guides/stacks/tools, and `data.ts` to surface them in listings.
- The design language is "paper/ink" — off-white backgrounds, warm accents, minimal chrome. Preserve that aesthetic; don't pull in generic component libraries.
- Don't create README/docs files unless asked.
