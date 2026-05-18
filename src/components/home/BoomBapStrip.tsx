

export default function MarqueeStrip() {
    return (
        <>
                  {/* ─── MARQUEE STRIP ─── */}
      <section className="overflow-hidden bg-black/70 backdrop-blur-sm py-5" aria-hidden="true">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 pr-16 text-white text-[10px] tracking-[0.5em] uppercase font-proxima"
            >
              BOOMBAP
              <span className="text-secondary">✦</span>
              THE CULTURE LIVES HERE
              <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </section>
        </>
    )
}