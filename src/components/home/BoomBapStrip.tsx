"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MarqueeStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <>
      <motion.section
        ref={ref}
        className="overflow-hidden bg-black/70 backdrop-blur-sm py-5 relative"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated glow line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "center" }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "center" }}
        />

        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 pr-16 text-white text-[10px] tracking-[0.5em] uppercase font-proxima"
            >
              BOOMBAP
              <motion.span
                className="text-secondary"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}
              >
                ✦
              </motion.span>
              THE CULTURE LIVES HERE
              <motion.span
                className="text-primary"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 + 0.5 }}
              >
                ✦
              </motion.span>
            </span>
          ))}
        </div>
      </motion.section>
    </>
  );
}