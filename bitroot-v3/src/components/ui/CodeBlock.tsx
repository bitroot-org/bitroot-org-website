import { highlight } from "@/lib/shiki";
import CopyButton from "./CopyButton";

export default async function CodeBlock({
  code,
  lang = "bash",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const html = await highlight(code, lang);

  return (
    <div className="group rounded-xl border border-line overflow-hidden bg-[#0f0e0b] my-4">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#1a1815]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f3d39]" />
            </div>
            <span className="font-mono text-[11px] text-[#a8a299] ml-2">
              {filename}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#6e6a63] uppercase tracking-wider">
            {lang}
          </span>
        </div>
      )}
      <div className="relative">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <CopyButton text={code} />
      </div>
    </div>
  );
}
