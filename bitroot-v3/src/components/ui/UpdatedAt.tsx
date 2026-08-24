export default function UpdatedAt({ date }: { date: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-4">
      <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
      Updated {date}
    </span>
  );
}
