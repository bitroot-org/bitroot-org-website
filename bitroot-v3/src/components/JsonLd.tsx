/**
 * Renders structured data as an inline `<script type="application/ld+json">`.
 * `<` is escaped to keep the payload XSS-safe per the Next.js JSON-LD guide.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
