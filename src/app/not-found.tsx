"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MotionReveal from "../components/ui/MotionReveal";
import ScrambleText from "../components/ui/ScrambleText";

export default function NotFoundContent() {
  return (
    <section className="normal-cursor-scope relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col items-center justify-center p-6 md:p-10 select-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none -z-20" />
      <div className="absolute inset-0 bg-radial-to-c from-transparent via-black/40 to-black pointer-events-none -z-10" />

      <div className="absolute inset-0 pointer-events-none z-10 vhs-frame opacity-40" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-30 select-none overflow-hidden max-w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.035, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-sarpanch font-black tracking-tighter text-[25vw] md:text-[20vw] leading-none text-white text-center"
        >
          404
        </motion.div>
      </div>

      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border border-primary/30 bg-primary/5 text-primary font-proxima text-[10px] font-bold uppercase tracking-[0.45em] px-4 py-1.5"
        >
          System Alert // Track Mismatched
        </motion.div>

        <div className="relative">
          <MotionReveal
            as="h1"
            delay={0.15}
            className="kinetic-title font-sarpanch text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-none text-white tracking-tight"
          >
            BEAT NOT FOUND
          </MotionReveal>
        </div>

        <MotionReveal
          delay={0.3}
          className="max-w-md border-l border-primary/50 pl-5 text-left md:text-center md:border-l-0 md:pl-0 mt-2"
        >
          <p className="font-proxima text-sm leading-relaxed text-white/60">
            The tempo changed, or this record was taken off the deck. The page you are looking for has been scrambled in the mix.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.45} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/" className="boombap-button">
            <ScrambleText text="Return to Site" />
          </Link>
          <Link href="/tickets" className="boombap-button boombap-button--ghost">
            <ScrambleText text="Book Tickets" />
          </Link>
        </MotionReveal>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/20 font-mono text-[9px] uppercase tracking-widest pointer-events-none z-20">
        <span>ERR_CODE: BOOMBAP_404_PAGE</span>
        <span>SYS_STATUS: RUNNING_1337</span>
      </div>
    </section>
  );
}