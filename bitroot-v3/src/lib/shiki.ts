import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-default"],
      langs: ["tsx", "ts", "jsx", "js", "bash", "json", "md", "mdx", "css", "html", "sql", "dotenv"],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await getHighlighter();
  try {
    return h.codeToHtml(code.trim(), {
      lang,
      theme: "github-dark-default",
    });
  } catch {
    return `<pre class="shiki"><code>${escape(code)}</code></pre>`;
  }
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
