"use client";

import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";
import FlickCards from "./FlickCards";

const PHOTO_LABELS = [
  { label: "The Stage",    year: "2024" },
  { label: "Crowd Energy", year: "2024" },
  { label: "Movement",     year: "2024" },
  { label: "Lights",       year: "2024" },
  { label: "Pure Vibe",    year: "2024" },
  { label: "The Drop",     year: "2024" },
  { label: "Moments",      year: "2024" },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="relative w-full py-24 bg-black overflow-visible border-t border-white/5"
    >
      {/* Watermark */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-0 opacity-5 pointer-events-none">
        <span className="kinetic-title text-watermark whitespace-nowrap">
          ENERGY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <MotionReveal className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-proxima mb-4 block">
              The Gallery
            </span>
            <h2 className="text-white text-5xl md:text-6xl font-sarpanch font-black leading-tight">
              LATEST<br />ENERGY
            </h2>
          </div>
          <a
            href="/vol1-recap"
            className="text-white hover:text-primary transition-colors font-sarpanch text-xs uppercase tracking-widest border-b border-white/20 pb-2"
          >
            <ScrambleText text="View all work" /> →
          </a>
        </MotionReveal>

        <div className="hidden md:flex items-end gap-0">
          <div className="w-44 flex-shrink-0 flex flex-col justify-end pb-20 gap-6">
            <div className="flex flex-col leading-none">
              <span className="font-sarpanch font-black text-white/8 text-[80px] leading-none select-none">
                VOL
              </span>
              <span className="font-sarpanch font-black text-white/8 text-[80px] leading-none select-none -mt-4">
                1
              </span>
            </div>

            <div className="flex flex-col gap-3 border-l border-white/10 pl-4">
              <div>
                <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase font-proxima">Event</p>
                <p className="text-white/50 text-[11px] tracking-widest uppercase font-sarpanch mt-0.5">Boombap</p>
              </div>
              <div>
                <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase font-proxima">Season</p>
                <p className="text-white/50 text-[11px] tracking-widest uppercase font-sarpanch mt-0.5">2024</p>
              </div>
              <div>
                <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase font-proxima">Edition</p>
                <p className="text-white/50 text-[11px] tracking-widest uppercase font-sarpanch mt-0.5">Vol. 1</p>
              </div>
            </div>
          </div>

          {/* CENTER — Cards */}
          <div className="flex-1 min-w-0">
            <FlickCards />
          </div>

          <div className="w-44 flex-shrink-0 flex flex-col justify-end pb-20">
            <p className="text-white/20 text-[9px] tracking-[0.35em] uppercase font-proxima mb-4">
              Frames
            </p>
            <div className="flex flex-col gap-[10px]">
              {PHOTO_LABELS.map(({ label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 group cursor-default"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-primary transition-colors duration-300 flex-shrink-0"
                  />
                  <span className="text-white/30 hover:text-white/70 transition-colors duration-300 text-[11px] tracking-[0.2em] uppercase font-proxima">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile: compact cards only ── */}
        <div className="md:hidden">
          <FlickCards compact />
        </div>

        {/* Drag hint */}
        <MotionReveal
          className="flex items-center justify-center gap-3 mt-16"
          transition={{ delay: 0.4 }}
        >
          <span className="font-proxima text-white/30 text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Drag
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
              <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </MotionReveal>
      </div>
    </section>
  );
}
