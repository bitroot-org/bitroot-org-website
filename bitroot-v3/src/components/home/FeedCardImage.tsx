"use client";

import { useState } from "react";

// Feed images come from auto-generated blog posts; if one ever 404s
// (deleted remote media, stale CDN link), fall back to the placeholder
// instead of showing a broken-image icon.
export default function FeedCardImage({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? "/placeholder-blog.png" : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={640}
      height={360}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full aspect-[16/9] object-cover bg-paper-2 border-b border-line"
    />
  );
}
