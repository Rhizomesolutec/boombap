"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Waves from "./Waves";
import ScrambleText from "../ui/ScrambleText";

const MARQUEE_TEXT =
  "BOOMBAP VOL.02 \u00a0•\u00a0 COMING SOON \u00a0•\u00a0 CULTURE & SOUND \u00a0•\u00a0 RAW FREQUENCIES \u00a0•\u00a0 ";

/* ── Magnetic button wrapper ── */
function MagneticWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

/* ── Floating particle ── */
function Particle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.9, 0],
        scale: [0, 1, 0.2],
        y: [0, -100, -200],
        x: [0, Math.random() > 0.5 ? 40 : -40, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: content drifts up as user scrolls
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const wavesY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const particles = [
    { delay: 0.3, x: "8%",  y: "60%", size: 5,  color: "var(--color-primary)" },
    { delay: 0.8, x: "92%", y: "55%", size: 4,  color: "var(--color-secondary)" },
    { delay: 1.5, x: "18%", y: "72%", size: 6,  color: "var(--color-primary)" },
    { delay: 0.4, x: "78%", y: "68%", size: 4,  color: "var(--color-primary)" },
    { delay: 2.1, x: "48%", y: "80%", size: 5,  color: "var(--color-secondary)" },
    { delay: 2.5, x: "33%", y: "66%", size: 3,  color: "var(--color-primary)" },
    { delay: 1.0, x: "65%", y: "62%", size: 6,  color: "var(--color-secondary)" },
    { delay: 3.2, x: "5%",  y: "50%", size: 3,  color: "var(--color-primary)" },
    { delay: 1.8, x: "56%", y: "75%", size: 4,  color: "var(--color-primary)" },
    { delay: 0.6, x: "84%", y: "42%", size: 5,  color: "var(--color-secondary)" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-primary"
    >
      {/* Scoped styles */}
      <style>{`
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

      {/* Floating particles */}
      {mounted && particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Waves — with parallax */}
      <motion.div className="absolute inset-0 z-[3]" style={{ y: wavesY }}>
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
          className="pointer-events-none opacity-85"
        />
      </motion.div>

      {/* Main content — parallax drift on scroll */}
      <motion.div
        className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-5 pt-24 pb-32 text-center sm:px-6 md:px-10 md:pt-32 md:pb-32"
        style={{ y: contentY }}
      >
        <div className="flex-1 flex w-full flex-col items-center justify-center">

          {/* Label — letter-space expand */}
          <motion.span
            className="mb-4 block font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-black/70 sm:text-[10px]"
            initial={{ opacity: 0, letterSpacing: "0.8em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Vol. 02 / COMING SOON
          </motion.span>

          {/* Logo — scale + blur reveal */}
          <motion.div
            className="relative w-full max-w-[min(94vw,68rem)] overflow-hidden aspect-[4909/1327] sm:max-w-[min(88vw,68rem)]"
            style={{ scale: logoScale, opacity: logoOpacity }}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              fill
              src="/boombap trans.png"
              alt="BOOMBAP"
              priority
              sizes="(min-width: 640px) 88vw, 94vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mt-6 grid justify-items-center gap-5 border-t border-black/20 px-2 pt-5 sm:mt-8 sm:px-4 sm:pt-6"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="max-w-xl font-proxima text-base leading-relaxed text-black/72 sm:text-xl md:text-2xl">
              We have not created anything. We are showing what already exists here.
            </p>
          </motion.div>

          {/* CTA buttons — magnetic */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticWrap>
              <Link href="/tickets" className="boombap-button !bg-secondary">
                <ScrambleText text="Secure Tickets" />
              </Link>
            </MagneticWrap>
            <MagneticWrap>
              <Link href="/vol1-recap" className="boombap-button boombap-button--ghost">
                <ScrambleText text="Watch Recap" />
              </Link>
            </MagneticWrap>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#culture"
        aria-label="Scroll to culture"
        className="absolute inset-x-0 bottom-14 z-30 flex justify-center text-black/65 transition-colors hover:text-secondary focus:outline-none md:bottom-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="boombap-scroll-cue__inner flex flex-col items-center gap-2 font-proxima text-[9px] font-bold uppercase tracking-[0.32em]">
          <span>Scroll</span>
          <span className="h-8 w-px bg-current" />
        </span>
      </motion.a>

      {/* Marquee */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-black/15 bg-primary/80 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="boombap-marquee py-3">
          {Array(10).fill(null).map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-proxima text-[8px] uppercase tracking-[0.45em] text-black"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Rule */}
      <div className="relative z-10 h-px w-full bg-black/15" />
    </section>
  );
}
