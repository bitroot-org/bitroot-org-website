/**
 * The add-on catalog: skills, plugins, MCP servers, CLIs/SDKs and packs,
 * sorted by persona (Creators / Vibe Coders / Founders).
 *
 * Seed data, committed as typed TS (same pattern as data.ts). The plan is to
 * move these rows into the TeamLife `site_catalog` table (new categories
 * skill | plugin | mcp | cli | pack) so the team can edit them from the
 * dashboard; until then this file is the source of truth.
 *
 * Honesty rules for this file:
 *  - `install` commands are copied from the author's own docs (`installSource`).
 *    If we have not confirmed a command, leave `install` empty and the page
 *    links to the author's install steps instead.
 *  - `checkedAt` is only set once someone has actually run the Bitroot check
 *    (read it, installed it clean, ran the job). Until then pages say "pending".
 *  - Bitroot-built items that don't exist yet are `status: "coming-soon"`.
 */

export type CatalogType = "skill" | "plugin" | "mcp" | "cli" | "pack";
export type Persona = "creators" | "vibe-coders" | "founders";
export type Agent = "claude-code" | "codex" | "cursor" | "gemini-cli" | "any";
export type Tier = "open" | "email" | "paid";

export type InstallStep = {
  /** Which agent this command is for; "any" for agent-neutral commands. */
  agent: Agent;
  /** Short label shown on the tab, e.g. "Claude Code". */
  label: string;
  /** One or more lines; each line gets copied together. */
  command: string;
};

export type CatalogItem = {
  slug: string;
  type: CatalogType;
  /** CLIs and SDKs share one index; `sdk` changes the badge only. */
  kind?: "sdk";
  name: string;
  /** One line: the job it does. */
  summary: string;
  description: string;
  whenNot?: string;
  personas: Persona[];
  /** Job group inside each persona hub, keyed by persona. */
  jobs: Partial<Record<Persona, string>>;
  agents: Agent[];
  install: InstallStep[];
  /** Page we copied the install command from. */
  installSource?: string;
  source: string;
  author: string;
  license?: string;
  builtByBitroot?: boolean;
  tier: Tier;
  status: "live" | "coming-soon";
  /** Set only after a real Bitroot check. ISO date. */
  checkedAt?: string;
  trending?: boolean;
  /** Packs only: slugs of what's inside. */
  packItems?: string[];
  tags: string[];
};

export const TYPE_META: Record<
  CatalogType,
  { label: string; singular: string; path: string; blurb: string; emoji: string }
> = {
  skill: {
    emoji: "🧠",
    label: "Skills",
    singular: "Skill",
    path: "/skills/",
    blurb:
      "SKILL.md folders that teach your agent a job. One skill works in Claude Code, Codex, Cursor and Gemini CLI.",
  },
  plugin: {
    emoji: "🔌",
    label: "Plugins",
    singular: "Plugin",
    path: "/plugins/",
    blurb:
      "Bundles of skills, commands and MCP servers you install in one go from a plugin marketplace.",
  },
  mcp: {
    emoji: "🛰️",
    label: "MCP servers",
    singular: "MCP server",
    path: "/mcp/",
    blurb:
      "Connect your agent to real tools and data: docs, browsers, design files, databases, image models.",
  },
  cli: {
    emoji: "⌨️",
    label: "CLIs & SDKs",
    singular: "CLI",
    path: "/cli/",
    blurb:
      "Command-line tools and SDKs for building with AI, or for driving your agent from the terminal.",
  },
  pack: {
    emoji: "📦",
    label: "Packs",
    singular: "Pack",
    path: "/packs/",
    blurb:
      "Several picks that work together, set up with one command. Starter packs are free; pro packs are paid.",
  },
};

export const TYPE_ORDER: CatalogType[] = ["skill", "plugin", "mcp", "cli", "pack"];

export const PERSONA_META: Record<
  Persona,
  {
    label: string;
    short: string;
    emoji: string;
    path: string;
    tagline: string;
    blurb: string;
    jobs: { key: string; label: string }[];
    faq: { q: string; a: string }[];
  }
