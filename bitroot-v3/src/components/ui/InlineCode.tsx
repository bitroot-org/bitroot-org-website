export default function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.88em] bg-paper-2 border border-line px-[0.35em] py-[0.08em] rounded-[4px] text-ink-2">
      {children}
    </code>
  );
}
