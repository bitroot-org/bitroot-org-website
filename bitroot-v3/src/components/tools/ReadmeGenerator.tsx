"use client";

import { useMemo, useState } from "react";

type Fields = {
  name: string;
  tagline: string;
  description: string;
  install: string;
  usage: string;
  features: string;
  techStack: string;
  license: string;
  author: string;
  repo: string;
  includeBadges: boolean;
  includeTOC: boolean;
  includeContributing: boolean;
};

const initial: Fields = {
  name: "my-project",
  tagline: "A one-line elevator pitch for the project.",
  description:
    "A longer paragraph that explains what this project does, who it's for, and why you'd reach for it instead of the alternatives.",
  install: `npm install my-project
# or
pnpm add my-project`,
  usage: `import { thing } from "my-project";

const result = thing({ foo: "bar" });
console.log(result);`,
  features: `Fast and lightweight
Zero dependencies
TypeScript first
Tree-shakeable`,
  techStack: "TypeScript, Node 20+",
  license: "MIT",
  author: "Your Name",
  repo: "yourname/my-project",
  includeBadges: true,
  includeTOC: true,
  includeContributing: true,
};

function compose(f: Fields): string {
  const out: string[] = [];

  out.push(`# ${f.name}`);
  if (f.tagline) out.push("", `> ${f.tagline}`);

  if (f.includeBadges && f.repo) {
    out.push(
      "",
      `![License](https://img.shields.io/github/license/${f.repo})`,
      `![Stars](https://img.shields.io/github/stars/${f.repo})`,
      `![Last commit](https://img.shields.io/github/last-commit/${f.repo})`,
    );
  }

  if (f.description) out.push("", f.description);

  if (f.includeTOC) {
    const toc: string[] = ["", "## Table of contents", ""];
    if (f.features) toc.push("- [Features](#features)");
    if (f.install) toc.push("- [Installation](#installation)");
    if (f.usage) toc.push("- [Usage](#usage)");
    if (f.techStack) toc.push("- [Tech stack](#tech-stack)");
    if (f.includeContributing) toc.push("- [Contributing](#contributing)");
    if (f.license) toc.push("- [License](#license)");
    out.push(...toc);
  }

  if (f.features) {
    out.push(
      "",
      "## Features",
      "",
      ...f.features
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `- ${l}`),
    );
  }

  if (f.install) {
    out.push("", "## Installation", "", "```bash", f.install.trim(), "```");
  }

  if (f.usage) {
    out.push("", "## Usage", "", "```ts", f.usage.trim(), "```");
  }

  if (f.techStack) {
    out.push("", "## Tech stack", "", f.techStack);
  }

  if (f.includeContributing) {
    out.push(
      "",
      "## Contributing",
      "",
      `PRs welcome. Please open an issue first for anything bigger than a typo fix. Run \`npm test\` before submitting.`,
    );
  }

  if (f.license) {
    out.push("", "## License", "", `${f.license}${f.author ? ` © ${f.author}` : ""}`);
  }

  return out.join("\n") + "\n";
}

export default function ReadmeGenerator() {
  const [fields, setFields] = useState<Fields>(initial);
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => compose(fields), [fields]);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setFields(initial);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      {/* Form */}
      <div className="space-y-5">
        <Field label="Project name" required>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Tagline">
          <input
            type="text"
            value={fields.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            value={fields.description}
            onChange={(e) => update("description", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Features (one per line)">
          <textarea
            rows={4}
            value={fields.features}
            onChange={(e) => update("features", e.target.value)}
            className="input font-mono text-[12.5px]"
          />
        </Field>

        <Field label="Install command(s)">
          <textarea
            rows={3}
            value={fields.install}
            onChange={(e) => update("install", e.target.value)}
            className="input font-mono text-[12.5px]"
          />
        </Field>

        <Field label="Usage snippet">
          <textarea
            rows={4}
            value={fields.usage}
            onChange={(e) => update("usage", e.target.value)}
            className="input font-mono text-[12.5px]"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tech stack">
            <input
              type="text"
              value={fields.techStack}
              onChange={(e) => update("techStack", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="License">
            <input
              type="text"
              value={fields.license}
              onChange={(e) => update("license", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Author">
            <input
              type="text"
              value={fields.author}
              onChange={(e) => update("author", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="GitHub repo (user/repo)">
            <input
              type="text"
              value={fields.repo}
              onChange={(e) => update("repo", e.target.value)}
              className="input font-mono text-[12.5px]"
              placeholder="you/my-project"
            />
          </Field>
        </div>

        <div className="pt-2 space-y-2">
          <Toggle
            label="Shields.io badges (license, stars, last commit)"
            checked={fields.includeBadges}
            onChange={(v) => update("includeBadges", v)}
          />
          <Toggle
            label="Table of contents"
            checked={fields.includeTOC}
            onChange={(v) => update("includeTOC", v)}
          />
          <Toggle
            label="Contributing section"
            checked={fields.includeContributing}
            onChange={(v) => update("includeContributing", v)}
          />
        </div>

        <div className="pt-3 border-t border-line flex items-center gap-2">
          <button
            onClick={reset}
            className="text-[12px] font-mono text-ink-4 hover:text-ember transition-colors"
          >
            ↻ reset
          </button>
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="rounded-xl border border-line bg-[#0f0e0b] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1815]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
              </div>
              <span className="font-mono text-[11px] text-[#a8a299] ml-2">
                README.md
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copy}
                className="font-mono text-[11px] text-[#a8a299] hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors"
              >
                {copied ? "copied ✓" : "copy"}
              </button>
              <button
                onClick={download}
                className="font-mono text-[11px] text-[#a8a299] hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors"
              >
                download
              </button>
            </div>
          </div>
          <pre className="text-[12.5px] leading-[1.7] text-[#e9e4d6] p-5 overflow-x-auto font-mono max-h-[720px] overflow-y-auto">
            {markdown}
          </pre>
        </div>

        <p className="mt-3 text-[11.5px] font-mono text-ink-4 text-right">
          ∴ {markdown.length} chars · everything stays in your browser
        </p>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-paper);
          border: 1px solid var(--color-line);
          border-radius: 8px;
          padding: 0.625rem 0.875rem;
          font-size: 13px;
          color: var(--color-ink);
          transition: border-color 180ms ease;
        }
        .input:focus { outline: none; border-color: var(--color-ink-3); }
        .input::placeholder { color: var(--color-ink-4); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-4 mb-1.5">
        {label}
        {required && <span className="text-ember ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-9 h-5 rounded-full relative transition-colors ${
          checked ? "bg-ember" : "bg-line-2"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[12.5px] text-ink-2 group-hover:text-ink transition-colors">
        {label}
      </span>
    </label>
  );
}
