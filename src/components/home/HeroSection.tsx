"use client";

import Image from "next/image";
import Link from "next/link";
import BoombapHeroScene from "./BoombapHeroScene";
import Waves from "./Waves";
import MotionReveal from "../ui/MotionReveal";

const MARQUEE_TEXT =
  "BOOMBAP VOL.02 \u00a0•\u00a0 MUMBAI \u00a0•\u00a0 CULTURE & SOUND \u00a0•\u00a0 RAW FREQUENCIES \u00a0•\u00a0 ";

export default function HeroSection() {
  return (
    <section className="vhs-frame relative w-full min-h-screen overflow-hidden bg-black">

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

        /* Film grain overlay via pseudo-element on parent */
        .boombap-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          opacity: 0.045;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* Vertical film-strip line decoration */
        .boombap-filmstrip {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: repeating-linear-gradient(
            180deg,
            rgba(255,255,255,0.06) 0px,
            rgba(255,255,255,0.06) 6px,
            transparent 6px,
            transparent 12px
          );
        }

        .boombap-hero-scene canvas {
          display: block;
          height: 100%;
          width: 100%;
          touch-action: none;
        }
      `}</style>

      {/* ── Background ────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 boombap-grain">
        <Image
          fill
          src="/peoples.png"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover object-center opacity-[0.12] grayscale"
        />
        {/* left fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/92 to-black/45" />
        {/* top & bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/55" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* decorative film-strip lines */}
        <div className="boombap-filmstrip" style={{ right: "calc(100% / 3 + 2px)" }} />
        <div className="boombap-filmstrip" style={{ right: "calc(100% / 3 - 1px)" }} />
      </div>

      {/* <BoombapHeroScene /> */}
      <div className="absolute inset-0 z-[2] bg-radial-[circle_at_72%_46%] from-transparent via-black/28 to-black/92 pointer-events-none" />
      <div className="absolute inset-0 z-[2] bg-linear-to-r from-black via-black/70 to-black/20 pointer-events-none" />
      <Waves
        lineColor="#4f7c1cff"
        backgroundColor="transparent"
        waveSpeedX={0.0125}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="pointer-events-none z-[3] opacity-70 mix-blend-screen"
      />

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl min-h-screen px-6 md:px-10 flex flex-col justify-center pt-32 pb-24">

        {/* LEFT — hero copy ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center">
          <MotionReveal
            as="span"
            className="mb-5 block font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary"
          >
            Vol. 02 / Mumbai
          </MotionReveal>

          <MotionReveal
            as="h1"
            delay={0.12}
            className="kinetic-title font-sarpanch text-[clamp(3.5rem,15vw,9.5rem)] font-black uppercase leading-[0.82] text-white"
          >
            BOOMBAP
          </MotionReveal>

          <MotionReveal
            delay={0.24}
            className="mt-8 grid gap-6 border-l border-primary/70 pl-5 md:pl-7"
          >
            <p className="max-w-md font-proxima text-xl leading-relaxed text-white/72 md:text-2xl">
              We have not created anything. We are showing what already exists
              here.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.36} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tickets"
              className="boombap-button"
            >
              Secure Tickets
            </Link>
            <a
              href="#"
              className="boombap-button boombap-button--ghost"
            >
              Watch Recap
            </a>
          </MotionReveal>
        </div>
      </div>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/8 overflow-hidden">
        <div className="boombap-marquee py-3">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-proxima text-[8px] uppercase tracking-[0.45em] text-white/20"
              >
                {MARQUEE_TEXT}
              </span>
            ))}
        </div>
      </div>

      {/* ── Rule ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-px w-full bg-white/10" />
    </section>
  );
}
