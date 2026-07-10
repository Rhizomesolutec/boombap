"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MARQUEE_TEXT =
  "BOOMBAP VOL.02 \u00a0•\u00a0 COMING SOON \u00a0•\u00a0 CULTURE & SOUND \u00a0•\u00a0 RAW FREQUENCIES \u00a0•\u00a0 ";

/* ── Floating particle dot ── */
function Particle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.3],
        y: [0, -80, -160],
        x: [0, Math.random() > 0.5 ? 30 : -30, 0],
      }}
      transition={{
        duration: 3.5 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ── Horizontal scan line that sweeps the video ── */
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-x-0 h-[2px] z-10 pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(162,255,71,0.35), transparent)",
      }}
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Letter block for BOOM / BAP ── */
function CinematicWord({
  word,
  colorClass,
  delay,
}: {
  word: string;
  colorClass: string;
  delay: number;
}) {
  const letters = word.split("");
  return (
    <span className={`font-sarpanch font-black uppercase ${colorClass} leading-[0.78] tracking-tighter flex justify-center`}
      style={{ fontSize: "min(31vw, 44vh)", display: "flex" }}
    >
      {letters.map((l, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: 80, rotateX: -90, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {l}
        </motion.span>
      ))}
    </span>
  );
}

export default function MHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  /* ── Glitch flicker state ── */
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    setMounted(true);
    const glitchInterval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 3400 + Math.random() * 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  /* ── Particles config ── */
  const particles = [
    { delay: 0.2, x: "12%", y: "70%", size: 4, color: "var(--color-primary)" },
    { delay: 0.7, x: "88%", y: "65%", size: 3, color: "var(--color-secondary)" },
    { delay: 1.4, x: "22%", y: "80%", size: 5, color: "var(--color-primary)" },
    { delay: 0.5, x: "75%", y: "75%", size: 3, color: "var(--color-primary)" },
    { delay: 1.9, x: "50%", y: "85%", size: 4, color: "var(--color-secondary)" },
    { delay: 2.3, x: "35%", y: "72%", size: 3, color: "var(--color-primary)" },
    { delay: 0.9, x: "62%", y: "68%", size: 5, color: "var(--color-secondary)" },
    { delay: 3.1, x: "8%",  y: "60%", size: 3, color: "var(--color-primary)" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black text-white flex flex-col justify-between"
    >
      {/* ── Scoped styles ── */}
      <style>{`
        /* Marquee */
        .boombap-marquee {
          animation: boomMarquee 18s linear infinite;
          width: max-content;
          display: flex;
          gap: 0;
        }
        @keyframes boomMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Noise grain overlay */
        .bb-grain {
          animation: bbGrainShift 0.14s steps(1) infinite;
          pointer-events: none;
        }
        @keyframes bbGrainShift {
          0%   { background-position: 0% 0%; }
          20%  { background-position: 35% 66%; }
          40%  { background-position: 72% 18%; }
          60%  { background-position: 13% 85%; }
          80%  { background-position: 91% 42%; }
          100% { background-position: 0% 0%; }
        }

        /* Radial pulse */
        .bb-glow-pulse {
          animation: bbGlowPulse 3.2s ease-in-out infinite;
        }
        @keyframes bbGlowPulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%  { opacity: 0.32; transform: scale(1.08); }
        }

        /* Glitch clip */
        .bb-glitch-on {
          animation: bbGlitch 0.12s steps(1) forwards;
        }
        @keyframes bbGlitch {
          0%   { clip-path: inset(0 0 92% 0); transform: translateX(-4px); }
          25%  { clip-path: inset(30% 0 50% 0); transform: translateX(4px); }
          50%  { clip-path: inset(70% 0 10% 0); transform: translateX(-2px); }
          75%  { clip-path: inset(20% 0 75% 0); transform: translateX(3px); }
          100% { clip-path: none; transform: none; }
        }

        /* Marquee neon border */
        .bb-marquee-bar {
          box-shadow: 0 -1px 20px rgba(162, 255, 71, 0.18);
        }
      `}</style>

      {/* ── Film grain texture ── */}
      <div
        className="bb-grain absolute inset-0 z-[5] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Radial glow behind wordmark ── */}
      <div className="bb-glow-pulse absolute inset-x-0 top-[18%] z-[4] flex justify-center pointer-events-none">
        <div
          className="w-[70vw] h-[55vh] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(162,255,71,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      {mounted && particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* ── Subtitle top ── */}
      <div className="pt-20 sm:pt-24 px-6 text-center z-10 shrink-0">
        <motion.span
          className={`block font-proxima text-[10px] font-bold uppercase tracking-[0.5em] text-primary sm:text-[11px] ${glitching ? "bb-glitch-on" : ""}`}
          initial={{ opacity: 0, letterSpacing: "1.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Vol. 02 / COMING SOON
        </motion.span>
      </div>

      {/* ─── CINEMATIC WORDMARK ─── */}
      <div
        className="relative w-full h-[48vh] sm:h-[58vh] md:h-[70vh] z-10 shrink-0 select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 overflow-hidden bg-black flex flex-col" style={{ isolation: "isolate" }}>
        <ScanLine />  
        <video
          src="/dj.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(1.15) contrast(1.12) saturate(1.1)" }}
        />

        {/* Corner brackets - cinematic framing */}
        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-8 left-3 border-b-2 border-l-2",
          "bottom-8 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute w-6 h-6 border-primary z-20 pointer-events-none ${cls}`}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.08 }}
          />
        ))}

        {/* ── ROW 1: BOOM ── */}
        <div
          className="relative h-[50%] w-full flex items-end justify-center overflow-hidden pb-1"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <CinematicWord word="BOOM" colorClass="text-primary" delay={0.15} />
        </div>

        {/* ── ROW 2: BAP ── */}
        <div
          className="relative h-[calc(50%+2px)] w-full flex items-start justify-center overflow-hidden pt-1 -mt-[1px]"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <CinematicWord word="BAP" colorClass="text-secondary" delay={0.45} />
        </div>
        </div>
      </div>

      {/* ─── BOTTOM CONTENT ─── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 flex flex-col items-center text-center pb-16 sm:pb-20 shrink-0">
        <motion.p
          className="max-w-xl mx-auto font-proxima text-base leading-relaxed text-primary sm:text-lg pt-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          We have not created anything. We are showing what already exists here.
        </motion.p>

        {/* Animated divider line */}
        <motion.div
          className="mt-5 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.4 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "60%", transformOrigin: "center" }}
        />
      </div>

      {/* ── Marquee ── */}
      <motion.div
        className="bb-marquee-bar absolute bottom-0 left-0 right-0 z-20 border-t border-primary/30 bg-primary/90 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
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
      </motion.div>
    </section>
  );
}
