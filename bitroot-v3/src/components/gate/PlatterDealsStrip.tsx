import { platterDeals, platterUrl } from "./platterDeals";

export default function PlatterDealsStrip({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {platterDeals.map((d) => (
        <a
          key={d.title}
          href={platterUrl}
          target="_blank"
          rel="noreferrer"
          className={`group flex-none rounded-xl border border-line bg-paper hover:border-line-2 transition-colors ${
            compact ? "w-[132px] p-2.5" : "w-[150px] p-3"
          }`}
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="font-mono font-semibold text-[13px] text-ink tracking-[-0.01em]">
              {d.brand}
              <span className="text-ember">{d.brandAccent}</span>
            </span>
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-4 group-hover:text-ember transition-colors">
            {d.badge}
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-ember">
            {d.save}
          </div>
        </a>
      ))}
    </div>
  );
}
