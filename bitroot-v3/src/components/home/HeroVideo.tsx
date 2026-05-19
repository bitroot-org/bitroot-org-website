export default function HeroVideo() {
  return (
    <div
      aria-hidden
      className="hidden lg:block absolute right-0 top-0 bottom-0 w-[62%] xl:w-[58%] pointer-events-none select-none overflow-hidden"
    >
      <video
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        className="w-full h-full object-cover block"
      />
      {/* White-to-transparent fade overlay on the left edge (instead of mask-image,
          which composites the whole video layer and softens it on Retina) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--color-paper) 0%, var(--color-paper) 8%, transparent 55%)",
        }}
      />
    </div>
  );
}
