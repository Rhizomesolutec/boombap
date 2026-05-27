"use client";

import Image from "next/image";
import Link from "next/link";
import Waves from "./Waves";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

const MARQUEE_TEXT =
  "BOOMBAP VOL.02 \u00a0•\u00a0 COMING SOON \u00a0•\u00a0 CULTURE & SOUND \u00a0•\u00a0 RAW FREQUENCIES \u00a0•\u00a0 ";

export default function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-primary">

      {/* ── Scoped styles ─────────────────────────────────────────────────── */}
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

      <Waves
        lineColor="#7246C1"
        lineWidth={1.6}
        backgroundColor="#A0EF46"
        waveSpeedX={0.0125}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={10}
        yGap={30}
        className="pointer-events-none z-[3] opacity-85"
      />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-5 pt-24 pb-32 text-center sm:px-6 md:px-10 md:pt-32 md:pb-32"
      >

        {/* LEFT — hero copy ────────────────────────────────────────────── */}
        <div className="flex-1 flex w-full flex-col items-center justify-center">
          <MotionReveal
            as="span"
            className="mb-4 block font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-black/70 sm:text-[10px] sm:tracking-[0.42em]"
          >
            Vol. 02 / COMING SOON
          </MotionReveal>

          <MotionReveal
            delay={0.12}
            className="relative w-full max-w-[min(94vw,68rem)] overflow-hidden aspect-[4909/1327] sm:max-w-[min(88vw,68rem)]"
          >
            <Image
              fill
              src="/boombap trans.png"
              alt="BOOMBAP"
              priority
              sizes="(min-width: 640px) 88vw, 94vw"
              className="object-cover object-center"
            />
          </MotionReveal>

          <MotionReveal
            delay={0.24}
            className="mt-6 grid justify-items-center gap-5 border-t border-black/20 px-2 pt-5 sm:mt-8 sm:px-4 sm:pt-6"
          >
            <p className="max-w-xl font-proxima text-base leading-relaxed text-black/72 sm:text-xl md:text-2xl">
              We have not created anything. We are showing what already exists
              here.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.36} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              href="/tickets"
              className="boombap-button !bg-secondary"
            >
              <ScrambleText text="Secure Tickets" />
            </Link>
            <Link
              href="/vol1-recap"
              className="boombap-button boombap-button--ghost"
            >
              <ScrambleText text="Watch Recap" />
            </Link>
          </MotionReveal>
        </div>
      </div>

      <a
        href="#culture"
        aria-label="Scroll to culture"
        className="absolute inset-x-0 bottom-14 z-30 flex justify-center text-black/65 transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-4 focus:ring-offset-primary md:bottom-16"
      >
        <span className="boombap-scroll-cue__inner flex flex-col items-center gap-2 font-proxima text-[9px] font-bold uppercase tracking-[0.32em]">
          <span>Scroll</span>
          <span className="h-8 w-px bg-current" />
        </span>
      </a>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-black/15 bg-primary/80 overflow-hidden">
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

      {/* ── Rule ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-px w-full bg-black/15" />
    </section>
  );
}
