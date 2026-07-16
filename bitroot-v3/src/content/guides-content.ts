/**
 * Rich guide content. Guides are long-form; each node is either prose or a code block.
 * Nodes render in order inside a "reading column" layout.
 */

import type { Category } from "./data";

export type GuideNode =
  | { type: "p"; body: string }
  | { type: "h2"; body: string; id: string }
  | { type: "h3"; body: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "note" | "warn" | "tip"; body: string }
  | {
      type: "code";
      lang: string;
      filename?: string;
      source: string;
    }
  | { type: "snippet"; title?: string; body: string }
  | {
      type: "linklist";
      items: { title: string; url?: string; meta?: string; note?: string }[];
    }
  | { type: "divider" };

export type GuideReference = {
  slug: string;
  category: Category;
  note?: string;
};

export type GuideContent = {
  slug: string;
  tagline: string;
  timeEstimate: string;
  youWillNeed: string[];
  youWillEndUpWith: string;
  toc: { label: string; id: string }[];
  body: GuideNode[];
  referenced?: GuideReference[];
};

export const guidesContent: Record<string, GuideContent> = {
  "automate-marketing-ops-with-claude-cowork": {
    slug: "automate-marketing-ops-with-claude-cowork",
    tagline:
      "A hands-on guide to automating marketing reporting and campaign builds with Claude Cowork — including the exact workflows Anthropic's own marketing operations team runs, from a weekly metrics review to end-to-end event builds.",
    timeEstimate: "1–2 hours to set up your first automation",
    youWillNeed: [
      "Claude Desktop app (Pro plan $20/month minimum; Max plan $100/month for high-volume automation)",
      "Marketing tech stack connected (HubSpot, Google Analytics, Slack, Google Drive minimum)",
      "1–2 hours to set up your first automation",
      "Basic file organization (you'll create a \"Claude Cowork\" folder structure)",
      "Willingness to iterate (first automation gets faster each time after)",
    ],
    youWillEndUpWith:
      "Fully automated weekly or monthly marketing reports (Anthropic's own case study: 1–2 days of manual work down to up to 2 hours), an automated campaign build system that processes requests on schedule, a reusable \"Skills\" library for your team's recurring tasks, and a human-in-the-loop approval system — Claude generates, you review, you ship.",
    toc: [
      { label: "1. Why teams are switching", id: "why-switching" },
      { label: "2. How Cowork actually works", id: "how-it-works" },
      { label: "3. Workflow: weekly metrics report", id: "workflow-weekly-report" },
      { label: "4. Workflow: event & campaign builds", id: "workflow-campaign-build" },
      { label: "5. Set it up, step by step", id: "setup" },
      { label: "6. Structure your folder", id: "folder-structure" },
      { label: "7. Building custom skills", id: "building-skills" },
      { label: "8. Common mistakes", id: "common-mistakes" },
      { label: "9. FAQ", id: "faq" },
      { label: "10. Your challenge", id: "challenge" },
      { label: "11. Resources", id: "resources" },
    ],
    body: [
      { type: "h2", body: "Why marketing ops teams are switching to Claude Cowork", id: "why-switching" },
      { type: "h3", body: "The gap between AI tools and embedded workflows" },
      {
        type: "p",
        body: "Most marketing teams have tried AI chat tools. Few have embedded them into actual workflows. The difference comes down to context and automation.",
      },
      {
        type: "p",
        body: "Traditional AI usage looks like this: open ChatGPT or Claude web, paste data manually, copy output, paste into Slack or email or Google Sheets, reformat to match your brand, repeat next week.",
      },
      {
        type: "p",
        body: "Claude Cowork removes the manual steps and automates the repetition. It reads your files, connects to your tools, executes multi-step sequences, and ships final deliverables — all scheduled and recurring.",
      },
      { type: "h3", body: "What makes Claude Cowork different" },
      {
        type: "p",
        body: "Anthropic launched Cowork with file-first context (upload your brand guide once, it loads on every task), tool integration (connect HubSpot, Google Analytics, Slack — Cowork queries them live), Skills (turn a successful output into a permanent, reusable automation), scheduling (run the same report every Friday at 5 AM automatically), and Projects (your folder, instructions, and task history stay between sessions).",
      },
      {
        type: "p",
        body: "Cowork isn't a chatbot with extra buttons. It's an agent that reads your stack, follows your processes, and executes autonomously.",
      },
      { type: "h3", body: "Why this matters for marketing ops" },
      {
        type: "p",
        body: "Marketing operations teams face four persistent pain points:",
      },
      {
        type: "ol",
        items: [
          "Tool sprawl: data in Salesforce, ads in Meta, email in HubSpot, analytics in GA4 — reporting requires exporting from 5+ places",
          "Brand consistency: AI outputs generic copy; your brand has specific rules about tone, length, and vocabulary",
          "Repetition: same reports, same approvals, same campaign briefs every week",
          "Handoff delays: marketing generates a brief, design waits, sales ignores the deck by Thursday",
        ],
      },
      {
        type: "p",
        body: "Cowork solves all four. Once you build the automation, it stays built.",
      },

      { type: "h2", body: "How Claude Cowork actually works (for marketing)", id: "how-it-works" },
      { type: "h3", body: "The three layers of Cowork" },
      {
        type: "p",
        body: "Layer 1: Context — your folder. Everything in your Cowork folder is context. Cowork reads it all automatically before every task, which is why outputs match your brand without you repeating the rules each time.",
      },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
├── ABOUT ME/
│   ├── Brand guidelines.pdf
│   ├── Campaign strategy (FY2026).txt
│   ├── Audience persona (ICP).md
│   └── KPI targets.xlsx
├── PROJECTS/
│   ├── Q3 product launch/
│   │   └── Campaign brief (draft).md
│   └── Black Friday 2026/
│       └── Email sequence outline.txt
└── TEMPLATES/
    ├── Weekly report template.md
    ├── Competitive brief skeleton.md
    └── Campaign audit checklist.txt`,
      },
      {
        type: "p",
        body: "Layer 2: Skills — reusable workflows. A \"Skill\" is a permanent recipe for a task. After your first successful report automation, you tell Claude: \"Create a Skill to remember this.\" Cowork generates a skill file that includes what data to pull, how to format it, what insights to highlight, and who to send it to. Next week, the same skill runs again — no re-explaining needed.",
      },
      {
        type: "p",
        body: "Layer 3: Connectors — live data. Connectors (via Anthropic's MCP protocol) let Cowork query your actual tools without exporting CSVs — Google Analytics for last week's traffic by channel, HubSpot for pipeline by stage, Slack for delivering the finished report, Google Drive or Sheets for reading the latest performance data and writing analysis. Without connectors, you export a CSV, Cowork analyzes it, and you re-import results. With connectors, it happens in one flow.",
      },

      { type: "h2", body: "Real workflow #1: generating the weekly marketing metrics report", id: "workflow-weekly-report" },
      { type: "h3", body: "The problem it solves (from Anthropic's case study)" },
      {
        type: "p",
        body: "In Anthropic's marketing operations, the business moves faster than a traditional reporting pipeline. Ian Chan, who prepares the weekly marketing metrics review, used to spend one to two days every week tracking down data and validating it across multiple platforms — Google Analytics for traffic metrics, HubSpot for lead generation numbers, the data warehouse for historical context, Slack for sales team priorities, and call transcripts for emerging patterns.",
      },
      {
        type: "p",
        body: "After setting up Claude Cowork automation, this workflow now takes up to two hours — primarily review and approval.",
      },
      { type: "h3", body: "How it works" },
      {
        type: "p",
        body: "Every Sunday evening at an automated time, a scheduled task runs: Cowork reads the previous week's review, checks Slack for sales team focus areas, queries the data warehouse for current metrics, checks Google Analytics and HubSpot live, and leaves a folder with metrics tables and suggested focus areas.",
      },
      {
        type: "p",
        body: "On Monday morning, Ian opens Claude Cowork and pulls the initial report. It contains metrics tables and suggested headlines and areas of focus. He reviews and confirms or adjusts the focus areas, then tells Claude to expand on the analysis with supporting details and examples. Claude generates leadership slides from the same data and narrative, and any follow-ups become Asana tasks.",
      },
      { type: "h3", body: "Key features of this workflow (from Anthropic's implementation)" },
      {
        type: "ul",
        items: [
          "Data validation: when numbers don't line up, Claude flags the mismatch instead of guessing — after a sales reorg, Claude flagged misaligned reporting structures",
          "Adaptive context: the process runs on connectors to marketing platforms and three skills — a prep skill that drives report assembly (focus, headlines, expansion), a proofreading skill that checks every number in the draft against verified sources, and an action-items skill that turns follow-ups into Asana tasks",
          "Continuous improvement: at the end of each weekly session, Ian asks Claude to summarize what should go back into the skills — new structures, corrections, framing preferences",
          "Shifted workload: the entire process, which used to take up to two days of work, now takes up to two hours — freeing Ian to focus on helping marketers frame their own questions, refine prompts, and interpret numbers they pull directly from Claude",
        ],
      },

      { type: "h2", body: "Real workflow #2: automating event builds and campaign operations", id: "workflow-campaign-build" },
      { type: "h3", body: "The problem it solves (from Anthropic's case study)" },
      {
        type: "p",
        body: "Setting up marketing campaign infrastructure is traditionally one of the most manual processes in marketing. Every event, webinar, or integrated campaign requires setup across multiple vendors — CRM (Salesforce), marketing automation platform (HubSpot), event management platform (Swoogo), email tools, and landing page builders. Each platform requires manual configuration, and integrations between them are rarely complete.",
      },
      {
        type: "p",
        body: "Before Claude Cowork, Annabel Custer, who focuses on campaign operations, picked up every request from a dedicated Slack channel and worked through the sequence manually. With Claude Cowork, this workflow is almost entirely handled by Claude, with human review at key checkpoints.",
      },
      { type: "h3", body: "The architecture: dispatcher + specialist skills" },
      {
        type: "p",
        body: "This is the \"agentic\" pattern — skills calling other skills. On request intake, a request comes in (\"Build email nurture sequence for DevOps audience\"), a dispatcher skill reads the channel and request details, and routes to the appropriate specialist skill based on request type.",
      },
      {
        type: "p",
        body: "In specialist skill execution, the specialist skill queries relevant libraries — brand guidelines, email templates, past performance — generates the output (emails, landing pages, and so on), and routes it to an audit specialist.",
      },
      {
        type: "p",
        body: "For quality assurance, the audit agent starts with no prior context: it submits a test registration on the live landing page, opens the confirmation email in Gmail, marks the Asana task complete if everything looks right, and Annabel reviews the results before they ship.",
      },
      { type: "h3", body: "The five specialist skills (from Anthropic's implementation)" },
      {
        type: "p",
        body: "Annabel has set up specialist skills for:",
      },
      {
        type: "ol",
        items: [
          "Event-build skill — handles the full sequence end-to-end: CRM campaign creation, marketing automation workflows, event platform setup, email drafting, landing page generation, and integrations",
          "Webinar-landing-page creation skill — spins up landing pages for webinars",
          "Audit skill — run by a separate fresh Claude instance, verifies output before task completion",
          "Apply-to-attend skill — handles in-flight changes to the registration flow",
          "Approval-support skill — handles event approvals and sends scheduled emails",
        ],
      },
      {
        type: "p",
        body: "Annabel also maintains a \"manager\" agent, separate from the workflow. When a run misfires, she opens the manager and asks it to analyze what happened and propose adjustments. Anything worth keeping goes back into the relevant skill.",
      },
      { type: "h3", body: "Why this matters" },
      {
        type: "p",
        body: "While these automated workflows save significant time, Annabel's primary motivation to build them was quality of work. As the marketing team scales, marketers cloning event pages from whatever template is nearby can produce bugs — confirmation emails with wrong city names, broken landing pages. With Claude Cowork, she gets consistency across builds, at scale.",
      },
      {
        type: "p",
        body: "As Claude handles repetitive tasks, Annabel can focus on strategic projects: enablement, process optimization, and campaign architecture improvements.",
      },

      { type: "h2", body: "How to set it up, step by step", id: "setup" },
      {
        type: "p",
        body: "Step 1 — create your folder structure. In your Documents folder, create an ABOUT ME folder with brand voice and KPI benchmark files, a PROJECTS folder with your last report, and a TEMPLATES folder with the report format you want Cowork to follow:",
      },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
├── ABOUT ME/
│   ├── Brand voice.txt
│   │   "Tone: conversational, data-driven, no hype.
│   │    Avoid: synergy, leverage, circle back.
│   │    Audience: CMOs and growth leaders."
│   └── KPI benchmarks.txt
│       "Weekly MQL target: 150
│        Weekly SQL target: 40
│        Monthly CAC target: $450"
├── PROJECTS/
│   └── Weekly reporting/
│       └── Last week's report.md
└── TEMPLATES/
    └── Weekly report format.md
        "# Weekly Marketing Report [DATE]
         ## Traffic
         - Total sessions:
         - Source breakdown:
         - Key pages:
         ## Lead Gen
         - MQLs:
         - SQLs:
         - CAC:
         ## Trends & Insights
         ## Recommended Actions"`,
      },
      {
        type: "p",
        body: "Step 2 — connect your data sources. In Claude Desktop, go to Settings → MCP Servers and enable Google Analytics (via Coupler.io MCP or a native connector), HubSpot (native MCP available), and Slack for sending the finished report. Note on Coupler.io: it provides MCP support for 400+ data sources including GA4, Meta, Google Ads, and Salesforce — useful for tools that don't have direct MCP connectors.",
      },
      {
        type: "p",
        body: "Step 3 — create your first report manually. Open Claude Cowork, select your \"Weekly reporting\" project folder, and prompt it:",
      },
      {
        type: "snippet",
        title: "Weekly report prompt",
        body: "Read my brand voice, KPI benchmarks, and last week's report template.\n\nConnect to Google Analytics and pull: total sessions, users, bounce rate for this week; top 5 pages by sessions; traffic breakdown by source (organic, direct, paid, referral).\n\nConnect to HubSpot and pull: MQLs generated this week; SQLs generated this week; deals closed this week; current pipeline value.\n\nCompare to last week and include % change for each metric, and whether we're tracking to targets.\n\nWrite analysis: what's moving? What's flat? Which channels are performing? What should we do next?\n\nFormat it exactly like the template. Use the brand voice: conversational, data-driven, no corporate jargon.\n\nSend the final report to my Slack #marketing-metrics channel.",
      },
      {
        type: "p",
        body: "Cowork will read your files, query GA4 and HubSpot live, calculate trends, write analysis in your voice, and post to Slack.",
      },
      {
        type: "p",
        body: "Step 4 — turn it into a reusable skill. Once the report looks good, tell Claude: \"Create a Skill to remember this report workflow. I want to run it every Friday at 5 AM automatically.\" Claude generates a skill file. You review it, verify it's correct, and save it to your Cowork folder.",
      },
      {
        type: "p",
        body: "Step 5 — schedule it. In Cowork, go to \"Dispatch\" (the scheduling tab) and set the frequency to every Friday, the time to 5:00 AM, the skill to Weekly Marketing Report, and the action to run and post to Slack. From now on, your report runs automatically.",
      },

      { type: "h2", body: "How to structure your Cowork folder for success", id: "folder-structure" },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
│
├── ABOUT ME/
│   ├── Brand voice rules.txt
│   ├── Company mission & positioning.md
│   ├── Target audience (ICP).txt
│   ├── Competitor positioning.txt
│   ├── Visual guidelines (text instructions).txt
│   └── KPI targets for 2026.xlsx
│
├── PROJECTS/
│   ├── Weekly reporting/
│   │   ├── Last week's report.md
│   │   ├── KPI targets for reporting.txt
│   │   └── Analytics snapshot.txt
│   │
│   ├── Q3 product launch/
│   │   ├── Campaign brief.md
│   │   ├── Target audience profile.txt
│   │   ├── Launch timeline.txt
│   │   └── Competitor analysis.txt
│   │
│   └── Content calendar/
│       ├── Editorial guidelines.txt
│       ├── Blog topics (backlog).txt
│       └── Publishing schedule.xlsx
│
├── TEMPLATES/
│   ├── Weekly report format.md
│   ├── Campaign brief skeleton.md
│   ├── Email sequence outline.md
│   ├── Landing page outline.md
│   ├── Competitive brief template.md
│   └── Content audit checklist.md
│
├── LIBRARY/
│   ├── Past campaigns (30 best performing).md
│   ├── Email subject line examples.txt
│   ├── CTA phrasing guide.txt
│   └── Audience segments guide.txt
│
└── CLAUDE OUTPUTS/
    ├── Weekly reports/
    ├── Campaign drafts/
    ├── Content recommendations/
    └── Analysis & audits/`,
      },
      { type: "h3", body: "What each folder does" },
      {
        type: "ul",
        items: [
          "ABOUT ME: your brand DNA. Never changes. Cowork reads this on every task to ensure consistency.",
          "PROJECTS: active work. Campaign briefs, client info, timelines. Delete or archive after shipping.",
          "TEMPLATES: reusable formats. Cowork follows these structures when producing output.",
          "LIBRARY: competitive intelligence, past successful campaigns, subject line examples. Update quarterly.",
          "CLAUDE OUTPUTS: where Cowork saves finished work. Review before shipping. Archive old work monthly.",
        ],
      },
      {
        type: "p",
        body: "Example brand voice rules.txt:",
      },
      {
        type: "code",
        lang: "md",
        filename: "Brand voice rules.txt",
        source: `Tone: Expert, accessible, no corporate jargon
Voice: Second person ("you"), active voice
Do: Be specific. Use numbers. Show, don't tell.
Don't: Use "leverage," "synergy," "empower," "seamless"
Length: Long-form blogs (1500–2500 words), social posts (<100 characters)

Example good: "We cut onboarding from 2 weeks to 3 days by
automating the intake form."

Example bad: "Our seamless integration solution unlocks
unprecedented value for forward-thinking teams."`,
      },

      { type: "h2", body: "Building custom skills for your team", id: "building-skills" },
      {
        type: "p",
        body: "A Skill is a reusable workflow file stored in your Cowork folder. When you tell Claude \"Create a Skill,\" it generates a file containing the exact steps from that successful run, plus timing and routing.",
      },
      { type: "h3", body: "How to create a skill" },
      {
        type: "ol",
        items: [
          "Do the task manually in Cowork — prompt: \"Pull GA4 data, HubSpot data, and generate a weekly report in Markdown format following my template.\" Cowork does it. You review. It looks good.",
          "Ask Claude to create a Skill — \"Create a Skill to remember this workflow. I want to run it every Friday at 5 AM and post the result to Slack.\"",
          "Claude generates the Skill file — it creates a skill file with the exact steps from that run, plus timing and routing.",
          "Save the Skill to Claude Cowork/SKILLS/Weekly Report.skill",
          "Run the Skill — next week, prompt \"Run my Weekly Report skill.\" It runs automatically.",
        ],
      },
      { type: "h3", body: "Chaining skills together" },
      {
        type: "p",
        body: "Skills gain power when chained. A Dispatcher Skill receives a campaign brief and routes it to a Content Strategy Skill (generates audience insights and messaging pillars), which feeds an Email Writer Skill (uses the pillars to write a nurture sequence), which feeds an Audit Skill (QAs the content) and ends with a Slack notification to marketers for approval. Each skill reads the output of the previous one — the final output is better than manual work because each step builds on the last with context.",
      },
      { type: "h3", body: "Updating skills" },
      {
        type: "p",
        body: "As your team learns what works, update skills. For example, your first report had 10 sections; after month 1, only 4 matter to leadership. Edit the skill: \"Remove trends and competitors sections, keep: traffic, leads, pipeline, actions.\" The next report is tighter. Edit skills directly in your folder — no need to recreate them.",
      },

      { type: "h2", body: "Common mistakes & how to fix them", id: "common-mistakes" },
      { type: "h3", body: "Mistake #1: not having a brand voice file" },
      {
        type: "p",
        body: "Problem: Cowork outputs feel generic — reads like ChatGPT, not your company. Why: you never told Claude how your company talks. Fix: spend 30 minutes writing your brand voice rules. Include it in every prompt.",
      },
      {
        type: "p",
        body: "Before: \"Write a campaign email.\" After: \"Read my brand voice rules. Write a campaign email in that voice. Use short sentences, active voice, specific numbers, no jargon.\" Result: outputs actually sound like your company.",
      },
      { type: "h3", body: "Mistake #2: feeding outdated data" },
      {
        type: "p",
        body: "Problem: you manually update a CSV each week, upload it to Cowork — the report includes old numbers. Why: manual data is stale data; by Friday, Tuesday's numbers are wrong. Fix: use connectors instead. Connect Cowork directly to GA4, HubSpot, Salesforce — it pulls live data at runtime.",
      },
      {
        type: "p",
        body: "Before: export CSV Friday morning, hope it's current. After: Cowork queries live APIs at 5 AM Friday — always current.",
      },
      { type: "h3", body: "Mistake #3: asking Cowork to do too much in one skill" },
      {
        type: "p",
        body: "Problem: \"Build a campaign, audit it, post it, and notify leadership.\" Cowork gets confused halfway through. Why: multi-step complex tasks need multiple skills chained, not one mega-skill. Fix: break it into smaller skills — one to build, one to audit, one to notify. Before: run the whole workflow in one skill (high error rate, confusing output). After: Build Skill → Audit Skill → Notify Skill (clean handoffs).",
      },
      { type: "h3", body: "Mistake #4: setting skills to run unattended, with no human review" },
      {
        type: "p",
        body: "Problem: \"Schedule it completely automated. Ship to production without review.\" Why: AI can hallucinate — a skill might generate copy with broken links, wrong product info, or brand misalignment. Fix: always add human approval. Pattern: Cowork generates → posts to Slack → marketer approves → Cowork ships.",
      },
      {
        type: "p",
        body: "Example approval flow: Cowork posts \"Campaign draft ready. Review in #campaign-audits.\" The marketer replies \"Subject line reads generic. Rewrite more curiosity-driven.\" Cowork rewrites it. The marketer says \"Perfect. Approved. Ship.\" Cowork posts live.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Human-in-the-loop takes 2 minutes. Fixing a shipped mistake takes 2 hours.",
      },
      { type: "h3", body: "Mistake #5: overloading your folder with every single file" },
      {
        type: "p",
        body: "Problem: you dump 200 files into the Cowork folder — Cowork reads all of them before each task, producing slow, confused outputs. Why: more context means slower processing, and old files introduce noise. Fix: keep your folder clean — ABOUT ME 5–8 files max (only static content), PROJECTS only active projects (archive finished ones monthly), TEMPLATES 6–10 max, LIBRARY the top 30 past campaigns rather than 500, culled quarterly. A lean folder gives fast, focused outputs.",
      },
      { type: "h3", body: "Mistake #6: never iterating on outputs" },
      {
        type: "p",
        body: "Problem: \"Cowork generated something. Not perfect, but good enough. Shipped it.\" Why: you skipped the correction loop. Fix: when an output is close but off, don't start over — tell Claude exactly what's wrong (\"the subject line is too long, make it under 20 characters; the CTA is vague, say what they get, fix both and regenerate\"). Claude reads the feedback and regenerates. This is the core muscle: prompt, review, correct, iterate. First campaign takes 3 iterations. Fifth campaign takes 1.",
      },
      { type: "h3", body: "Mistake #7: assuming Cowork can handle your entire stack" },
      {
        type: "p",
        body: "Problem: \"Why isn't Cowork pulling data from my custom internal tool?\" Why: Cowork needs a connector (MCP server) for each tool, and custom tools rarely have one. Fix: for tools without MCP, export data to a Google Sheet for Cowork to read, use Zapier to push data to Google Drive for Cowork to pick up, or use Coupler.io MCP as a universal translator covering 400+ sources. Most common tools (GA4, HubSpot, Salesforce, Slack, Google Workspace) have native MCP — niche tools don't, so plan accordingly.",
      },

      { type: "h2", body: "FAQ: marketing ops specific questions", id: "faq" },
      { type: "h3", body: "How much does Claude Cowork cost?" },
      {
        type: "p",
        body: "Claude Cowork requires a Claude Desktop subscription. Pro plan is $20/month, Max plan is $100/month. For small teams (1–2 people) doing light automation (1–2 scheduled reports), Pro is sufficient. For teams of 3+ running 5+ automated workflows daily, Max provides higher token limits and is more cost-effective.",
      },
      { type: "h3", body: "Can Cowork work with Salesforce data?" },
      {
        type: "p",
        body: "Yes. Anthropic supports Salesforce connectors via MCP — if yours is set up, Cowork queries Salesforce directly. As a workaround, you can export a Salesforce report to CSV, upload it to Google Drive, and tell Cowork to analyze the report in your Drive.",
      },
      { type: "h3", body: "What if I have sensitive customer data? Can Cowork see it?" },
      {
        type: "p",
        body: "Yes, Cowork reads files in your folder — so don't store raw PII there. Instead store aggregated data (\"250 customers in Northeast segment\"), anonymized examples (\"typical customer: mid-market SaaS, $5M ARR\"), and never raw CSVs with names, emails, or phone numbers. For compliance-heavy work, Anthropic offers enterprise deployments with self-hosted options.",
      },
      { type: "h3", body: "What if Cowork generates bad data or hallucinates in a report?" },
      {
        type: "p",
        body: "That's why humans approve before shipping. Cowork can misread a CSV, transpose numbers, or misinterpret definitions. Always review the output before sending, spot-check one number against the source, and trust but verify — it usually gets 95% right, but the 5% wrong can be costly.",
      },
      {
        type: "p",
        body: "If you spot a mistake: tell Cowork, \"The Q2 revenue should be $850K, not $805K. Fix the report.\" Cowork recalculates, you review, you ship. This approval loop takes 2 minutes per report.",
      },
      { type: "h3", body: "Can our team collaborate on Skills, or does one person own them?" },
      {
        type: "p",
        body: "Both work. Skills live in your shared Cowork folder — Person A creates a skill for email, Person B runs it and gets the output, Person C updates it based on what worked, and everyone has access. Just clarify ownership to avoid conflicts, e.g.:",
      },
      {
        type: "code",
        lang: "md",
        filename: "Email Sequence Builder Skill",
        source: `What it does: Generates 5-email nurture sequence
When to use it: Any nurture campaign, product launch emails
Input: Campaign brief (audience, goal, timeline)
Output: Markdown with 5 emails + subject lines + timing
Owner: Jane (jane@company.com) — ask before editing
Last updated: July 2026`,
      },
      { type: "h3", body: "Does Cowork integrate with Zapier or Make?" },
      {
        type: "p",
        body: "Not directly yet. But Zapier can trigger Cowork indirectly: form submission → Zapier → Google Drive upload → Cowork reads → generates → posts to Slack. It's a workaround, but it works for some flows. Anthropic is expanding integrations regularly.",
      },
      { type: "h3", body: "What happens if Cowork makes a mistake and we ship a bad campaign?" },
      {
        type: "p",
        body: "That's on the process, not the tool. Cowork generates and posts to Slack — not shipped yet. You review, catch the mistake before it goes live, ask Cowork to fix it, approve, then ship. If you skip approval and ship anyway, that's on you; the tool did its job, the process failed.",
      },
      { type: "h3", body: "Can we use Cowork for compliance/legal stuff (GDPR, CAN-SPAM)?" },
      {
        type: "p",
        body: "Cowork helps, but it's not your lawyer. It can add an \"Unsubscribe\" footer to emails, include GDPR consent language, and remind you of CAN-SPAM requirements. It can't guarantee compliance, keep up with every regulatory change, or review your specific privacy policy. Use it as a helper, not a replacement for legal review.",
      },
      { type: "h3", body: "How do we measure if Cowork is actually saving time?" },
      {
        type: "p",
        body: "Track it. Before Cowork: weekly report 90 minutes, campaign brief 2 hours, content repurposing 2 hours — 4.5 hours/week total. After Cowork (month 1): weekly report 15–30 minutes (review plus approval), campaign brief 30–45 minutes (review plus revisions), content repurposing 20–30 minutes (review) — 1–1.5 hours/week total. Time saved: 3–3.5 hours/week. This freed capacity shifts your team to higher-value work: strategy, optimization, enablement.",
      },

      { type: "h2", body: "Your challenge: build one automation this week", id: "challenge" },
      {
        type: "p",
        body: "Don't try to automate your entire ops stack tomorrow. Pick one repeating task. Best starting points: your weekly report (easiest, highest ROI), email campaigns (medium complexity, high value), or competitive briefs (medium difficulty, strategic). Don't start with full-stack marketing orchestration — too complex for week 1.",
      },
      {
        type: "ol",
        items: [
          "Download Claude Desktop",
          "Create your Cowork folder structure",
          "Write your brand voice rules (30 minutes)",
          "Build your first automation manually",
          "Turn it into a skill",
          "Schedule it",
        ],
      },
      {
        type: "p",
        body: "By next Friday, your automation is running on its own.",
      },

      { type: "h2", body: "Authoritative resources for marketing operations automation", id: "resources" },
      {
        type: "linklist",
        items: [
          {
            title: "Claude Desktop Download",
            url: "https://claude.com/download",
            meta: "macOS, Windows",
          },
          {
            title: "MCP Server List",
            url: "https://claude.com/connectors",
            meta: "official",
          },
          {
            title: "Coupler.io MCP",
            url: "https://coupler.io/",
            meta: "400+ data sources",
          },
          {
            title: "How Anthropic's marketing operations team uses Claude Cowork",
            url: "https://claude.com/blog/how-anthropics-marketing-operations-team-uses-claude-cowork-to-automate-reporting-and-campaign-builds",
            note: "Official Anthropic case study — source for the two workflows in this guide",
          },
          {
            title: "How people are using Claude Cowork",
            url: "https://claude.com/blog/how-people-are-using-claude-cowork",
            note: "Official Anthropic blog",
          },
        ],
      },
      {
        type: "p",
        body: "Suggested learning path: month 1 — set up your folder, create brand voice rules, build one automation (weekly report). Month 2 — build 2–3 more automations (campaigns, content repurposing). Month 3 — start chaining skills, refine based on actual usage. Month 4+ — optimize, share with team, expand to more workflows.",
      },
      {
        type: "callout",
        tone: "note",
        body: "This guide is adapted from and based on Anthropic's published guidance. For the official, authoritative source, see Anthropic's blog post on how its marketing operations team uses Claude Cowork, linked above.",
      },
    ],
  },
  "ship-a-waitlist-in-2-hours": {
    slug: "ship-a-waitlist-in-2-hours",
    tagline:
      "Single page. Email capture. Double opt-in. Referral counter. A real admin view. All in the time it takes to watch one Champions League match.",
    timeEstimate: "~2 hours, honestly",
    youWillNeed: [
      "A laptop with Node.js 20+",
      "A free Supabase account (10 min to create)",
      "A Resend account with one verified sending domain (DNS takes 5–30 min)",
      "A Vercel account for deploy",
      "No prior Next.js experience, but some React comfort helps",
    ],
    youWillEndUpWith:
      "A deployed waitlist at your-domain.com with working email confirmation, a referral counter per subscriber, and an admin page at /admin showing signups, sources, and CSV export.",
    toc: [
      { label: "0. Scope check", id: "scope" },
      { label: "1. Scaffold + deps", id: "scaffold" },
      { label: "2. The database", id: "db" },
      { label: "3. Signup API route", id: "signup" },
      { label: "4. Confirmation email", id: "email" },
      { label: "5. The landing page", id: "landing" },
      { label: "6. Referral tracking", id: "referrals" },
      { label: "7. Admin view", id: "admin" },
      { label: "8. Deploy", id: "deploy" },
      { label: "9. What to do next", id: "next" },
    ],
    body: [
      {
        type: "p",
        body: "This guide skips the theory. Every block below is something you actually type, run, or paste. If a step is longer than one action, it gets its own heading. If it's not essential to shipping, it's not here. If you hit an error we didn't cover, open a discussion — we'll add it.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "If you want this even faster, clone the Waitlist Kit directly: `npx create-bitroot@latest my-waitlist --kit waitlist-kit`. This guide builds the same thing from scratch so you understand every line.",
      },

      { type: "h2", body: "0. Scope check", id: "scope" },
      {
        type: "p",
        body: "Before you start, make sure this is actually what you want. A waitlist is correct when:",
      },
      {
        type: "ul",
        items: [
          "You want to gauge interest before building the real thing",
          "You're running a paid ad and need a landing page that collects emails",
          "You're a month out from launch and want to warm a list",
        ],
      },
      {
        type: "p",
        body: "A waitlist is wrong when: you already have a product that works, you already have signups, or you're using it to delay a real launch. In those cases, ship the product.",
      },

      { type: "h2", body: "1. Scaffold + deps", id: "scaffold" },
      {
        type: "p",
        body: "Fresh Next.js 16 project with the App Router. The --turbopack flag is the default in 16, but it doesn't hurt to be explicit.",
      },
      {
        type: "code",
        lang: "bash",
        source: `npx create-next-app@latest my-waitlist --typescript --tailwind --app --no-src-dir
cd my-waitlist
npm install @supabase/supabase-js resend nanoid`,
      },
      {
        type: "snippet",
        title: "Or tell Claude Code to do it",
        body: "Scaffold a Next.js 16 App Router project called `my-waitlist` with TypeScript and Tailwind. Then install `@supabase/supabase-js`, `resend`, and `nanoid` as runtime deps. Keep the default Turbopack dev script. Don't add a src directory.",
      },
      {
        type: "p",
        body: "Three dependencies. Supabase is our database client, Resend sends the confirmation email, nanoid generates URL-safe referral codes. That's it. No auth library, no form library, no state manager — you don't need any of them.",
      },

      { type: "h2", body: "2. The database", id: "db" },
      {
        type: "p",
        body: "Create a Supabase project at supabase.com. Free tier is plenty. Once it's ready, grab the project URL and the service role key (Settings → API). Put them in your .env.local.",
      },
      {
        type: "code",
        lang: "dotenv",
        filename: ".env.local",
        source: `NEXT_PUBLIC_APP_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Your Product <hello@yourdomain.com>"

ADMIN_PASSWORD=replace-me-before-deploy`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "The service role key bypasses row-level security. It must only ever be used in server-side code — never imported into a client component. We're only calling Supabase from API routes, so we're safe.",
      },
      {
        type: "p",
        body: "Now open the Supabase SQL editor and run this once. It creates the table with the fields we need plus a unique index on email so duplicate signups don't spawn duplicate rows.",
      },
      {
        type: "code",
        lang: "sql",
        filename: "supabase / sql editor",
        source: `create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  referral_code text not null unique,
  referred_by text,
  source text,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_unique
  on subscribers (lower(email));`,
      },

      { type: "h2", body: "3. Signup API route", id: "signup" },
      {
        type: "p",
        body: "Create a single POST route that: validates the email, generates a referral code, inserts (or upserts) the row, and kicks off a confirmation email. We'll put the Supabase client in a tiny lib file so any future route can import it.",
      },
      {
        type: "code",
        lang: "ts",
        filename: "lib/supabase.ts",
        source: `import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } },
);`,
      },
      {
        type: "code",
        lang: "ts",
        filename: "app/api/subscribe/route.ts",
        source: `import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export async function POST(req: Request) {
  const { email, referredBy, source } = await req.json();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const referralCode = nanoid(10);

  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        referral_code: referralCode,
        referred_by: referredBy ?? null,
        source: source ?? null,
      },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select("referral_code")
    .single();

  if (error) {
    console.error("subscribe insert failed", error);
    return NextResponse.json({ error: "Try again in a moment." }, { status: 500 });
  }

  await sendConfirmationEmail(email, data.referral_code);

  return NextResponse.json({ ok: true, referralCode: data.referral_code });
}`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Upsert instead of insert means re-submitting the same email is a no-op, not an error. Good UX — nobody cares that they already signed up, they just want it to work.",
      },

      { type: "h2", body: "4. Confirmation email", id: "email" },
      {
        type: "p",
        body: "Resend + a plain HTML template is all you need for the confirmation mail. Don't reach for React Email yet — one template, one style, done.",
      },
      {
        type: "code",
        lang: "ts",
        filename: "lib/email.ts",
        source: `import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendConfirmationEmail(email: string, code: string) {
  const confirmUrl = \`\${process.env.NEXT_PUBLIC_APP_URL}/api/confirm?code=\${code}\`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "One click to confirm your spot",
    html: \`
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="font-size:22px;margin:0 0 12px">You're almost in.</h1>
        <p style="color:#555;line-height:1.55">
          Tap the button below to confirm your email and lock your place on the waitlist.
        </p>
        <a href="\${confirmUrl}"
           style="display:inline-block;background:#171512;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;margin:16px 0">
          Confirm my spot →
        </a>
        <p style="color:#888;font-size:12px">If you didn't sign up, ignore this email.</p>
      </div>
    \`,
  });
}`,
      },
      {
        type: "code",
        lang: "ts",
        filename: "app/api/confirm/route.ts",
        source: `import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  await supabase
    .from("subscribers")
    .update({ confirmed: true })
    .eq("referral_code", code);

  return NextResponse.redirect(
    new URL(\`/welcome?code=\${code}\`, req.url),
  );
}`,
      },

      { type: "h2", body: "5. The landing page", id: "landing" },
      {
        type: "p",
        body: "Now the actual page. One headline, one sub, one input, one button. We're going to skip marketing copy — you bring that — and focus on the mechanics of form submission and the post-submit state.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/page.tsx",
        source: `"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const referredBy =
      new URLSearchParams(window.location.search).get("ref") ?? undefined;
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, referredBy, source: document.referrer }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error ?? "Try again");
      setState("error");
      return;
    }
    setState("sent");
  }

  return (
    <main className="max-w-md mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold tracking-tight">Your Product Name.</h1>
      <p className="mt-3 text-neutral-600">
        One line about what you're building. Join the waitlist for early access.
      </p>

      {state === "sent" ? (
        <p className="mt-8 text-green-700">
          Check your inbox — click the link to confirm your spot.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@work.com"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="bg-black text-white rounded-md px-4 py-2"
          >
            {state === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}

      {state === "error" && (
        <p className="mt-3 text-red-600 text-sm">{errorMsg}</p>
      )}
    </main>
  );
}`,
      },
      {
        type: "p",
        body: "Not pretty — deliberately. You'll restyle this in the next 20 minutes. The mechanics are the point: form → POST → state transition → confirmation. Run `npm run dev` and sign up with your own email. You should receive the confirmation email within a few seconds.",
      },

      { type: "h2", body: "6. Referral tracking", id: "referrals" },
      {
        type: "p",
        body: "Referrals are tracked in two steps: (1) every subscriber has a unique code stored with their row, (2) when someone visits /?ref=CODE, we pass that code back to the API, which stores it as referred_by on the new subscriber. Our page.tsx already reads the ref param. What's left is showing the subscriber their personal referral link on the welcome page.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/welcome/page.tsx",
        source: `export default async function Welcome({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const link = \`\${process.env.NEXT_PUBLIC_APP_URL}/?ref=\${code ?? ""}\`;

  return (
    <main className="max-w-md mx-auto py-24 px-6">
      <h1 className="text-3xl font-bold">You're confirmed. ✓</h1>
      <p className="mt-3 text-neutral-600">
        Move up the list by sharing your personal link:
      </p>
      <code className="block mt-5 p-3 bg-neutral-100 rounded-md text-sm break-all">
        {link}
      </code>
    </main>
  );
}`,
      },
      {
        type: "p",
        body: "Next.js 16's searchParams is now a Promise — you await it. If you're on an older version you can destructure directly.",
      },

      { type: "h2", body: "7. Admin view", id: "admin" },
      {
        type: "p",
        body: "A password-gated server component that lists signups. Real admin panels are overkill for a waitlist. A protected page with a table and a CSV link is more than enough, and you'll thank yourself for not building more.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/admin/page.tsx",
        source: `import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const pass = (await cookies()).get("admin")?.value;
  if (pass !== process.env.ADMIN_PASSWORD) redirect("/admin/login");

  const { data: rows = [] } = await supabase
    .from("subscribers")
    .select("email, confirmed, source, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-6">
        {rows?.length ?? 0} subscribers
      </h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th>Email</th><th>Confirmed</th><th>Source</th><th>When</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r) => (
            <tr key={r.email} className="border-t">
              <td className="py-2">{r.email}</td>
              <td>{r.confirmed ? "✓" : "—"}</td>
              <td className="text-neutral-500">{r.source ?? "direct"}</td>
              <td className="text-neutral-500">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Storing the admin password in a cookie this way is fine for a weekend waitlist, but don't use this pattern for anything with real user data. Upgrade to Clerk or Supabase Auth the moment it's not a waitlist anymore.",
      },

      { type: "h2", body: "8. Deploy", id: "deploy" },
      {
        type: "p",
        body: "Push to GitHub, import into Vercel, paste your env vars, hit deploy. Update NEXT_PUBLIC_APP_URL to your live URL after the first deploy and redeploy once more so confirmation links point at production.",
      },
      {
        type: "code",
        lang: "bash",
        source: `git init
git add .
git commit -m "ship waitlist"
git remote add origin git@github.com:you/my-waitlist.git
git push -u origin main

# Then at vercel.com/new:
#   1. Import the repo
#   2. Paste the env vars from .env.local (update NEXT_PUBLIC_APP_URL)
#   3. Deploy`,
      },

      { type: "h2", body: "9. What to do next", id: "next" },
      {
        type: "p",
        body: "Now go send that URL to five people who you think might care. If any of them don't confirm their email within an hour, your template or sender reputation has an issue — check Resend's dashboard for the event log and fix whatever's wrong before you share more broadly.",
      },
      {
        type: "ul",
        items: [
          "Buy a cheap domain ($10 on Porkbun) and verify it in Resend before launch — deliverability from a fresh domain is always better than sharing one",
          "Add a honey-pot field to catch bots — we skipped it, you'll want it when you post anywhere public",
          "Track conversion in Plausible (or just pageviews) so you know which sources are worth doubling down on",
          "Write 3 Twitter variations for the launch post before you launch — you'll panic otherwise",
        ],
      },
    ],
    referenced: [
      {
        slug: "waitlist-kit",
        category: "kit",
        note: "Clone-ready version of this exact build",
      },
      {
        slug: "readme-generator",
        category: "tool",
        note: "Draft a README for your new repo",
      },
    ],
  },

  "design-planning-workflow": {
    slug: "design-planning-workflow",
    tagline:
      "A single operational guide for setting up a production-ready design workflow — designer tools, Figma structure, MCP/Copilot, and the practical Antigravity ↔ Figma prompts you'll actually paste.",
    timeEstimate: "~20 min read",
    youWillNeed: [
      "An Antigravity account",
      "A Figma account",
      "A GitHub account for Copilot/MCP",
    ],
    youWillEndUpWith:
      "A fully scaffolded design workflow: Antigravity + Figma + MCP, a clean Figma page structure, a working AI-ready handoff page, and a set of reusable prompts for IA, code conversion, and audits.",
    toc: [
      { label: "A. Designer tool setup", id: "tools" },
      { label: "B. Figma setup & organization", id: "figma" },
      { label: "C. Figma + Antigravity workflow", id: "workflow" },
      { label: "Prompts you'll actually use", id: "prompts" },
    ],
    body: [
      {
        type: "p",
        body: "This is the single operational guide we use to kick off a new product's design system. Follow it top to bottom, keep the page open while you set up, and don't add ceremony that isn't here. The goal is a clean Figma file, an AI-ready handoff page, and prompts you can paste without thinking.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Designer-focused: only the parts of the toolchain that support Figma, Antigravity, and AI-assisted handoff are required. Detailed Git, Node, and backend scaffolding live in a different guide.",
      },

      { type: "h2", body: "A. Designer tool setup", id: "tools" },

      { type: "h3", body: "1. Antigravity workspace" },
      {
        type: "p",
        body: "Antigravity is the AI-assisted design workflow we run prompts and workspace context through. Install it, sign in, and confirm the workspace loads before doing anything else.",
      },
      {
        type: "ul",
        items: [
          "Download from antigravity.com and install.",
          "Launch and sign in if prompted.",
          "Confirm the workspace opens cleanly.",
        ],
      },

      { type: "h3", body: "2. Figma" },
      {
        type: "p",
        body: "Figma holds the design files, components, prototypes, and the handoff page. Get an account, install the desktop app, and create one new project file you'll point everything else at.",
      },
      {
        type: "ul",
        items: [
          "Sign up at figma.com.",
          "Install the desktop app from figma.com/downloads.",
          "Create a new project file and confirm you can edit and share it.",
        ],
      },

      { type: "h3", body: "3. MCP / GitHub Copilot configuration" },
      {
        type: "p",
        body: "MCP and Copilot are what give the AI tools real workspace context. Install the GitHub Copilot extension inside Antigravity, sign in, and enable workspace indexing.",
      },
      {
        type: "ol",
        items: [
          "Open Antigravity and click the Extensions icon.",
          "Search for `GitHub Copilot` and install it.",
          "Sign in with your GitHub account when prompted.",
          "In the Copilot/MCP settings, enable workspace context, markdown support, and file indexing.",
          "If Antigravity supports it, open Settings → Copilot → MCP and confirm the repo folder is indexed.",
          "Restart Antigravity if anything looks off.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Verification: the Copilot pane is visible in the sidebar, your workspace files appear in its context, and opening this guide in the editor shows AI suggestions.",
      },

      { type: "h3", body: "4. What is not required here" },
      {
        type: "p",
        body: "These belong to the developer guide, not this one — adding them creates noise that slows the designer flow:",
      },
      {
        type: "ul",
        items: [
          "Detailed Git installation and identity setup.",
          "Node.js and package manager setup.",
          "Remote repo init and push commands.",
          "Full backend/frontend scaffolding.",
          "Anything code-environment-only.",
        ],
      },

      { type: "h2", body: "B. Figma setup & organization", id: "figma" },

      { type: "h3", body: "1. Create the file" },
      {
        type: "ol",
        items: [
          "Open figma.com.",
          "Create a new team or pick an existing one.",
          "Click `New File`.",
          "Name the file after your product.",
        ],
      },

      { type: "h3", body: "2. Page structure" },
      {
        type: "p",
        body: "Use this exact structure for every product. Numbered prefixes keep the sidebar ordered.",
      },
      {
        type: "code",
        lang: "text",
        source: `Figma Workspace
│
├── 01 Foundations
├── 02 Typography
├── 03 Colors
├── 04 Components
├── 05 Wireframes
├── 06 Screens
├── 07 Prototypes
├── 08 Assets
└── 09 Developer Handoff`,
      },

      { type: "h3", body: "3. What lives on each page" },
      {
        type: "ul",
        items: [
          "Foundations — brand, mission, product principles.",
          "Typography — font styles and heading scales.",
          "Colors — palette, states, alerts.",
          "Components — atoms, molecules, layouts.",
          "Wireframes — layout concepts and page structure.",
          "Screens — final screens and flows.",
          "Prototypes — interactive sequences.",
          "Assets — exported icons and images.",
          "Developer Handoff — design specs for engineering.",
        ],
      },

      { type: "h3", body: "4. Naming conventions" },
      {
        type: "ul",
        items: [
          "Frames: `Section / Page / Purpose`",
          "Components: `Component / State / Size`",
          "Variants: `Button / Primary / Default`",
          "Pages: `01 Foundations`, `02 Typography`, ...",
        ],
      },

      { type: "h3", body: "5. Component organisation" },
      {
        type: "p",
        body: "Group your components by purpose, and use explicit variant axes so the same component reads the same in Figma and code.",
      },
      {
        type: "ul",
        items: [
          "Groups: buttons · form fields · cards · navigation · modals · tables · notifications · avatars.",
          "Variants: `Button / Primary / Default`, `Button / Primary / Hover`, `Input / Default / Focus`, `Badge / Success / Filled`.",
        ],
      },

      { type: "h3", body: "6. Export rules" },
      {
        type: "ol",
        items: [
          "Use Dev Mode for handoff.",
          "Export icons as SVG.",
          "Export images as PNG or WEBP.",
          "Use lower-kebab-case asset names.",
          "Only use `@2x` for high-DPI raster assets.",
        ],
      },

      { type: "h3", body: "7. Developer handoff page" },
      {
        type: "ul",
        items: [
          "Design tokens",
          "Color palette",
          "Typography",
          "Spacing scale",
          "Component specs",
          "Grid and layout",
        ],
      },

      { type: "h2", body: "C. Figma + Antigravity workflow", id: "workflow" },

      { type: "h3", body: "1. Set up an AI-ready page" },
      {
        type: "ul",
        items: [
          "Create a Figma page called `AI-ready` (or reuse `Developer Handoff`).",
          "Place only the current screen or component you want to convert.",
          "Use clear frame names: `Dashboard / Overview`, `Inventory / Item Card`.",
          "Add text notes for tokens, spacing, typography, and component names.",
          "Limit each prompt target to one screen or one reusable component.",
        ],
      },

      { type: "h3", body: "2. Connect Figma to Antigravity" },
      {
        type: "ul",
        items: [
          "Use Figma MCP or the Antigravity integration to select the frame.",
          "Share the frame with the AI tool before asking the prompt.",
          "If a screenshot is easier, export only the target frame.",
          "Never send a full page with unrelated content.",
        ],
      },

      { type: "h3", body: "3. Practical prompt rules" },
      {
        type: "ul",
        items: [
          "Always name the stack — React, Tailwind, the component names.",
          "Always name the source — screenshot, Figma frame, or React component code.",
          "Always ask for exact values — colors, spacing, typography, interactive behaviours.",
          "Keep prompts short, direct, and outcome-focused.",
        ],
      },

      { type: "h3", body: "4. Review and refine" },
      {
        type: "ul",
        items: [
          "Inspect the AI output for token consistency and responsive layout.",
          "Update Figma annotations to match the final code decisions.",
          "Save the prompt output in `docs/` or on the Figma handoff page.",
          "Confirm the final component uses the design system naming from `@components/ui/Button` and other shared primitives.",
        ],
      },

      { type: "h2", body: "Prompts you'll actually use", id: "prompts" },
      {
        type: "p",
        body: "Paste these directly into Antigravity or Claude. They're written to assume the AI-ready page setup above.",
      },

      {
        type: "snippet",
        title: "Information architecture",
        body: "I am building a B2B SaaS warehouse management system. Generate a comprehensive sitemap including inventory tracking, employee shifts, logistics, and admin settings. Use a hierarchical structure.",
      },
      {
        type: "snippet",
        title: "AI-assisted design workflow",
        body: "Convert this screenshot into a responsive React component. Use Tailwind CSS. Extract the exact colors and spacing from the image. Ensure the buttons use our 'Primary' component from @components/ui/Button.",
      },
      {
        type: "snippet",
        title: "Developer handoff",
        body: "Review this Figma frame (via screenshot or MCP). Write a detailed technical specification for a developer. Include layout structure, spacing, typography, and interactive behaviors for each element.",
      },
      {
        type: "snippet",
        title: "Component documentation",
        body: "Review this React component code. Generate a README that includes: a description of the component, a list of all props with their types and defaults, and three examples of how to use it in different scenarios.",
      },
      {
        type: "snippet",
        title: "Design mistakes audit",
        body: "Review this screenshot/code of our new Dashboard. Look specifically for: 1. Poor visual hierarchy, 2. Accessibility failures (contrast/labels), 3. Inconsistent spacing, 4. Potential responsive issues. Provide a bulleted list of fixes.",
      },
    ],
    referenced: [
      {
        slug: "ai-assisted-fullstack-workflow",
        category: "guide",
        note: "The developer-side companion to this guide",
      },
    ],
  },

  "ai-assisted-fullstack-workflow": {
    slug: "ai-assisted-fullstack-workflow",
    tagline:
      "How to plan, prompt, and ship a full-stack app with AI coding tools without ending up with hallucinated code and brittle architecture. Stack, rules, PRD, vertical slices, and the exact prompts.",
    timeEstimate: "~25 min read",
    youWillNeed: [
      "Cursor, Claude Code, or another AI coding tool",
      "A stack you're willing to commit to for the whole project",
      "30 minutes of quiet to plan before you generate anything",
    ],
    youWillEndUpWith:
      "A foundation that survives AI assistance: a fixed stack, a `.cursor/rules` directory, a real PRD, and a vertical-slice plan you can hand to the agent one slice at a time.",
    toc: [
      { label: "Before you start", id: "before" },
      { label: "Recommended stacks", id: "stack" },
      { label: "Step 1 — Lock the foundation", id: "foundation" },
      { label: "Step 2 — Write AI rules", id: "rules" },
      { label: "Step 3 — Generate a PRD", id: "prd" },
      { label: "Step 4 — Vertical slice plan", id: "slices" },
    ],
    body: [
      {
        type: "p",
        body: "Most AI-assisted projects don't fail because the model is bad. They fail because the architecture is fuzzy, the rules aren't written down, prompts are too big, and nobody is documenting what shipped. This guide is the workflow we use to keep that from happening.",
      },

      { type: "h2", body: "Before you start", id: "before" },
      {
        type: "p",
        body: "AI coding tools work best when the architecture is clear, the rules are structured, the prompts are focused, and the development is iterative. They fail when you ask them to do everything at once.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Do not: generate the entire app in one prompt, randomly switch frameworks mid-build, let the AI invent project structure, skip documentation, or build giant features at once. All four of these turn AI from leverage into liability.",
      },
      {
        type: "ul",
        items: [
          "Build feature-by-feature.",
          "Use vertical slices (DB → API → UI in one go).",
          "Maintain strict project rules.",
          "Document continuously — even one line per slice.",
          "Keep prompts focused on a single outcome.",
        ],
      },

      { type: "h2", body: "Recommended stacks", id: "stack" },
      {
        type: "p",
        body: "Pick one stable stack and stay consistent. The exact choice matters less than the discipline of not switching mid-build.",
      },

      { type: "h3", body: "Frontend" },
      {
        type: "linklist",
        items: [
          { title: "Next.js", url: "https://nextjs.org", note: "App Router, RSC, the default for new SaaS work." },
          { title: "Tailwind CSS", url: "https://tailwindcss.com", note: "Utility-first styling AI tools handle well." },
          { title: "shadcn/ui", url: "https://ui.shadcn.com", note: "Copy-in components, easy to extend." },
          { title: "Tremor", url: "https://www.tremor.so", note: "Dashboards and charts on top of Tailwind." },
        ],
      },

      { type: "h3", body: "Backend" },
      {
        type: "linklist",
        items: [
          { title: "FastAPI", url: "https://fastapi.tiangolo.com", note: "Python, typed, great for AI-heavy APIs." },
          { title: "Convex", url: "https://convex.dev", note: "Reactive backend with realtime built in." },
          { title: "Laravel", url: "https://laravel.com", note: "If your team is already in PHP." },
        ],
      },

      { type: "h3", body: "Database" },
      {
        type: "linklist",
        items: [
          { title: "PostgreSQL", url: "https://www.postgresql.org", note: "Default for almost everything." },
          { title: "MongoDB", url: "https://www.mongodb.com", note: "When the data really is document-shaped." },
          { title: "Supabase", url: "https://supabase.com", note: "Postgres + auth + storage in one place." },
        ],
      },

      { type: "h3", body: "Auth" },
      {
        type: "linklist",
        items: [
          { title: "Clerk", url: "https://clerk.com", note: "Drop-in auth with great Next.js DX." },
          { title: "Auth.js", url: "https://authjs.dev", note: "Open-source, BYO providers." },
          { title: "Supabase Auth", url: "https://supabase.com/auth", note: "Bundled with Supabase Postgres." },
        ],
      },

      { type: "h3", body: "AI coding tools" },
      {
        type: "linklist",
        items: [
          { title: "Cursor", url: "https://cursor.com", note: "AI-first editor with codebase context." },
          { title: "Claude Code", url: "https://claude.com/claude-code", note: "Terminal-first agent for repo-wide work." },
          { title: "Antigravity", url: "https://antigravity.dev", note: "AI-assisted workspace + MCP integration." },
          { title: "Windsurf", url: "https://codeium.com/windsurf", note: "Agentic editor from Codeium." },
          { title: "Trae", url: "https://trae.ai", note: "Lightweight AI IDE." },
        ],
      },

      { type: "h3", body: "UI-first / prototyping tools" },
      {
        type: "linklist",
        items: [
          { title: "Lovable", url: "https://lovable.dev", note: "Generate full UIs from prompts." },
          { title: "v0", url: "https://v0.dev", note: "Vercel's generative React UI tool." },
          { title: "Bolt.new", url: "https://bolt.new", note: "Full-stack prototypes in the browser." },
          { title: "Figma Make", url: "https://www.figma.com/make", note: "Generative design inside Figma." },
        ],
      },

      { type: "h3", body: "Boilerplates" },
      {
        type: "linklist",
        items: [
          { title: "Taxonomy", url: "https://tx.shadcn.com", note: "Next.js + shadcn reference build." },
          { title: "ShipFast", url: "https://shipfa.st", note: "Paid Next.js SaaS starter." },
          { title: "Wasp", url: "https://wasp-lang.dev", note: "Declarative full-stack framework." },
        ],
      },

      { type: "h2", body: "Step 1 — Lock the foundation", id: "foundation" },
      {
        type: "p",
        body: "Before generating any code, write down the stack, the database, the auth provider, the UI library, and the folder structure. Pin them.",
      },
      {
        type: "code",
        lang: "text",
        source: `Frontend:  Next.js + Tailwind + shadcn/ui
Backend:   FastAPI
Database:  PostgreSQL
Auth:      Clerk`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Once these are set, do not mix random technologies later, change architecture midway, or let the AI decide the stack. Every switch costs you a refactor.",
      },

      { type: "h2", body: "Step 2 — Write AI rules", id: "rules" },
      {
        type: "p",
        body: "AI coding tools need explicit project rules or your code quality drifts, the folder structure goes feral, and APIs become inconsistent. Drop a `.cursor/rules/` folder at the repo root and seed it with files for naming, styling, APIs, project context, error handling, database, and auth.",
      },
      {
        type: "code",
        lang: "bash",
        source: `mkdir -p .cursor/rules
touch .cursor/rules/{naming,styling,api-conventions,project-context,error-patterns,database-rules,auth-rules}.mdc`,
      },
      {
        type: "h3",
        body: "Example rule files",
      },
      {
        type: "code",
        lang: "text",
        filename: ".cursor/rules/naming.mdc",
        source: `- Use PascalCase for components
- Use camelCase for variables
- Use kebab-case for folders
- Use descriptive filenames`,
      },
      {
        type: "code",
        lang: "text",
        filename: ".cursor/rules/api-conventions.mdc",
        source: `- Always use async/await
- Validate all inputs (Zod)
- Never trust frontend data
- Use consistent API response shapes`,
      },
      {
        type: "snippet",
        title: "Generate the rules system",
        body: "Analyze this codebase and generate a complete AI rules system. Include: naming conventions, folder structure, API conventions, database conventions, authentication handling, validation patterns, error handling, component architecture, styling conventions, and security guidelines. Optimize the project for AI-assisted development tools like Cursor, Claude Code, and Copilot. Keep the rules practical and implementation-focused.",
      },

      { type: "h2", body: "Step 3 — Generate a PRD", id: "prd" },
      {
        type: "p",
        body: "The PRD becomes the source of truth for developers, AI tools, architecture, and feature planning. A good PRD prevents the AI from inventing.",
      },
      {
        type: "ul",
        items: [
          "User roles",
          "Complete user flows",
          "Entities + permissions",
          "Validations + error states",
          "Edge cases",
          "UI behavior + API behavior",
          "Admin functionality",
          "Mobile behavior",
          "Integrations",
        ],
      },
      {
        type: "snippet",
        title: "Write the PRD",
        body: "Write a production-grade PRD for this application. Include: user roles, complete user flows, database entities, permissions, API behavior, validation rules, edge cases, error states, UI behavior, admin functionality, mobile responsiveness, and integrations. The PRD should be detailed enough for an AI coding agent to build the system without guessing. Keep the structure implementation-focused.",
      },

      { type: "h2", body: "Step 4 — Vertical slice plan", id: "slices" },
      {
        type: "p",
        body: "Never build the whole app at once. Each slice goes Database → Backend logic → API → Frontend UI → Validation → Testing. Start with auth, then core CRUD, then advanced workflows.",
      },
      {
        type: "code",
        lang: "text",
        source: `1. Authentication
2. User Profile CRUD
3. Dashboard
4. Payments
5. Notifications
6. Admin Panel`,
      },
      {
        type: "snippet",
        title: "Generate the slice plan",
        body: "Using the PRD, generate a vertical-slice implementation plan. Rules: build feature-by-feature, start with authentication, then core CRUD, then advanced workflows, keep slices small, keep dependencies logical. Each slice must include database, backend logic, API routes, frontend UI, validation, and testing.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Ship one slice end-to-end before starting the next. AI tools accelerate vertical slices; they sabotage horizontal builds where you stub everything and never come back.",
      },
    ],
    referenced: [
      {
        slug: "design-planning-workflow",
        category: "guide",
        note: "The design-side companion to this workflow",
      },
      {
        slug: "waitlist-kit",
        category: "kit",
        note: "A working vertical-slice example — DB, API, UI, all wired",
      },
    ],
  },

  "free-analytics-tools": {
    slug: "free-analytics-tools",
    tagline:
      "A field-tested list of free analytics platforms — product, web, session replay, and telemetry — with the exact 2026 free-tier volume that each one actually gives you.",
    timeEstimate: "~6 min read",
    youWillNeed: [
      "An idea of what you're tracking (events, page views, sessions, errors)",
      "An hour to wire up the first one and stop sweating analytics",
    ],
    youWillEndUpWith:
      "A short list of free tools that fit your use case, with the free-tier ceiling for each so you know when you'll need to pay (or self-host).",
    toc: [
      { label: "Product analytics & events", id: "product" },
      { label: "Privacy-first web analytics", id: "privacy" },
      { label: "Session replays & heatmaps", id: "replays" },
      { label: "Modern web-dev alternatives", id: "webdev" },
      { label: "App telemetry & observability", id: "telemetry" },
    ],
    body: [
      {
        type: "p",
        body: "Every \"free analytics\" list eventually becomes a list of trials. This one only includes tools with a genuine free tier (or AGPL self-host option) — and quotes the 2026 ceiling so you know exactly what you're getting.",
      },

      { type: "h2", body: "Product analytics & events", id: "product" },
      {
        type: "linklist",
        items: [
          {
            title: "PostHog",
            url: "https://posthog.com",
            meta: "1M events/mo",
            note: "+ 5K session recordings + 1M feature flag requests/mo. Heatmaps included.",
          },
          {
            title: "Mixpanel",
            url: "https://mixpanel.com",
            meta: "1M events/mo",
            note: "10K session replays/mo, core funnels/flows/retention, 5 saved reports per seat.",
          },
          {
            title: "Amplitude",
            url: "https://amplitude.com",
            meta: "10K MTUs · ~2M events/mo",
            note: "Includes session replay + unlimited feature flags.",
          },
          {
            title: "Heap",
            url: "https://www.heap.io",
            meta: "10K user sessions/mo",
            note: "Retroactive autocapture — no instrumentation to set events up front.",
          },
          {
            title: "OpenPanel",
            url: "https://openpanel.dev",
            meta: "Free unlimited self-hosted",
            note: "AGPL-3.0. Cloud is trial-only.",
          },
        ],
      },

      { type: "h2", body: "Privacy-first web analytics", id: "privacy" },
      {
        type: "linklist",
        items: [
          {
            title: "Plausible",
            url: "https://plausible.io",
            meta: "Free + unlimited (self-host)",
            note: "AGPL. Cloud is paid; self-hosted is free forever.",
          },
          {
            title: "Umami",
            url: "https://umami.is",
            meta: "100K events/mo · or self-host",
            note: "Free Cloud Hobby tier, or unlimited when you run it yourself.",
          },
          {
            title: "Pirsch",
            url: "https://pirsch.io",
            meta: "30-day trial only",
            note: "Included for completeness — no real free tier.",
          },
        ],
      },

      { type: "h2", body: "Session replays & heatmaps", id: "replays" },
      {
        type: "linklist",
        items: [
          {
            title: "Microsoft Clarity",
            url: "https://clarity.microsoft.com",
            meta: "100% free forever",
            note: "Zero traffic caps. Unlimited everything.",
          },
          {
            title: "Highlight.io",
            url: "https://www.highlight.io",
            meta: "500 replays + 1K errors/mo",
            note: "Open-source (Apache 2.0). Free forever tier.",
          },
        ],
      },

      { type: "h2", body: "Modern web-dev alternatives", id: "webdev" },
      {
        type: "linklist",
        items: [
          {
            title: "Vercel Analytics",
            url: "https://vercel.com/analytics",
            meta: "50K events/mo",
            note: "Hobby (free) plan. Pairs with Vercel deployments out of the box.",
          },
          {
            title: "Cloudflare Web Analytics",
            url: "https://www.cloudflare.com/web-analytics/",
            meta: "Free for unlimited sites",
            note: "Privacy-friendly, no cookies, DNS-proxied traffic.",
          },
          {
            title: "Matomo",
            url: "https://matomo.org",
            meta: "Free self-hosted",
            note: "PHP + MySQL. Mature Google-Analytics alternative.",
          },
          {
            title: "TelemetryDeck",
            url: "https://telemetrydeck.com",
            meta: "100K signals/mo",
            note: "For iOS, macOS, Android apps. Privacy-first.",
          },
        ],
      },

      { type: "h2", body: "App telemetry & observability", id: "telemetry" },
      {
        type: "linklist",
        items: [
          {
            title: "GlitchTip",
            url: "https://glitchtip.com",
            meta: "1K events/mo · or self-host",
            note: "Sentry-compatible API. Self-hosted is unlimited.",
          },
          {
            title: "Grafana Cloud",
            url: "https://grafana.com/products/cloud/",
            meta: "10K metric series · 50GB logs · 50GB traces",
            note: "Free forever. 14-day retention.",
          },
          {
            title: "New Relic",
            url: "https://newrelic.com",
            meta: "100GB ingest/mo",
            note: "1 full user + unlimited basic users. 8-day retention.",
          },
          {
            title: "Rollbar",
            url: "https://rollbar.com",
            meta: "5K errors + 1K replays/mo",
            note: "30-day retention. Unlimited users.",
          },
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Free-tier limits change. Always re-check the pricing page before you commit a stack — this list was current as of May 2026.",
      },
    ],
  },

  "50-places-to-list-your-startup": {
    slug: "50-places-to-list-your-startup",
    tagline:
      "A working list of 50 free launch platforms, communities, and directories — annotated with audience size and a one-line note on what each is good for.",
    timeEstimate: "~8 min read",
    youWillNeed: [
      "A landing page that loads",
      "A one-line pitch and a screenshot",
      "Patience — most distribution is slow and cumulative",
    ],
    youWillEndUpWith:
      "A prioritised list of places to post your launch, grouped by audience type, with the obvious tier-one platforms separated from the long tail.",
    toc: [
      { label: "Tier 1 — high-leverage launches", id: "tier1" },
      { label: "Reddit communities", id: "reddit" },
      { label: "Directories & discovery", id: "directories" },
      { label: "B2B review sites", id: "reviews" },
      { label: "Builder & maker communities", id: "builders" },
      { label: "Niche groups (FB / Discord)", id: "groups" },
    ],
    body: [
      {
        type: "p",
        body: "Launching is mostly distribution. The handful of platforms below have moved real traffic for our products and the products of founders we know. The list is sorted into tiers — start with tier one, don't try to do all fifty in one week.",
      },

      { type: "h2", body: "Tier 1 — high-leverage launches", id: "tier1" },
      {
        type: "linklist",
        items: [
          { title: "Product Hunt", url: "https://www.producthunt.com", meta: "~5.4M/mo", note: "Strongest single-day launch platform if your category fits." },
          { title: "Hacker News", url: "https://news.ycombinator.com", meta: "~15–20M/mo", note: "Show HN — high-signal YC/startup tech audience." },
          { title: "Indie Hackers", url: "https://www.indiehackers.com", meta: "~500–600K/mo", note: "Indie founder and maker community." },
          { title: "DEV Community", url: "https://dev.to", meta: "~10M+/mo", note: "Developer-focused publishing platform." },
          { title: "AppSumo", url: "https://appsumo.com", meta: "~2.1M/mo", note: "Useful for SaaS exposure and lifetime-deal launches." },
        ],
      },

      { type: "h2", body: "Reddit communities", id: "reddit" },
      {
        type: "linklist",
        items: [
          { title: "r/Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur", meta: "~5.1M members", note: "Large founder and business audience." },
          { title: "r/InternetIsBeautiful", url: "https://www.reddit.com/r/InternetIsBeautiful", meta: "~16.6M members", note: "Showcase useful/free tools." },
          { title: "r/startups", url: "https://www.reddit.com/r/startups", meta: "~1.8–2M members", note: "Startup-focused founder and builder community." },
          { title: "r/smallbusiness", url: "https://www.reddit.com/r/smallbusiness", meta: "~2M members", note: "Small business and founder audience." },
          { title: "r/webdev", url: "https://www.reddit.com/r/webdev", meta: "~3.1M members", note: "Frontend/dev-tool audience." },
          { title: "r/digitalnomad", url: "https://www.reddit.com/r/digitalnomad", meta: "~2.4M members", note: "Remote work and indie founder audience." },
          { title: "r/EntrepreneurRideAlong", url: "https://www.reddit.com/r/EntrepreneurRideAlong", meta: "~520K members", note: "Founder journey and growth discussions." },
          { title: "r/SaaS", url: "https://www.reddit.com/r/SaaS", meta: "~168K members", note: "SaaS founder and product-building audience." },
          { title: "r/SEO", url: "https://www.reddit.com/r/SEO", meta: "~328K members", note: "SEO and growth marketing community." },
          { title: "r/content_marketing", url: "https://www.reddit.com/r/content_marketing", meta: "~126K members", note: "Content marketing and growth audience." },
          { title: "r/advancedentrepreneur", url: "https://www.reddit.com/r/advancedentrepreneur", meta: "~51K members", note: "Experienced founder and operator discussions." },
          { title: "r/GrowthHacking", url: "https://www.reddit.com/r/GrowthHacking", meta: "~53K members", note: "Startup growth and experimentation audience." },
          { title: "r/nocode", url: "https://www.reddit.com/r/nocode", meta: "~42K members", note: "No-code builders and automation audience." },
          { title: "r/growmybusiness", url: "https://www.reddit.com/r/growmybusiness", meta: "~52K members", note: "Business growth and scaling discussions." },
        ],
      },

      { type: "h2", body: "Directories & discovery", id: "directories" },
      {
        type: "linklist",
        items: [
          { title: "Betalist", url: "https://betalist.com", meta: "~50–100K/mo", note: "Early-stage startup launch platform." },
          { title: "AlternativeTo", url: "https://alternativeto.net", meta: "~2.1M/mo", note: "Strong SEO-based alternative discovery." },
          { title: "FutureTools.io", url: "https://www.futuretools.io", meta: "~200K/mo", note: "AI tools discovery and showcase platform." },
          { title: "SourceForge", url: "https://sourceforge.net", meta: "~15M+/mo", note: "Strong open-source and developer visibility." },
          { title: "StackShare", url: "https://stackshare.io", meta: "~50K/mo", note: "Tech stack discovery and developer audience." },
          { title: "SideProjectors", url: "https://www.sideprojectors.com", meta: "~2–5K/mo", note: "Marketplace for side projects and indie products." },
          { title: "Dev Hunt", url: "https://devhunt.org", meta: "~1K/mo", note: "Developer-focused product launch platform." },
          { title: "Alternative.me", url: "https://alternative.me", meta: "~144K/mo", note: "Alternative product discovery platform." },
          { title: "Startup Ranking", url: "https://www.startupranking.com", meta: "~11.6K/mo", note: "Startup visibility and ranking platform." },
          { title: "Pitch Wall", url: "https://pitchwall.co", meta: "~7.2K/mo", note: "Startup showcase and visibility platform." },
          { title: "Killer Startups", url: "https://www.killerstartups.com", meta: "~3K/mo", note: "Startup showcase and product discovery." },
          { title: "F6S", url: "https://www.f6s.com", meta: "~1.7M/mo", note: "Startup ecosystem for founders, grants, and exposure." },
        ],
      },

      { type: "h2", body: "B2B review sites", id: "reviews" },
      {
        type: "linklist",
        items: [
          { title: "G2", url: "https://www.g2.com", meta: "~2.4–3.7M/mo", note: "Trusted B2B software review platform." },
          { title: "Capterra", url: "https://www.capterra.com", meta: "~2–3M/mo", note: "Popular software discovery and comparison." },
          { title: "Software Advice", url: "https://www.softwareadvice.com", meta: "~500–700K/mo", note: "Software recommendation and discovery." },
          { title: "TrustRadius", url: "https://www.trustradius.com", meta: "~500K/mo", note: "Trusted B2B software review platform." },
          { title: "Crozdesk", url: "https://crozdesk.com", meta: "~25K/mo", note: "B2B SaaS comparison and discovery platform." },
          { title: "Software Suggest", url: "https://www.softwaresuggest.com", meta: "~212K/mo", note: "Software discovery platform with India relevance." },
          { title: "Software World", url: "https://www.softwareworld.co", meta: "~6.7K/mo", note: "Software listing and comparison platform." },
          { title: "SaaSGenius", url: "https://www.saasgenius.com", meta: "~27.1K/mo", note: "SaaS software comparison and discovery." },
          { title: "AI Tools Directory", meta: "~15.9K/mo", note: "AI product discovery and listing platform — search the name to find the current canonical site." },
        ],
      },

      { type: "h2", body: "Builder & maker communities", id: "builders" },
      {
        type: "linklist",
        items: [
          { title: "Peerlist", url: "https://peerlist.io", meta: "~50K/mo", note: "Growing builder and developer professional network." },
          { title: "About.me", url: "https://about.me", meta: "~652K/mo", note: "Personal branding and founder profile platform." },
        ],
      },

      { type: "h2", body: "Niche groups (FB / Discord)", id: "groups" },
      {
        type: "p",
        body: "These are closed groups without stable public URLs — search the name inside Facebook or Discord. Included because they're worth the join even though there's no clean link to give you.",
      },
      {
        type: "linklist",
        items: [
          { title: "Startup Community (FB)", meta: "~75K members", note: "Founder networking and startup discussions." },
          { title: "Furlough (Discord)", meta: "~31K members", note: "Tech networking and founder community." },
          { title: "SaaS Growth Hacking (FB)", meta: "~31K members", note: "SaaS marketing and growth-focused community." },
          { title: "Build in Public (FB)", meta: "~55K members", note: "Builder transparency and growth community." },
          { title: "SaaS Warrior (FB)", meta: "~6.7K members", note: "Niche SaaS founder networking group." },
          { title: "Tech Startup (Discord)", meta: "~12K members", note: "Startup builders and networking community." },
          { title: "Alpha and Beta Users", meta: "~17K members", note: "Early adopter and product feedback audience." },
          { title: "Roast My Startup", meta: "~11K members", note: "Startup feedback and validation community." },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        body: "Don't post the same blurb on every platform. Each one has a tone — HN wants substance, Product Hunt wants visuals, Reddit wants context and humility. Rewrite the lede each time.",
      },
    ],
  },
};
