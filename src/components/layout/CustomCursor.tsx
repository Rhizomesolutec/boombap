"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  /* dot — snappy */
  const dotX = useSpring(cursorX, { stiffness: 900, damping: 50, mass: 0.2 });
  const dotY = useSpring(cursorY, { stiffness: 900, damping: 50, mass: 0.2 });

  /* ring — lags behind for that Obys-style trail */
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.6 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.6 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("normal-cursor-mode");
    document.documentElement.classList.add("custom-cursor-mode");

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-grow]")) {
        setIsHovering(true);
      }
    };
    const out = () => setIsHovering(false);
    const leave = () => setIsVisible(false);
    const enter = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-mode");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Dot — snappy, always on top */}
      <motion.div
        aria-hidden="true"
        className="custom-cursor fixed z-[9999] pointer-events-none rounded-full bg-[#a0ef46] mix-blend-difference"
        style={{
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          width: isHovering ? 6 : 8,
          height: isHovering ? 6 : 8,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Ring — lazy trail */}
      <motion.div
        aria-hidden="true"
        className="custom-cursor fixed z-[9998] pointer-events-none rounded-full border border-[#a0ef46]/60 mix-blend-difference"
        style={{
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 52 : 32,
          height: isHovering ? 52 : 32,
          opacity: isVisible ? (isHovering ? 1 : 0.5) : 0,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
