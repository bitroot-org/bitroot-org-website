/**
 * Only place .club is mentioned inside content pages.
 * Always appears AFTER the content is fully delivered. No button. No color block.
 * Single line, italic, subtle — a footnote, not a CTA.
 */
export default function ClubNudge({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-12 pt-6 border-t border-dashed border-line">
      <p className="text-sm text-ink-3 italic leading-relaxed">
        {children ?? (
          <>
            Got stuck, or want this shipped end-to-end for you?{" "}
            <a
              href="https://bitroot.club"
              className="prose-link not-italic"
              target="_blank"
              rel="noreferrer"
            >
              bitroot.club
            </a>{" "}
            builds custom products for founders. →
          </>
        )}
      </p>
    </div>
  );
}