> = {
  creators: {
    emoji: "🎬",
    label: "Content Creators",
    short: "Creators",
    path: "/creators/",
    tagline: "Edit video, make images, add motion.",
    blurb:
      "Claude skills, plugins and MCP servers for editing video, generating AI images and text, and animating. Picked for creators who'd rather post than fiddle.",
    jobs: [
      { key: "video", label: "Make & cut video" },
      { key: "images", label: "Generate images" },
      { key: "motion", label: "Animate & 3D" },
    ],
    faq: [
      {
        q: "Can Claude edit videos?",
        a: "Yes, through skills and MCP servers. Remotion and HyperFrames let Claude write and render videos from code, and MCP servers connect it to image and video models.",
      },
      {
        q: "Do I need to code to use these?",
        a: "You run one install command and then ask in plain English. Some picks, like Remotion, render with code under the hood, but the agent writes that code for you.",
      },
      {
        q: "Are these free?",
        a: "Every pick listed here is free to install. Some connect to paid model APIs (for example fal for images), which you pay for directly.",
      },
    ],
  },
  "vibe-coders": {
    emoji: "⚡",
    label: "Vibe Coders",
    short: "Vibe Coders",
    path: "/vibe-coders/",
    tagline: "MCP servers, SDKs and CLIs worth trying this week.",
    blurb:
      "The MCP servers, skills, plugins, SDKs and CLIs that make your coding agent better, plus the generative-AI tools people are building with right now.",
    jobs: [
      { key: "context", label: "Give your agent context" },
      { key: "ship", label: "Build, test, ship" },
      { key: "stack", label: "Hook up your stack" },
      { key: "genai", label: "Build with AI" },
    ],
    faq: [
      {
        q: "Which MCP servers should I install first?",
        a: "Start with two: Context7 for up-to-date library docs and Playwright so the agent can test what it builds in a real browser. Add more only when a job needs it, since every server costs context.",
      },
      {
        q: "Do these work outside Claude Code?",
        a: "Most do. Skills follow the open SKILL.md standard used by Codex, Cursor and Gemini CLI, and MCP servers work with any MCP client. Each page lists where it runs.",
      },
    ],
  },
  founders: {
    emoji: "🚀",
    label: "Founders",
    short: "Founders",
    path: "/founders/",
    tagline: "Kits, guides and agent skills for founder jobs.",
    blurb:
      "Our kits, guides, products and Newslogger, plus Claude and Codex skills for the jobs founders actually do: marketing, SEO, launches and running the numbers.",
    jobs: [
      { key: "marketing", label: "Market & grow" },
      { key: "ops", label: "Run the company" },
      { key: "deals", label: "Save money" },
    ],
    faq: [
      {
        q: "What are Claude skills for founders?",
        a: "Skills are instructions your agent loads when a task needs them: writing landing-page copy, running an SEO audit, drafting an investor update. Install once and ask in plain English.",
      },
      {
        q: "Are the kits and guides still free?",
        a: "Yes. Kits, guides, tools and the Newslogger stay free, at the same URLs.",
      },
    ],
  },
};

export const PERSONA_ORDER: Persona[] = ["creators", "vibe-coders", "founders"];

export const AGENT_LABELS: Record<Agent, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
  cursor: "Cursor",
  "gemini-cli": "Gemini CLI",
  any: "Any",
};

/** Agents that read SKILL.md skills installed via the skills CLI. */
const SKILL_AGENTS: Agent[] = ["claude-code", "codex", "cursor", "gemini-cli"];

