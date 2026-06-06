"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import ScrambleText from "../../components/ui/ScrambleText";
import TrueFocus from "./TrueFocus";

/* ─────────────────────────────────────────────────────────────── */
/*  DATA                                                           */
/* ─────────────────────────────────────────────────────────────── */

const HERO_VIDEO =
  "https://player.vimeo.com/video/1198957759?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";

const reelClips = [
  {
    title: "Padachor",
    label: "BB Signal 01",
    src: "https://player.vimeo.com/video/1193929856?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
    stat: "01",
    tc: "00:00:00",
    desc: "Bass-forward set that opened the night",
  },
  {
    title: "Joker Malabari",
    label: "BB Signal 02",
    src: "https://player.vimeo.com/video/1193930603?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
    stat: "02",
    tc: "00:47:22",
    desc: "Crowd energy peaking mid-night",
  },
  {
    title: "Chaak",
    label: "BB Signal 03",
    src: "https://player.vimeo.com/video/1193931027?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
    stat: "03",
    tc: "02:11:08",
    desc: "The room at its absolute loudest",
  },
];

const STATS = [
  { num: "4", unit: "HRS", label: "Live" },
  { num: "01", unit: "NIGHT", label: "Archive" },
  { num: "∞", unit: "BPM", label: "Felt" },
];

const TICKER_ITEMS = [
  "VOL.01 ARCHIVE",
  "4 HOURS LIVE",
  "PHONE FIRST",
  "01 NIGHT",
  "COMMUNITY HELD",
  "NEXT LEVEL BASS",
  "BOOMBAP SIGNAL",
];


/* ─────────────────────────────────────────────────────────────── */
/*  REEL CARD                                                       */
/* ─────────────────────────────────────────────────────────────── */

