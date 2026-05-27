import Link from "next/link";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

const MARQUEE_TEXT =
  "BOOMBAP VOL.02 \u00a0•\u00a0 COMING SOON \u00a0•\u00a0 CULTURE & SOUND \u00a0•\u00a0 RAW FREQUENCIES \u00a0•\u00a0 ";

export default function MHeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black text-white flex flex-col justify-between pb-16">
      
      {/* ── Scoped styles ── */}
      <style>{`
        /* Marquee */
        .boombap-marquee {
          animation: boomMarquee 24s linear infinite;
          width: max-content;
          display: flex;
          gap: 0;
        }
        @keyframes boomMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .boombap-scroll-cue__inner {
          animation: boomScrollPulse 1.8s ease-in-out infinite;
        }

        @keyframes boomScrollPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
      `}</style>

      {/* Top spacing and Subtitle */}
      <div className="pt-20 sm:pt-24 px-6 text-center z-10 shrink-0">
        <MotionReveal
          as="span"
          className="block font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary sm:text-[11px] sm:tracking-[0.45em]"
        >
          Vol. 02 / COMING SOON
        </MotionReveal>
      </div>

      {/* ─── CINEMATIC WORDMARK ─── */}
      <div 
        className="relative w-full h-[48vh] sm:h-[58vh] md:h-[70vh] flex flex-col overflow-hidden select-none bg-black z-10 shrink-0" 
        aria-hidden="true"
      >
        {/* Shared video layer — fills the entire wordmark section */}
        <video
          src="/dj.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(1.1) contrast(1.1)" }}
        />

        {/* ── ROW 1: BOOM (50% height) ── */}
        <div
          className="relative h-[50%] w-full flex items-end justify-center overflow-hidden pb-1"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <span
            className="w-full font-sarpanch font-black uppercase text-primary text-center leading-[0.75] tracking-tighter"
            style={{ fontSize: "min(32vw, 46vh)", display: "block" }}
          >
            BOOM
          </span>
        </div>

        {/* ── ROW 2: BAP (50% height + overlap to eliminate subpixel gap) ── */}
        <div
          className="relative h-[calc(50%+2px)] w-full flex items-start justify-center overflow-hidden pt-1 -mt-[1px]"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <span
            className="font-sarpanch font-black uppercase text-secondary text-center leading-[0.75] tracking-tighter"
            style={{ fontSize: "min(32vw, 46vh)", display: "block", width: "100%" }}
          >
            BAP
          </span>
        </div>
      </div>

      {/* ─── BOTTOM CONTENT (Info & Buttons) ─── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 flex flex-col items-center text-center pb-16 sm:pb-20 md:pb-24 shrink-0">
        
        {/* Description Text */}
        <MotionReveal
          delay={0.12}
          className="w-full pt-5 sm:pt-6"
        >
          <p className="max-w-xl mx-auto font-proxima text-base leading-relaxed text-primary sm:text-lg md:text-xl">
            We have not created anything. We are showing what already exists here.
          </p>
        </MotionReveal>
      </div>

      {/* Scroll Cue */}
      {/* <a
        href="#culture"
        aria-label="Scroll to culture"
        className="absolute inset-x-0 bottom-16 z-30 flex justify-center text-white/50 transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-4 focus:ring-offset-black md:bottom-20"
      >
        <span className="boombap-scroll-cue__inner flex flex-col items-center gap-2 font-proxima text-[9px] font-bold uppercase tracking-[0.32em]">
          <span>Scroll</span>
          <span className="h-8 w-px bg-current" />
        </span>
      </a> */}

      {/* ── Marquee ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-primary/90 overflow-hidden">
        <div className="boombap-marquee py-3">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-proxima text-[8px] uppercase tracking-[0.45em] text-black"
              >
                {MARQUEE_TEXT}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