export const catalog: CatalogItem[] = [
  // ─── Creators ───────────────────────────────────────────────────────────
  {
    slug: "remotion",
    type: "skill",
    name: "Remotion skills",
    summary: "Your agent writes and renders videos in React.",
    description:
      "Remotion's official agent skills teach your agent how to build videos as React code: scenes, captions, rendering and upgrades. Describe the video; the agent writes it and renders an MP4.",
    whenNot:
      "For quick trims and joins of existing footage, a plain editor is faster. Remotion shines when the video comes from a script, data or a template.",
    personas: ["creators"],
    jobs: { creators: "video" },
    agents: SKILL_AGENTS,
    install: [{ agent: "any", label: "skills CLI", command: "npx skills add remotion-dev/skills" }],
    installSource: "https://www.remotion.dev/docs/ai/skills",
    source: "https://github.com/remotion-dev/skills",
    author: "Remotion",
    tier: "open",
    status: "live",
    trending: true,
    tags: ["video", "react", "rendering"],
  },
  {
    slug: "hyperframes",
    type: "skill",
    name: "HyperFrames",
    summary: "Turn HTML and GSAP animations into video.",
    description:
      "HeyGen's HyperFrames lets your agent compose motion in HTML with GSAP and render it to video. Good for animated explainers, product promos and kinetic type.",
    personas: ["creators"],
    jobs: { creators: "motion" },
    agents: SKILL_AGENTS,
    install: [
      { agent: "any", label: "skills CLI", command: "npx skills add heygen-com/hyperframes" },
      {
        agent: "claude-code",
        label: "Claude Code plugin",
        command: "/plugin install hyperframes@claude-plugins-official",
      },
    ],
    installSource: "https://claudedirectory.org/plugins/hyperframes",
    source: "https://github.com/heygen-com/hyperframes",
    author: "HeyGen",
    license: "Apache-2.0",
    tier: "open",
    status: "live",
    trending: true,
    tags: ["video", "animation", "gsap"],
  },
  {
    slug: "fal",
    type: "mcp",
    name: "fal MCP",
    summary: "Generate and edit images and video with 1,000+ models.",
    description:
      "fal's hosted MCP server connects your agent to its model gallery: image generation, editing, upscaling and video. You sign in through the browser; generations bill to your fal account.",
    personas: ["creators", "vibe-coders"],
    jobs: { creators: "images", "vibe-coders": "genai" },
    agents: ["claude-code", "cursor", "codex"],
    install: [
      {
        agent: "claude-code",
        label: "Claude Code",
        command: "claude mcp add --transport http --scope user fal https://mcp.fal.ai/mcp-relay",
      },
    ],
    installSource: "https://fal.ai/docs/documentation/setting-up/mcp/claude-code",
    source: "https://fal.ai/docs/model-apis/mcp",
    author: "fal",
    tier: "open",
    status: "live",
    tags: ["images", "video", "generative ai"],
  },
  {
    slug: "blender-mcp",
    type: "mcp",
    name: "BlenderMCP",
    summary: "Build 3D scenes and product shots by prompt.",
    description:
      "Connects your agent to a running Blender so it can create objects, set materials and lighting, and render. Needs the BlenderMCP add-on installed in Blender.",
    personas: ["creators"],
    jobs: { creators: "motion" },
    agents: ["claude-code", "cursor"],
    install: [{ agent: "claude-code", label: "Claude Code", command: "claude mcp add blender -- uvx blender-mcp" }],
    installSource: "https://github.com/ahujasid/blender-mcp",
    source: "https://github.com/ahujasid/blender-mcp",
    author: "Siddharth Ahuja",
    license: "MIT",
    tier: "open",
    status: "live",
    tags: ["3d", "blender", "rendering"],
  },
  {
    slug: "figma",
    type: "mcp",
    name: "Figma MCP",
    summary: "Read and build from your Figma files.",
    description:
      "Figma's official remote MCP server gives your agent your frames, components and variables, so it can turn designs into code or pull assets for posts. Signs in with OAuth.",
    personas: ["creators", "vibe-coders"],
    jobs: { creators: "images", "vibe-coders": "ship" },
    agents: ["claude-code", "codex", "cursor"],
    install: [
      {
        agent: "claude-code",
        label: "Claude Code",
        command: "claude mcp add --transport http figma-remote-mcp https://mcp.figma.com/mcp",
      },
    ],
    installSource: "https://help.figma.com/hc/en-us/articles/39888612464151",
    source: "https://help.figma.com/hc/en-us/articles/39888612464151",
    author: "Figma",
    tier: "open",
    status: "live",
    tags: ["design", "figma"],
  },
  {
    slug: "claude-code-video-toolkit",
    type: "skill",
    name: "Claude Code Video Toolkit",
    summary: "A starter kit of video skills and workflows.",
    description:
      "A community collection of skills and workflows for producing video with Claude Code, from scripting to render. A good way to see what's possible before you pick tools.",
    personas: ["creators"],
    jobs: { creators: "video" },
    agents: ["claude-code"],
    install: [],
    source: "https://github.com/wilwaldon/Claude-Code-Video-Toolkit",
    author: "wilwaldon",
    tier: "open",
    status: "live",
    tags: ["video", "workflow"],
  },
  {
    slug: "bitroot-reel-cutter",
    type: "skill",
    name: "Bitroot Reel Cutter",
    summary: "Long video in, five captioned vertical clips out.",
    description:
      "Point it at a podcast or talk. It finds the strongest moments by topic and silence, cuts vertical clips and burns in captions you can restyle.",
    personas: ["creators"],
    jobs: { creators: "video" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/creators/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    tags: ["video", "shorts", "captions"],
  },
  {
    slug: "bitroot-thumbnails",
    type: "skill",
    name: "Bitroot Thumbnails",
    summary: "Thumbnails and post images in your brand colours.",
    description:
      "Give it a title and your brand kit; it makes YouTube thumbnails, carousels and post images that look like you, every time.",
    personas: ["creators"],
    jobs: { creators: "images" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/creators/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    tags: ["images", "thumbnails", "branding"],
  },
  {
    slug: "creator-starter-pack",
    type: "pack",
    name: "Creator Starter Pack",
    summary: "Video, images and motion, set up with one command.",
    description:
      "Remotion, HyperFrames, fal, BlenderMCP and our own Reel Cutter and Thumbnails skills, installed together and tested to work as a set.",
    personas: ["creators"],
    jobs: { creators: "video" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/packs/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    packItems: ["remotion", "hyperframes", "fal", "blender-mcp", "bitroot-reel-cutter", "bitroot-thumbnails"],
    tags: ["pack", "video", "images"],
  },
  {
    slug: "creator-pro-pack",
    type: "pack",
    name: "Creator Pro Pack",
    summary: "Pro-app workflows, caption styles and motion templates.",
    description:
      "Everything in the starter pack plus Premiere and After Effects workflows, caption style presets, brand kits and 30+ motion templates.",
    personas: ["creators"],
    jobs: { creators: "motion" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/packs/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "paid",
    status: "coming-soon",
    packItems: ["creator-starter-pack"],
    tags: ["pack", "pro"],
  },

  // ─── Vibe coders ────────────────────────────────────────────────────────
  {
    slug: "context7",
    type: "mcp",
    name: "Context7",
    summary: "Up-to-date library docs, so your agent stops guessing old APIs.",
    description:
      "Context7 pulls current, version-specific docs and examples for the libraries you use straight into the agent's context. The single most useful MCP server for coding.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "context" },
    agents: ["claude-code", "codex", "cursor", "gemini-cli"],
    install: [
      {
        agent: "claude-code",
        label: "Claude Code",
        command: "claude mcp add context7 -- npx -y @upstash/context7-mcp",
      },
    ],
    installSource: "https://github.com/upstash/context7",
    source: "https://github.com/upstash/context7",
    author: "Upstash",
    license: "MIT",
    tier: "open",
    status: "live",
    trending: true,
    tags: ["docs", "context"],
  },
  {
    slug: "playwright-mcp",
    type: "mcp",
    name: "Playwright MCP",
    summary: "Your agent drives a real browser to test what it built.",
    description:
      "Microsoft's Playwright MCP lets the agent open pages, click, type and read the result, so it can check its own work instead of asking you to.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "ship" },
    agents: ["claude-code", "codex", "cursor", "gemini-cli"],
    install: [
      {
        agent: "claude-code",
        label: "Claude Code",
        command: "claude mcp add playwright -- npx @playwright/mcp@latest",
      },
    ],
    installSource: "https://github.com/microsoft/playwright-mcp",
    source: "https://github.com/microsoft/playwright-mcp",
    author: "Microsoft",
    license: "Apache-2.0",
    tier: "open",
    status: "live",
    tags: ["testing", "browser"],
  },
  {
    slug: "github-mcp",
    type: "mcp",
    name: "GitHub MCP",
    summary: "Issues, PRs and repos from inside your agent.",
    description:
      "GitHub's official MCP server lets the agent read and act on repositories, issues, pull requests and Actions runs.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "stack" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://github.com/github/github-mcp-server",
    author: "GitHub",
    license: "MIT",
    tier: "open",
    status: "live",
    tags: ["git", "github"],
  },
  {
    slug: "supabase-mcp",
    type: "mcp",
    name: "Supabase MCP",
    summary: "Query, migrate and manage your Supabase project.",
    description:
      "Connects your agent to Supabase: explore the schema, run SQL, manage migrations and branches. Use read-only mode on anything with real data.",
    whenNot: "Don't point it at a production database with write access.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "stack" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://supabase.com/docs/guides/getting-started/mcp",
    author: "Supabase",
    tier: "open",
    status: "live",
    tags: ["database", "postgres"],
  },
  {
    slug: "neon-mcp",
    type: "mcp",
    name: "Neon MCP",
    summary: "Serverless Postgres your agent can branch and query.",
    description:
      "Neon's MCP server lets the agent create projects and branches, run SQL and plan migrations against a throwaway branch first.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "stack" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://github.com/neondatabase/mcp-server-neon",
    author: "Neon",
    license: "MIT",
    tier: "open",
    status: "live",
    tags: ["database", "postgres"],
  },
  {
    slug: "superpowers",
    type: "plugin",
    name: "Superpowers",
    summary: "Planning, TDD and debugging habits for your coding agent.",
    description:
      "One of the most-starred skill sets for coding agents: brainstorm, plan, write tests first, debug systematically. Installs as a Claude Code plugin.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "ship" },
    agents: ["claude-code"],
    install: [
      {
        agent: "claude-code",
        label: "Claude Code",
        command:
          "/plugin marketplace add obra/superpowers-marketplace\n/plugin install superpowers@superpowers-marketplace",
      },
    ],
    installSource: "https://www.mintlify.com/obra/superpowers/installation/claude-code",
    source: "https://github.com/obra/superpowers",
    author: "Jesse Vincent",
    license: "MIT",
    tier: "open",
    status: "live",
    trending: true,
    tags: ["workflow", "tdd"],
  },
  {
    slug: "mattpocock-skills",
    type: "skill",
    name: "Matt Pocock's skills",
    summary: "TypeScript-heavy coding skills from a TS educator.",
    description:
      "A popular set of skills for writing and reviewing TypeScript, planning changes and keeping code tidy.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "ship" },
    agents: SKILL_AGENTS,
    install: [{ agent: "any", label: "skills CLI", command: "npx skills add mattpocock/skills" }],
    source: "https://github.com/mattpocock/skills",
    author: "Matt Pocock",
    tier: "open",
    status: "live",
    tags: ["typescript"],
  },
  {
    slug: "skills-cli",
    type: "cli",
    name: "skills CLI",
    summary: "Install any SKILL.md skill into any agent.",
    description:
      "The open skills CLI from skills.sh. One command installs skills from a GitHub repo into Claude Code, Codex, Cursor, Gemini CLI and more.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "context" },
    agents: SKILL_AGENTS,
    install: [{ agent: "any", label: "npx", command: "npx skills add <owner>/<repo>" }],
    installSource: "https://www.remotion.dev/docs/ai/skills",
    source: "https://skills.sh",
    author: "Vercel",
    tier: "open",
    status: "live",
    tags: ["skills", "cli"],
  },
  {
    slug: "ai-sdk",
    type: "cli",
    kind: "sdk",
    name: "AI SDK",
    summary: "Ship AI features in TypeScript, any model.",
    description:
      "Vercel's AI SDK gives you one API for text, structured output, tools and streaming across model providers. The default way to build AI into a Next.js app.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "genai" },
    agents: ["any"],
    install: [{ agent: "any", label: "npm", command: "npm i ai" }],
    installSource: "https://ai-sdk.dev",
    source: "https://ai-sdk.dev",
    author: "Vercel",
    license: "Apache-2.0",
    tier: "open",
    status: "live",
    tags: ["sdk", "typescript", "generative ai"],
  },
  {
    slug: "claude-agent-sdk",
    type: "cli",
    kind: "sdk",
    name: "Claude Agent SDK",
    summary: "Build your own agents on the Claude Code engine.",
    description:
      "Anthropic's Agent SDK gives you the same agent loop, tools and context handling as Claude Code, to build agents of your own in TypeScript or Python.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "genai" },
    agents: ["any"],
    install: [{ agent: "any", label: "npm", command: "npm i @anthropic-ai/claude-agent-sdk" }],
    source: "https://docs.claude.com/en/docs/agent-sdk/overview",
    author: "Anthropic",
    tier: "open",
    status: "live",
    tags: ["sdk", "agents"],
  },
  {
    slug: "bitroot-cli",
    type: "cli",
    name: "bitroot CLI",
    summary: "Install any pick or pack from this site with one command.",
    description:
      "`npx bitroot add <pick>` installs into Claude Code, Codex, Cursor or Gemini CLI, with pinned versions from our catalog only.",
    personas: ["vibe-coders", "creators", "founders"],
    jobs: { "vibe-coders": "context" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/cli/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "open",
    status: "coming-soon",
    tags: ["cli"],
  },
  {
    slug: "newslogger-mcp",
    type: "mcp",
    name: "Newslogger MCP",
    summary: "Ask your agent what shipped in AI this week.",
    description:
      "A hosted MCP server over our daily Newslogger: search posts, get the week's launches by topic, and pull sources into your context.",
    personas: ["vibe-coders", "founders"],
    jobs: { "vibe-coders": "context", founders: "ops" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://bitroot.org/blog/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    tags: ["news", "context"],
  },
  {
    slug: "ship-a-saas-pack",
    type: "pack",
    name: "Ship-a-SaaS Pack",
    summary: "Docs, testing, database and design MCPs, wired up together.",
    description:
      "Context7, Playwright, Neon, GitHub and Figma MCPs plus Superpowers, configured to work together for a new SaaS project.",
    personas: ["vibe-coders"],
    jobs: { "vibe-coders": "ship" },
    agents: ["claude-code"],
    install: [],
    source: "https://bitroot.org/packs/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    packItems: ["context7", "playwright-mcp", "neon-mcp", "github-mcp", "figma", "superpowers"],
    tags: ["pack", "saas"],
  },

  // ─── Founders ───────────────────────────────────────────────────────────
  {
    slug: "marketingskills",
    type: "skill",
    name: "Marketing Skills",
    summary: "Copy, CRO, SEO and launch playbooks for your agent.",
    description:
      "Corey Haines' collection of marketing skills: landing-page copy, conversion reviews, SEO, pricing pages, launch plans and more. Ask in plain English and the right skill loads.",
    personas: ["founders"],
    jobs: { founders: "marketing" },
    agents: SKILL_AGENTS,
    install: [
      { agent: "any", label: "skills CLI", command: "npx skills add coreyhaines31/marketingskills" },
    ],
    installSource: "https://mikareyes.com/ai/how-to-install-free-marketing-skills-claude",
    source: "https://github.com/coreyhaines31/marketingskills",
    author: "Corey Haines",
    tier: "open",
    status: "live",
    trending: true,
    tags: ["marketing", "copywriting", "seo"],
  },
  {
    slug: "claude-seo",
    type: "skill",
    name: "Claude SEO",
    summary: "Site audits, technical SEO and content briefs.",
    description:
      "A community SEO skill set that audits pages, checks technical SEO and schema, and drafts content briefs from your site.",
    personas: ["founders"],
    jobs: { founders: "marketing" },
    agents: ["claude-code"],
    install: [],
    source: "https://github.com/AgriciDaniel/claude-seo",
    author: "AgriciDaniel",
    tier: "open",
    status: "live",
    tags: ["seo"],
  },
  {
    slug: "posthog-mcp",
    type: "mcp",
    name: "PostHog MCP",
    summary: "Ask your analytics questions in plain English.",
    description:
      "PostHog's MCP server lets your agent query events, funnels, feature flags and errors. Handy for a Monday metrics check without opening a dashboard.",
    personas: ["founders", "vibe-coders"],
    jobs: { founders: "ops", "vibe-coders": "stack" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://posthog.com/docs/model-context-protocol",
    author: "PostHog",
    tier: "open",
    status: "live",
    tags: ["analytics"],
  },
  {
    slug: "bitroot-founder-os",
    type: "skill",
    name: "Bitroot Founder OS",
    summary: "Investor updates, deck critiques, pricing teardowns, launch lists.",
    description:
      "Skills for the founder jobs nobody teaches: a monthly investor update from your numbers, a blunt pitch-deck critique, a pricing-page teardown and a launch checklist.",
    personas: ["founders"],
    jobs: { founders: "ops" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/founders/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "email",
    status: "coming-soon",
    tags: ["investors", "pitch", "pricing"],
  },
  {
    slug: "bitroot-analytics-skill",
    type: "skill",
    name: "Bitroot Analytics skill",
    summary: "Set up PostHog the way we run it.",
    description:
      "Events, funnels, a `site` super property and identify-on-signup, set up the way we run analytics across Bitroot sites.",
    personas: ["founders", "vibe-coders"],
    jobs: { founders: "ops", "vibe-coders": "stack" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/founders/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "open",
    status: "coming-soon",
    tags: ["analytics", "posthog"],
  },
  {
    slug: "platter-deals-mcp",
    type: "mcp",
    name: "Platter Deals MCP",
    summary: "Ask which startup deals and credits you qualify for.",
    description:
      "A hosted MCP server over Bitroot Platter: describe your startup and get the credits and discounts that fit, with links to claim them.",
    personas: ["founders"],
    jobs: { founders: "deals" },
    agents: ["claude-code", "codex", "cursor"],
    install: [],
    source: "https://platter.bitroot.org",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "open",
    status: "coming-soon",
    tags: ["deals", "credits"],
  },
  {
    slug: "founder-launch-pack",
    type: "pack",
    name: "Founder Launch Pack",
    summary: "Founder OS, a Product Hunt kit, cold email and a metrics agent.",
    description:
      "Founder OS plus a Product Hunt launch kit, a cold-email skill and a weekly-metrics agent that reads PostHog and writes your update.",
    personas: ["founders"],
    jobs: { founders: "marketing" },
    agents: SKILL_AGENTS,
    install: [],
    source: "https://bitroot.org/packs/",
    author: "Bitroot",
    builtByBitroot: true,
    tier: "paid",
    status: "coming-soon",
    packItems: ["bitroot-founder-os", "marketingskills", "posthog-mcp"],
    tags: ["pack", "launch"],
  },
];

export function itemPath(item: Pick<CatalogItem, "type" | "slug">) {
  return `${TYPE_META[item.type].path}${item.slug}/`;
}

export function itemsOfType(type: CatalogType) {
  return catalog.filter((i) => i.type === type);
}

export function itemsForPersona(persona: Persona) {
  return catalog.filter((i) => i.personas.includes(persona));
}

export function findCatalogItem(type: CatalogType, slug: string) {
  return catalog.find((i) => i.type === type && i.slug === slug);
}

export function catalogBySlug(slug: string) {
  return catalog.find((i) => i.slug === slug);
}

export function typeBadge(item: CatalogItem) {
  return item.kind === "sdk" ? "SDK" : TYPE_META[item.type].singular;
}

/* ─── "Works with" logo strip ─────────────────────────────────────────── */

/** Agents we have a logo for, in display priority order. */
export type LogoAgent = "claude" | "codex" | "hermes" | "cursor" | "gemini" | "copilot";

export const LOGO_AGENT_LABELS: Record<LogoAgent, string> = {
  claude: "Claude Code",
  codex: "Codex",
  hermes: "Hermes Agent",
  cursor: "Cursor",
  gemini: "Gemini CLI",
  copilot: "GitHub Copilot",
};

const LOGO_ORDER: LogoAgent[] = ["claude", "codex", "hermes", "cursor", "gemini", "copilot"];

const LOGO_OF: Partial<Record<Agent, LogoAgent>> = {
  "claude-code": "claude",
  codex: "codex",
  cursor: "cursor",
  "gemini-cli": "gemini",
};

/**
 * Agent products listed as supporting the Agent Skills (SKILL.md) format in
 * the official showcase: agentskills.io/clients, source
 * github.com/agentskills/agentskills docs/snippets/clients.jsx (46 entries,
 * incl. Claude Code, ChatGPT & Codex, Cursor, Gemini CLI, GitHub Copilot,
 * Hermes Agent). Checked 2026-11-03. Update the count when that list changes.
 */
export const SKILL_CLIENT_COUNT = 46;
const SKILL_LOGOS: LogoAgent[] = ["claude", "codex", "hermes"];

export type WorksWith = {
  /** Logos to show, max 3. */
  logos: LogoAgent[];
  /** How many more agents beyond the logos (a real count, never a guess). */
  more: number;
  /** MCP servers run in any MCP client; we don't claim a number for that. */
  anyMcp: boolean;
  /** SDKs aren't tied to an agent. */
  anyStack: boolean;
};

function isSkillFormat(item: CatalogItem) {
  if (item.type === "mcp") return false;
  return item.type === "skill" || SKILL_AGENTS.every((a) => item.agents.includes(a));
}

export function worksWith(item: CatalogItem): WorksWith {
  if (isSkillFormat(item)) {
    return { logos: SKILL_LOGOS, more: SKILL_CLIENT_COUNT - SKILL_LOGOS.length, anyMcp: false, anyStack: false };
  }
  if (item.agents.includes("any")) return { logos: [], more: 0, anyMcp: false, anyStack: true };
  const all = item.agents
    .map((a) => LOGO_OF[a])
    .filter((l): l is LogoAgent => !!l)
    .sort((x, y) => LOGO_ORDER.indexOf(x) - LOGO_ORDER.indexOf(y));
  const logos = all.slice(0, 3);
  return {
    logos,
    // MCP items say "any MCP app" instead of counting the listed extras.
    more: item.type === "mcp" ? 0 : all.length - logos.length,
    anyMcp: item.type === "mcp",
    anyStack: false,
  };
}

/** Shelf-level strip: the widest support of any item on that shelf. */
export function worksWithType(type: CatalogType): WorksWith {
  const rows = itemsOfType(type).map(worksWith);
  const seen = new Set(rows.flatMap((r) => r.logos));
  const logos = LOGO_ORDER.filter((l) => seen.has(l)).slice(0, 3);
  const widest = Math.max(0, ...rows.map((r) => r.logos.length + r.more));
  return {
    logos,
    more: Math.max(0, widest - logos.length),
    anyMcp: rows.some((r) => r.anyMcp),
    anyStack: logos.length === 0 && rows.some((r) => r.anyStack),
  };
}

export function worksWithLabel(w: WorksWith) {
  if (w.anyStack) return "Works with any app or agent";
  const names = w.logos.map((l) => LOGO_AGENT_LABELS[l]);
  const tail = w.more > 0 ? ` and ${w.more} more agents` : w.anyMcp ? " and any MCP app" : "";
  return `Works with ${names.join(", ")}${tail}`;
}

export const TIER_LABELS: Record<Tier, string> = {
  open: "Free",
  email: "Free with email",
  paid: "Paid",
};
