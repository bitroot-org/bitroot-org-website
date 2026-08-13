/**
 * One-time migration: convert the code-authored guide/kit write-ups
 * (guides-content.ts / kits-content.ts) into Markdown and load them into
 * TeamLife's `site_catalog.body`, so every guide/kit becomes editable in the
 * dashboard and the site renders the Markdown (callouts kept via :::directives,
 * code blocks keep filenames).
 *
 * Always writes scripts/content-migration.json for inspection. If
 * TEAMLIFE_DATABASE_URL is set, it also UPDATEs site_catalog.body by
 * (category, slug) — run that against the same DB team.bitroot.club uses:
 *
 *   TEAMLIFE_DATABASE_URL="postgres://…" npm run migrate:bodies
 *
 * Only touches the `body` column of existing rows; re-runnable.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";
import {
  guidesContent,
  type GuideNode,
  type GuideContent,
} from "../src/content/guides-content";
import { kitsContent, type KitContent } from "../src/content/kits-content";

function nodesToMd(nodes: GuideNode[]): string {
  const out: string[] = [];
  for (const n of nodes) {
    switch (n.type) {
      case "h2":
        out.push(`## ${n.body}`);
        break;
      case "h3":
        out.push(`### ${n.body}`);
        break;
      case "p":
        out.push(n.body);
        break;
      case "ul":
        out.push(n.items.map((i) => `- ${i}`).join("\n"));
        break;
      case "ol":
        out.push(n.items.map((i, k) => `${k + 1}. ${i}`).join("\n"));
        break;
      case "callout":
        out.push(`:::${n.tone}\n${n.body}\n:::`);
        break;
      case "code": {
        const info = n.filename ? `${n.lang} title=${n.filename}` : n.lang;
        out.push("```" + info + "\n" + n.source + "\n```");
        break;
      }
      case "snippet": {
        const title = n.title ? `**${n.title}**\n\n` : "";
        out.push(`${title}> ${n.body.split("\n").join("\n> ")}`);
        break;
      }
      case "linklist":
        out.push(
          n.items
            .map((it) => {
              const label = it.url ? `[${it.title}](${it.url})` : `**${it.title}**`;
              const meta = [it.meta, it.note].filter(Boolean).join(" · ");
              return `- ${label}${meta ? ` — ${meta}` : ""}`;
            })
            .join("\n"),
        );
        break;
      case "divider":
        out.push("---");
        break;
    }
  }
  return out.join("\n\n");
}

function guideToMd(g: GuideContent): string {
  const parts: string[] = [];
  if (g.youWillNeed?.length) {
    parts.push(`:::note\n**You'll need**\n\n${g.youWillNeed.map((i) => `- ${i}`).join("\n")}\n:::`);
  }
  if (g.youWillEndUpWith) {
    parts.push(`:::tip\n**You'll end up with:** ${g.youWillEndUpWith}\n:::`);
  }
  parts.push(nodesToMd(g.body));
  return parts.join("\n\n").trim();
}

function kitToMd(k: KitContent): string {
  const p: string[] = [];
  if (k.oneLiner) p.push(k.oneLiner);
  if (k.stack?.length)
    p.push(`## Stack\n\n${k.stack.map((s) => `- **${s.name}** — ${s.why}`).join("\n")}`);
  if (k.features?.length)
    p.push(`## Features\n\n${k.features.map((f) => `- **${f.title}** — ${f.description}`).join("\n")}`);
  if (k.installCommand) p.push("## Install\n\n```bash\n" + k.installCommand + "\n```");
  if (k.envExample) p.push("## Environment\n\n```dotenv title=.env.example\n" + k.envExample + "\n```");
  if (k.walkthrough?.length) {
    const steps = k.walkthrough
      .map((s) => {
        let block = `### ${s.title}\n\n${s.body}`;
        if (s.code) {
          const info = s.code.filename ? `${s.code.lang} title=${s.code.filename}` : s.code.lang;
          block += "\n\n```" + info + "\n" + s.code.source + "\n```";
        }
        return block;
      })
      .join("\n\n");
    p.push(`## Walkthrough\n\n${steps}`);
  }
  if (k.gotchas?.length) p.push(`## Gotchas\n\n${k.gotchas.map((g) => `- ${g}`).join("\n")}`);
  if (k.whyNot) p.push(`## Why not just build it yourself?\n\n${k.whyNot}`);
  const links: string[] = [];
  if (k.github) links.push(`[GitHub](${k.github})`);
  if (k.demo) links.push(`[Live demo](${k.demo})`);
  if (links.length || k.license) {
    p.push(`## Links\n\n${links.join(" · ")}${k.license ? `\n\nLicense: ${k.license}` : ""}`);
  }
  return p.join("\n\n").trim();
}

async function main() {
  const bodies: Record<string, string> = {};
  for (const [slug, g] of Object.entries(guidesContent)) bodies[`guide:${slug}`] = guideToMd(g);
  for (const [slug, k] of Object.entries(kitsContent)) bodies[`kit:${slug}`] = kitToMd(k);

  const outPath = join(dirname(fileURLToPath(import.meta.url)), "content-migration.json");
  writeFileSync(outPath, JSON.stringify(bodies, null, 2) + "\n");
  console.log(`converted ${Object.keys(bodies).length} bodies -> ${outPath}`);

  const url = process.env.TEAMLIFE_DATABASE_URL;
  if (!url) {
    console.log("TEAMLIFE_DATABASE_URL not set — wrote JSON only, no DB update.");
    return;
  }
  const sql = neon(url);
  let updated = 0;
  const missing: string[] = [];
  for (const [key, md] of Object.entries(bodies)) {
    const [category, slug] = key.split(":");
    const res = await sql`
      update site_catalog set body = ${md}, updated_at = now()
      where category = ${category} and slug = ${slug}
      returning id`;
    if (res.length) updated++;
    else missing.push(key);
  }
  console.log(`applied ${updated} body updates to site_catalog.`);
  if (missing.length) console.log(`no matching row for: ${missing.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
