"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
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

/* ─────────────────────────────────────────────────────────────── */
/*  DATA                                                           */
/* ─────────────────────────────────────────────────────────────── */

const recapVideo =
  "https://player.vimeo.com/video/1193920399?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0";

const reelClips = [
  { title: "The First Drop", label: "Opening Signal", src: "/dj.mp4", stat: "01", tc: "00:00:00" },
  { title: "Selectors Locked", label: "Deck Heat", src: "/dj.mp4", stat: "02", tc: "00:47:22" },
  { title: "Crowd Frequency", label: "Room Lift", src: "/dj.mp4", stat: "03", tc: "02:11:08" },
  { title: "Afterglow", label: "Last Frame", src: "/dj.mp4", stat: "04", tc: "03:58:41" },
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
/*  SPLIT TEXT — character level stagger (Obys signature)         */
/* ─────────────────────────────────────────────────────────────── */

function SplitReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  inView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  MAGNETIC CARD HOOK                                             */
/* ─────────────────────────────────────────────────────────────── */

function useMagnet(strength = 0.22) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };

  const onMouseLeave = () => { x.set(0); y.set(0); };

  return { sx, sy, onMouseMove, onMouseLeave };
}

function ReelCard({
  clip,
  index,
  reduceMotion,
}: {
  clip: (typeof reelClips)[number];
  index: number;
  reduceMotion: boolean | null;
}) {
  const mag = useMagnet(0.18);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={cardRef}
      {...(!reduceMotion ? {
        style: { x: mag.sx, y: mag.sy },
        onMouseMove: mag.onMouseMove,
        onMouseLeave: mag.onMouseLeave,
      } : {})}
      initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
      animate={inView
        ? { opacity: 1, clipPath: "inset(0% 0 0 0)" }
        : {}
      }
      transition={{ duration: 1.1, delay: index * 0.14, ease: [0.76, 0, 0.24, 1] }}
      className={`stair-${index} card-hover group relative cursor-pointer`}
    >
      {/* portrait video wrapper */}
      <div className="relative aspect-[9/16] overflow-hidden border border-white/10 group-hover:border-[#a0ef46]/40 transition-colors duration-500">

        <video
          src={clip.src}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700"
          autoPlay muted loop playsInline
        />

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-black/30" />

        {/* timecode top-right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="font-proxima text-[7px] uppercase tracking-[0.3em] text-white/40">
            {clip.tc}
          </span>
        </div>

        {/* number badge — left side rotated */}
        <div className="absolute top-4 left-4 z-10">
          <span className="font-sarpanch text-xs font-black text-[#a0ef46]">
            {clip.stat}
          </span>
        </div>

        {/* bottom info — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <span className="font-proxima text-[7px] uppercase tracking-[0.35em] text-[#a0ef46]">
            {clip.label}
          </span>
          <h3 className="mt-2 font-sarpanch text-xl font-black uppercase leading-none text-white">
            {clip.title}
          </h3>
        </div>

        {/* hover: thin lime bottom bar — sweep */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[#a0ef46] transition-all duration-700 z-20" />

        {/* hover: full-screen number overlay (Obys card hover style) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="font-sarpanch font-black text-white/5 leading-none select-none"
            style={{ fontSize: "clamp(5rem, 15vw, 9rem)" }}>
            {clip.stat}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  PAGE                                                           */
/* ─────────────────────────────────────────────────────────────── */

export default function Vol1RecapExperience() {
  const reduceMotion = useReducedMotion();

  // Global scroll progress.
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });
  const progressWidth = useTransform(smoothScroll, [0, 1], ["0%", "100%"]);

  /* hero section scroll */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: hp } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroVideoY = useTransform(hp, [0, 1], ["0%", "40%"]);
  const heroVolY = useTransform(hp, [0, 1], ["0%", "-35%"]);
  const heroNumY = useTransform(hp, [0, 1], ["0%", "25%"]);
  const heroScale = useTransform(hp, [0, 1], [1, 0.92]);

  /* editorial statement ref */
  const statementRef = useRef(null);
  const statementInView = useInView(statementRef, { once: true, margin: "-100px" });

  /* hero text always visible — loader is now global */
  const heroTextInView = true;

  return (
    <>

      <main className="relative overflow-hidden bg-black text-white cursor-none selection:bg-[#a0ef46] selection:text-black">

        {/* ── GLOBAL STYLES ─────────────────────────────────────────────── */}
        <style>{`
          /* Ticker loop */
          @keyframes tickerScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .ticker-inner { animation: tickerScroll 22s linear infinite; }
          .ticker-inner:hover { animation-play-state: paused; }
          .ticker-inner-rev { animation: tickerScroll 28s linear infinite reverse; }

          /* Pulse */
          @keyframes pulse {
            0%,100% { opacity:1; transform:scale(1); }
            50%      { opacity:0.5; transform:scale(0.8); }
          }

          /* Staircase offsets */
          @media (min-width: 768px) {
            .stair-0 { margin-top: 0; }
            .stair-1 { margin-top: 14%; }
            .stair-2 { margin-top: 28%; }
            .stair-3 { margin-top: 42%; }
          }

          /* Corner brackets */
          .bracket::before,
          .bracket::after {
            content: "";
            position: absolute;
            width: 14px; height: 14px;
            border-color: #a0ef46;
            border-style: solid;
          }
          .bracket::before {
            top: -1px; left: -1px;
            border-width: 1.5px 0 0 1.5px;
          }
          .bracket::after {
            bottom: -1px; right: -1px;
            border-width: 0 1.5px 1.5px 0;
          }

          /* Hover underline sweep */
          .underline-sweep {
            background: linear-gradient(90deg, #a0ef46, #a0ef46) no-repeat bottom left;
            background-size: 0% 1.5px;
            transition: background-size .5s cubic-bezier(0.16,1,0.3,1);
          }
          .underline-sweep:hover { background-size: 100% 1.5px; }

          /* Rotated sidebar text */
          .rotate-sidebar {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
          }

          /* Card lift shadow */
          .card-hover {
            transition: box-shadow .5s ease;
          }
          .card-hover:hover {
            box-shadow: 0 32px 80px -12px rgba(160,239,70,.22);
          }

          /* Line through text on hover */
          .line-through-hover {
            position: relative;
          }
          .line-through-hover::after {
            content:'';
            position:absolute;
            left:0;right:0;
            top:50%;
            height:1.5px;
            background:#a0ef46;
            transform:scaleX(0);
            transform-origin:left;
            transition:transform .5s cubic-bezier(0.16,1,0.3,1);
          }
          .line-through-hover:hover::after { transform:scaleX(1); }

          /* Noise grain overlay */
          .grain::before {
            content:'';
            position:fixed;
            inset:0;
            pointer-events:none;
            z-index:200;
            background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
            background-size: 200px 200px;
            opacity:.035;
          }

          /* Obys-style number counter */
          .obys-counter {
            font-variant-numeric: tabular-nums;
          }
        `}</style>

        {/* ── NOISE GRAIN ───────────────────────────────────────────────── */}
        <div className="grain" aria-hidden />

        {/* ── TOP PROGRESS BAR ──────────────────────────────────────────── */}
        <motion.div
          className="fixed top-0 left-0 h-[2px] bg-[#a0ef46] z-[500] origin-left"
          style={{ width: progressWidth }}
        />

        {/* ── VERTICAL SCROLL RULER ─────────────────────────────────────── */}
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 h-32 w-px bg-white/10 hidden md:block">
          <motion.div
            className="w-full bg-[#a0ef46] origin-top"
            style={{ scaleY: smoothScroll, height: "100%" }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
             HERO — BROADCAST MONITOR LAYOUT
           ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[100svh] overflow-hidden bg-black px-6 md:px-10"
        >
          {/* background crowd — very subtle */}
          <motion.div
            className="absolute inset-0 -z-10"
            style={reduceMotion ? undefined : { y: heroVideoY, scale: heroScale }}
          >
            <Image
              src="/crowd-section.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.07] grayscale"
            />
          </motion.div>

          {/* left sidebar label */}
          <motion.div
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4"
          >
            <span className="rotate-sidebar font-proxima text-[9px] uppercase tracking-[0.5em] text-white/25">
              BOOMBAP · 2024 · VOL.01
            </span>
          </motion.div>

          {/* main grid: [monitor | type] */}
          <div className="relative z-10 mx-auto grid max-w-7xl min-h-[100svh] items-center
            grid-cols-1 gap-8
            md:grid-cols-[1fr_auto] md:gap-0">

            {/* ── MONITOR (left) ── */}
            <motion.div
              style={reduceMotion ? undefined : { y: heroVideoY }}
              className="relative flex flex-col justify-center py-24 md:py-0"
            >
              {/* monitor frame — wipe reveal from bottom */}
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={true ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
                transition={{ duration: 1.3, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="bracket relative w-full max-w-[min(380px,80vw)] mx-auto md:mx-0 aspect-[9/16] overflow-hidden border border-white/14 bg-black shadow-[0_0_120px_rgba(160,239,70,0.06)]"
              >
                <iframe
                  src={recapVideo}
                  className="absolute left-1/2 top-1/2 h-[125vh] w-[125vw] -translate-x-1/2 -translate-y-1/2"
                  allow="autoplay"
                  allowFullScreen
                />
                {/* cinematic grade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* timecode overlay */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex justify-between items-end">
                  <div>
                    <p className="font-proxima text-[8px] uppercase tracking-[0.35em] text-[#a0ef46]/70">Timecode</p>
                    <p className="font-sarpanch text-lg font-black text-white/90 leading-none">00:00:00</p>
                  </div>
                  <p className="font-sarpanch text-xs font-black uppercase text-white/30">9:16</p>
                </div>

                {/* top-left tag */}
                <div className="absolute top-5 left-5 z-10">
                  <p className="font-proxima text-[8px] uppercase tracking-[0.35em] text-white/35">Featured Reel</p>
                </div>
              </motion.div>

              {/* label below monitor */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={true ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-6 flex items-center gap-6 max-w-[min(380px,80vw)] mx-auto md:mx-0"
              >
                <div className="h-px flex-1 bg-white/10" />
                <p className="font-proxima text-[9px] uppercase tracking-[0.4em] text-white/30">
                  BOOMBAP Archive
                </p>
              </motion.div>
            </motion.div>

            {/* ── GIANT TYPE (right) ── */}
            <div className="relative flex flex-col items-start md:items-end md:pl-10 pb-16 md:pb-0">

              {/* "VOL" — character reveal */}
              <motion.div
                style={reduceMotion ? undefined : { y: heroVolY }}
                className="relative overflow-hidden"
              >
                <SplitReveal
                  text="VOL"
                  inView={heroTextInView}
                  delay={0.2}
                  stagger={0.06}
                  className="font-sarpanch font-black uppercase text-white leading-[0.82] select-none"
                />
                <style>{`.split-vol { font-size: clamp(5rem, 15vw, 12.5rem); }`}</style>
                {/* inline style workaround */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{ fontSize: "clamp(5rem, 15vw, 12.5rem)" }}
                  aria-hidden
                />
              </motion.div>

              {/* horizontal divider — wipe */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={true ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "right" }}
                className="my-3 md:my-4 h-px w-full bg-white/12 origin-right"
              />

              {/* "01" — clip-path from bottom */}
              <motion.div
                style={reduceMotion ? undefined : { y: heroNumY }}
                className="overflow-hidden"
              >
                <motion.span
                  initial={{ y: "100%" }}
                  animate={true ? { y: "0%" } : {}}
                  transition={{ duration: 1.1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="font-sarpanch font-black uppercase leading-[0.78] select-none block text-[#a0ef46]"
                  style={{ fontSize: "clamp(7rem, 20vw, 18rem)" }}
                >
                  01
                </motion.span>
              </motion.div>

              {/* "RECAP" small beneath — word reveal */}
              <div className="mt-4 md:mt-6">
                <div className="overflow-hidden mb-3">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={true ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-proxima text-[10px] uppercase tracking-[0.55em] text-white/35 block"
                  >
                    Phone First Recap
                  </motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={true ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="font-proxima text-base text-white/55 leading-relaxed max-w-[22rem]"
                >
                  Reel-sized fragments from the first BOOMBAP night — staged so
                  every scroll feels like stepping deeper into the room.
                </motion.p>
              </div>

              {/* CTAs — staggered slide-up */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={true ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="mt-8 flex gap-4"
              >
                <a href="#vol1-reels" className="boombap-button">
                  <ScrambleText text="Enter Recap" />
                </a>
                <Link href="/tickets" className="boombap-button boombap-button--ghost">
                  <ScrambleText text="Vol.02 Tickets" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* scroll cue */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-[#a0ef46] to-transparent"
            />
            <span className="font-proxima text-[8px] uppercase tracking-[0.5em] text-white/20">Scroll</span>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
             STATS TICKER
           ══════════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-y border-white/8 bg-black py-4">
          <div className="ticker-inner flex whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8">
                <span className="font-sarpanch text-sm font-black uppercase tracking-[0.15em] text-white/80">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#a0ef46]" />
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
             REEL STAIRCASE
           ══════════════════════════════════════════════════════════════════ */}
        <section
          id="vol1-reels"
          className="relative overflow-visible bg-black px-6 pt-20 pb-48 md:px-10 md:pt-28"
        >
          <div className="mx-auto max-w-7xl">

            {/* section label — split text reveal */}
            <div className="mb-16 flex items-end justify-between">
              <div>
                <div className="overflow-hidden mb-3">
                  <ReelSectionLabel />
                </div>
                <ReelSectionHeading />
              </div>
              <span className="font-sarpanch font-black text-white/8 leading-none hidden md:block"
                style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}>
                04
              </span>
            </div>

            {/* staircase grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 relative">
              {reelClips.map((clip, i) => (
                <ReelCard
                  key={clip.stat}
                  clip={clip}
                  index={i}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
             REVERSE TICKER (Obys uses dual tickers)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="relative overflow-hidden border-y border-white/8 bg-[#a0ef46] py-3">
          <div className="ticker-inner-rev flex whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8">
                <span className="font-sarpanch text-sm font-black uppercase tracking-[0.15em] text-black">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-black/40" />
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
             EDITORIAL STATEMENT
           ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={statementRef}
          className="relative overflow-hidden bg-black border-t border-white/8 px-6 py-24 md:px-10 md:py-36"
        >
          {/* huge background "01" */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span
              className="font-sarpanch font-black text-white opacity-[0.025] leading-none"
              style={{ fontSize: "clamp(18rem, 50vw, 50rem)" }}
            >
              01
            </span>
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            {["THE ROOM", "REMEMBERED", "EVERYTHING"].map((word, i) => {
              const colors = ["text-white/90", "text-[#a0ef46]", "text-white/18"];
              return (
                <div key={word} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "110%", opacity: 0 }}
                    animate={statementInView ? { y: "0%", opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: i * 0.18, ease: [0.76, 0, 0.24, 1] }}
                    className={`block font-sarpanch font-black uppercase leading-[0.82] ${colors[i]}`}
                    style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
                  >
                    {word}
                  </motion.span>
                </div>
              );
            })}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={statementInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="mt-10 h-px w-full bg-white/10"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={statementInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-7 font-proxima text-base text-white/38 max-w-sm"
            >
              Vol.01 · BOOMBAP Archive · Phone First Format
            </motion.p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
             CTA — DIAGONAL SPLIT
           ══════════════════════════════════════════════════════════════════ */}
        <CtaSection />

      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  ISOLATED COMPONENTS (avoid hooks-in-loops ESLint issue)        */
/* ─────────────────────────────────────────────────────────────── */

function ReelSectionLabel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.span
      ref={ref}
      initial={{ y: "110%" }}
      animate={inView ? { y: "0%" } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="block font-proxima text-[9px] uppercase tracking-[0.5em] text-[#a0ef46]"
    >
      Vol.01 Reel Wall
    </motion.span>
  );
}

function ReelSectionHeading() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref}>
      {["Tall clips.", "Heavy memory."].map((line, i) => (
        <div key={line} className="overflow-hidden">
          <motion.span
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1, delay: i * 0.12, ease: [0.76, 0, 0.24, 1] }}
            className="block font-sarpanch font-black uppercase leading-[0.82] text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black border-t border-white/8"
      style={{ minHeight: "60vh" }}
    >
      {/* LEFT PANEL — black */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ clipPath: "polygon(0 0, 70% 0, 57% 100%, 0 100%)" }}
      >
        <div className="flex flex-col justify-center h-full px-6 md:px-16 py-20 max-w-[55%]">
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
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
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
      <div className="absolute inset-0 bg-[#a0ef46] z-0">
        <div className="flex flex-col justify-center h-full items-end pr-6 md:pr-16 py-20">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-5 ml-auto mr-0 w-full max-w-[38%]"
          >
            <span className="font-sarpanch font-black uppercase text-black/20 leading-none text-right"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}>
              BB
            </span>
            <p className="font-proxima text-sm text-black/55 text-right leading-relaxed">
              Next signal coming.
              <br />
              Claim your spot.
            </p>
            <div className="flex flex-col gap-3 items-end">
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