function ReelCard({
  clip,
  index,
}: {
  clip: (typeof reelClips)[number];
  index: number;
}) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" }}
      animate={inView ? { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" } : {}}
      transition={{ duration: 1.1, delay: index * 0.15, ease: [0.76, 0, 0.24, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-none"
      data-cursor
    >
      {/* number — large ghost behind card */}
      <span
        className="absolute -top-8 -left-3 font-sarpanch font-black text-white pointer-events-none select-none z-0 transition-opacity duration-500"
        style={{
          fontSize: "clamp(4rem, 10vw, 8rem)",
          opacity: hovered ? 0.06 : 0.03,
          lineHeight: 1,
        }}
      >
        {clip.stat}
      </span>

      {/* portrait video */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black/50 z-10"
        style={{ border: hovered ? "1px solid rgba(160,239,70,0.3)" : "1px solid rgba(255,255,255,0.08)", transition: "border-color 0.4s" }}
      >
        <iframe
          src={`${clip.src}&background=1&autoplay=1&loop=1&muted=1`}
          className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700"
          style={{
            filter: hovered ? "grayscale(0) brightness(1.05)" : "grayscale(0.6) brightness(0.85)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          allow="autoplay"
        />

        {/* grade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/40 pointer-events-none" />

        {/* tc top right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="font-proxima text-[7px] uppercase tracking-[0.3em] text-white/30">{clip.tc}</span>
        </div>

        {/* lime number badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="font-sarpanch text-xs font-black text-[#a0ef46]">{clip.stat}</span>
        </div>

        {/* bottom info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 z-10 transition-transform duration-500"
          style={{ transform: hovered ? "translateY(0)" : "translateY(6px)" }}
        >
          <span className="font-proxima text-[7px] uppercase tracking-[0.35em] text-[#a0ef46]">{clip.label}</span>
          <h3 className="mt-1.5 font-sarpanch text-xl font-black uppercase leading-none text-white">{clip.title}</h3>
          <p
            className="font-proxima text-xs text-white/40 mt-2 transition-all duration-400"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
          >
            {clip.desc}
          </p>
        </div>

        {/* hover: lime sweep bottom bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#a0ef46] z-20 transition-all duration-700"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  STAT COUNTER                                                    */
/* ─────────────────────────────────────────────────────────────── */

function StatBlock({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 relative">
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : {}}
          transition={{ duration: 0.9, delay: index * 0.12, ease: [0.76, 0, 0.24, 1] }}
          className="flex items-baseline gap-2"
        >
          <span className="font-sarpanch font-black text-white" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            {stat.num}
          </span>
          <span className="font-sarpanch font-black text-[#a0ef46]" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)" }}>
            {stat.unit}
          </span>
        </motion.div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
        className="font-proxima text-[9px] uppercase tracking-[0.4em] text-white/30"
      >
        {stat.label}
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  PAGE                                                           */
/* ─────────────────────────────────────────────────────────────── */

const HERO_VIDEOS = [
  HERO_VIDEO,
  "https://player.vimeo.com/video/1198957819?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0",
];

export default function Vol1RecapExperience() {
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });
  const progressWidth = useTransform(smoothScroll, [0, 1], ["0%", "100%"]);

  /* hero scroll */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroVideoY = useTransform(hp, [0, 1], ["0%", "30%"]);
  const heroBrightness = useTransform(hp, [0, 1], [0.55, 0.25]);
  const heroContentY = useTransform(hp, [0, 1], ["0%", "20%"]);

  /* hero video switcher */
  const [activeVideo, setActiveVideo] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveVideo((v) => (v + 1) % HERO_VIDEOS.length);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  /* statement ref */
  const statRef = useRef(null);
  const statInView = useInView(statRef, { once: true, margin: "-100px" });

  /* stats section */
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  /* reels heading */
  const reelsHeadRef = useRef(null);
  const reelsHeadInView = useInView(reelsHeadRef, { once: true, margin: "-80px" });

  return (
    <>

      <main className="relative overflow-hidden bg-black text-white cursor-none selection:bg-[#a0ef46] selection:text-black">

        {/* ── GLOBAL STYLES ─────────────────────────────────────────────── */}
        <style>{`
          @keyframes tickerScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .ticker-inner     { animation: tickerScroll 22s linear infinite; }
          .ticker-inner-rev { animation: tickerScroll 30s linear infinite reverse; }
          .ticker-inner:hover, .ticker-inner-rev:hover { animation-play-state: paused; }

          @keyframes scrollY {
            0%   { transform: translateY(0);   opacity: 1; }
            50%  { transform: translateY(12px); opacity: 0.3; }
            100% { transform: translateY(0);   opacity: 1; }
          }

          /* Grain overlay */
          .grain::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 500;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
            background-size: 200px 200px;
            opacity: 0.032;
          }

          /* Staircase */
          @media (min-width: 768px) {
            .stair-0 { margin-top: 0; }
            .stair-1 { margin-top: 15%; }
            .stair-2 { margin-top: 30%; }
          }

          /* Corner brackets */
          .bracket::before, .bracket::after {
            content: '';
            position: absolute;
            width: 16px; height: 16px;
            border-color: rgba(160,239,70,0.5);
            border-style: solid;
          }
          .bracket::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
          .bracket::after  { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

          /* Line sweep hover */
          .line-hover {
            background: linear-gradient(90deg, #a0ef46, #a0ef46) no-repeat bottom left;
            background-size: 0% 1.5px;
            transition: background-size 0.5s cubic-bezier(0.16,1,0.3,1);
            padding-bottom: 2px;
          }
          .line-hover:hover { background-size: 100% 1.5px; }

          /* Vertical text */
          .v-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
          }

          /* Scanlines on video */
          .scanlines {
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.03) 2px,
              rgba(0,0,0,0.03) 4px
            );
          }

          /* Horizontal scrollable reel */
          .reel-h-scroll {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .reel-h-scroll::-webkit-scrollbar { display: none; }

          /* Marquee line */
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee { animation: marquee 18s linear infinite; }
          .marquee-rev { animation: marquee 24s linear infinite reverse; }

          /* CTA split panels */
          @media (min-width: 768px) {
            .cta-split-left {
              position: absolute;
              top: 0; left: 0; bottom: 0;
              width: 58%;
              display: flex;
              align-items: center;
              z-index: 10;
            }
            .cta-split-right {
              position: absolute;
              top: 0; right: 0; bottom: 0;
              width: 42%;
              display: flex;
              align-items: center;
              z-index: 5;
            }
          }

          /* Underline sweep */
          .underline-sweep {
            background: linear-gradient(90deg, currentColor, currentColor) no-repeat bottom left;
            background-size: 0% 1px;
            transition: background-size 0.4s cubic-bezier(0.16,1,0.3,1);
            padding-bottom: 1px;
          }
          .underline-sweep:hover { background-size: 100% 1px; }

          /* Blink dot */
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .blink { animation: blink 1.1s step-end infinite; }

          /* Number counter font */
          .tabular { font-variant-numeric: tabular-nums; }

          /* Neon flicker rare */
          @keyframes neon-flicker {
            0%,18%,20%,50%,52%,100% { opacity: 1; }
            19%,51% { opacity: 0.6; }
          }
        `}</style>

        <div className="grain" aria-hidden />

        {/* ── PROGRESS BAR ────────────────────────────────────────────── */}
        <motion.div
          className="fixed top-0 left-0 h-[2px] bg-[#a0ef46] z-[600] origin-left"
          style={{ width: progressWidth }}
        />

        {/* ── SIDE RULER ─────────────────────────────────────────────── */}
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 h-28 w-px bg-white/8 hidden md:block">
          <motion.div className="w-full bg-[#a0ef46] origin-top" style={{ scaleY: smoothScroll, height: "100%" }} />
        </div>

        {/* ══════════════════════════════════════════════════════════════
             HERO — FULL BLEED CINEMATIC
           ══════════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden bg-black flex items-end">

          {/* Full-bleed crossfading video */}
          <motion.div
            className="absolute inset-0 z-0"
            style={reduceMotion ? undefined : { y: heroVideoY }}
          >
            {HERO_VIDEOS.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
                style={{ opacity: activeVideo === i ? 1 : 0 }}
              >
                <iframe
                  src={src}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: "177.78vh", minWidth: "100%", height: "100%", minHeight: "56.25vw" }}
                  allow="autoplay"
                />
              </div>
            ))}
            {/* Scanlines layer */}
            <div className="scanlines absolute inset-0 z-10 pointer-events-none opacity-40" />
          </motion.div>

          {/* Cinematic grade — multi-layer */}
          <motion.div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background: `
                linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.3) 100%),
                linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 45%)
              `,
            }}
          />

          {/* Left sidebar label */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4">
            <span className="v-text font-proxima text-[8px] uppercase tracking-[0.5em] text-white/20">
              BOOMBAP · 2024 · VOL.01
            </span>
          </div>

          {/* Main bottom content */}
          <motion.div
            className="relative z-10 w-full px-8 md:px-14 pb-16 md:pb-20"
            style={reduceMotion ? undefined : { y: heroContentY }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4 mb-5"
            >
              <span className="h-px w-8 bg-[#a0ef46]" />
              <span className="font-proxima text-[9px] uppercase tracking-[0.5em] text-[#a0ef46]">
                Vol.01 Archive
              </span>
            </motion.div>

            {/* VOL 01 — TrueFocus animated headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <TrueFocus
                sentence="VOL 01"
                manualMode={false}
                blurAmount={4}
                borderColor="#a0ef46"
                glowColor="rgba(160,239,70,0.5)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.2}
                className="!justify-start gap-4 md:gap-8"
                wordClassNames={[
                  "font-sarpanch font-black uppercase text-white leading-[0.82]",
                  "font-sarpanch font-black uppercase text-white leading-[0.82]",
                ]}
                activeWordClassName="font-sarpanch font-black uppercase text-secondary leading-[0.82]"
                style={{ fontSize: "clamp(5.5rem, 16vw, 15rem)" }}
              />
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="h-px w-full bg-white/10 mb-8"
            />

            {/* Desc + CTAs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.85 }}
                className="font-proxima text-base md:text-lg text-white/45 leading-relaxed max-w-sm"
              >
                Reel-sized fragments from the first BOOMBAP night — staged so every scroll feels like stepping deeper into the room.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
                className="flex gap-4 shrink-0"
              >
                <a href="#vol1-reels" className="boombap-button">
                  <ScrambleText text="Enter Recap" />
                </a>
                <Link href="/tickets" className="boombap-button boombap-button--ghost">
                  <ScrambleText text="Vol.02 Tickets" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div style={{ animation: "scrollY 1.8s ease-in-out infinite" }} className="w-px h-10 bg-gradient-to-b from-[#a0ef46] to-transparent" />
            <span className="font-proxima text-[8px] uppercase tracking-[0.5em] text-white/20">Scroll</span>
          </motion.div>

          {/* Lime bottom bar — sweeps in */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] w-full bg-[#a0ef46] z-30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left" }}
          />
        </section>

        {/* ══════════════════════════════════════════════════════════════
             TICKER 1
           ══════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-y border-white/6 bg-black py-4">
          <div className="ticker-inner flex whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8">
                <span className="font-sarpanch text-sm font-black uppercase tracking-[0.15em] text-white/60">{item}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#a0ef46]" />
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
             STATS ROW
           ══════════════════════════════════════════════════════════════ */}
        <section ref={statsRef} className="relative bg-black border-b border-white/6 px-8 md:px-14 py-20 md:py-28 overflow-hidden">
          {/* giant BG text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span className="font-sarpanch font-black text-white/[0.025] leading-none" style={{ fontSize: "clamp(8rem, 30vw, 26rem)" }}>
              BBX
            </span>
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid grid-cols-3 gap-8 md:gap-16">
              {STATS.map((s, i) => <StatBlock key={s.label} stat={s} index={i} />)}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
             REEL STAIRCASE
           ══════════════════════════════════════════════════════════════ */}
        <section id="vol1-reels" className="relative overflow-visible bg-black px-8 md:px-14 pt-20 pb-52 md:pt-28">
          <div className="mx-auto max-w-7xl">

            {/* Section header */}
            <div ref={reelsHeadRef} className="mb-20 md:mb-24">
              <div className="flex items-end gap-8 mb-6">
                <div className="overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={reelsHeadInView ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="block font-proxima text-[9px] uppercase tracking-[0.5em] text-[#a0ef46]"
                  >
                    Vol.01 Signal Wall
                  </motion.span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  {["Tall clips.", "Heavy memory."].map((line, i) => (
                    <div key={line} className="overflow-hidden">
                      <motion.span
                        initial={{ y: "110%" }}
                        animate={reelsHeadInView ? { y: "0%" } : {}}
                        transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                        className="block font-sarpanch font-black uppercase leading-[0.85] text-white"
                        style={{ fontSize: "clamp(2.4rem, 8vw, 7rem)" }}
                      >
                        {line}
                      </motion.span>
                    </div>
                  ))}
                </div>
                <span className="font-sarpanch font-black text-white/[0.06] leading-none hidden md:block select-none" style={{ fontSize: "clamp(4rem, 12vw, 11rem)" }}>
                  03
                </span>
              </div>
            </div>

            {/* Staircase grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto relative">
              {reelClips.map((clip, i) => (
                <div key={clip.stat} className={`stair-${i}`}>
                  <ReelCard clip={clip} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
             GREEN TICKER
           ══════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-y border-black/20 bg-[#a0ef46] py-3">
          <div className="ticker-inner-rev flex whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8">
                <span className="font-sarpanch text-sm font-black uppercase tracking-[0.15em] text-black">{item}</span>
                <span className="h-1 w-1 rounded-full bg-black/30" />
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
             EDITORIAL STATEMENT
           ══════════════════════════════════════════════════════════════ */}
        <section
          ref={statRef}
          className="relative overflow-hidden bg-black border-t border-white/6 px-8 md:px-14 py-28 md:py-44"
        >
          {/* Giant ghost 01 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
            <span className="font-sarpanch font-black text-white opacity-[0.022] leading-none" style={{ fontSize: "clamp(10rem, 45vw, 40rem)" }}>
              01
            </span>
          </div>

          {/* Horizontal lime line — left edge */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={statInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-8 md:left-14 top-28 bottom-28 w-[1.5px] bg-[#a0ef46]/20"
          />

          <div className="relative z-10 mx-auto max-w-6xl pl-8">
            {[
              { text: "THE ROOM", color: "text-white/88" },
              { text: "REMEMBERED", color: "text-[#a0ef46]" },
              { text: "EVERYTHING", color: "text-white/15" },
            ].map(({ text, color }, i) => (
              <div key={text} className="overflow-hidden">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={statInView ? { y: "0%", opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: i * 0.16, ease: [0.76, 0, 0.24, 1] }}
                  className={`block font-sarpanch font-black uppercase leading-[0.82] ${color}`}
                  style={{ fontSize: "clamp(2rem, 8.5vw, 9rem)" }}
                >
                  {text}
                </motion.span>
              </div>
            ))}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={statInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="mt-12 h-px w-full bg-white/8"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={statInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-8 font-proxima text-base text-white/30 max-w-xs"
            >
              Vol.01 · BOOMBAP Archive · Phone First Format
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
             CTA SPLIT
           ══════════════════════════════════════════════════════════════ */}
        <CtaSection />

      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  CTA SECTION                                                     */
/* ─────────────────────────────────────────────────────────────── */

function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black border-t border-white/8 min-h-[60vh] flex flex-col md:block"
    >
      {/* LEFT PANEL — black */}
      <div className="cta-split-left bg-black py-16 md:py-0">
        <div className="flex flex-col justify-center h-full px-6 md:px-16 w-full md:max-w-[450px] lg:max-w-[600px]">
          <div className="overflow-hidden mb-4">
            <motion.span
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-proxima text-[9px] uppercase tracking-[0.5em] text-white/30 block"
            >
              Archive to next drop
            </motion.span>
          </div>
          {["Vol.02", "is loading"].map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 1.0, delay: 0.1 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                className="block font-sarpanch font-black uppercase leading-[0.82] text-white"
                style={{ fontSize: "clamp(2.2rem, 7.5vw, 6rem)" }}
              >
                {line}
              </motion.span>
            </div>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 font-proxima text-base text-white/45 leading-relaxed max-w-[22rem]"
          >
            Vol.01 was the ignition. The recap keeps the room alive while
            the next BOOMBAP night is being shaped.
          </motion.p>
        </div>
      </div>

      {/* RIGHT PANEL — lime */}
      <div className="cta-split-right bg-[#a0ef46] py-16 md:py-0">
        <div className="flex flex-col justify-center h-full items-start md:items-end px-6 md:pr-16 w-full md:max-w-[320px] lg:max-w-[380px] md:ml-auto md:mr-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start md:items-end gap-5 w-full"
          >
            <span className="font-sarpanch font-black uppercase text-black/20 leading-none text-left md:text-right"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}>
              BB
            </span>
            <p className="font-proxima text-sm text-black/55 text-left md:text-right leading-relaxed">
              Next signal coming.
              <br />
              Claim your spot.
            </p>
            <div className="flex flex-col gap-3 items-start md:items-end">
              <Link href="/events" className="boombap-button bg-black text-[#a0ef46] border-black hover:bg-black/90">
                <ScrambleText text="See Events" />
              </Link>
              <Link href="/" className="font-proxima text-[9px] uppercase tracking-[0.4em] text-black/50 underline-sweep pb-0.5">
                Back Home →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}