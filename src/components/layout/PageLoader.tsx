"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let v = 0;
    const interval = setInterval(() => {
      v += Math.floor(Math.random() * 18) + 6;
      if (v >= 100) {
        v = 100;
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => setDone(true), 1100);
        }, 300);
      }
      setCount(v);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] bg-[#a0ef46] flex flex-col items-end justify-end p-10 overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Giant background counter number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className="font-sarpanch font-black text-black/10 leading-none"
              style={{ fontSize: "clamp(12rem, 35vw, 28rem)" }}
            >
              {count}
            </span>
          </div>

          {/* Bottom bar: label + percent */}
          <div className="relative z-10 flex items-end justify-between w-full">
            <span className="font-proxima text-[9px] uppercase tracking-[0.5em] text-black/50">
              BOOMBAP
            </span>
            <span className="font-sarpanch font-black text-black text-2xl">
              {count}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 mt-4 w-full h-px bg-black/20 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              style={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[9999] bg-[#a0ef46]"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
