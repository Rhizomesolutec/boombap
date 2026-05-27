"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ElementType } from "react";

type MotionRevealProps = HTMLMotionProps<"div"> & {
  as?: "div" | "span" | "h1" | "section";
  delay?: number;
  float?: boolean;
};

export default function MotionReveal({
  as = "div",
  children,
  delay = 0,
  float = false,
  transition,
  ...props
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] as ElementType;

  return (
    <MotionTag
      initial={reduceMotion ? false : { opacity: 0, y: float ? 0 : 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: float ? undefined : 0 }}
      viewport={{ once: true, amount: 0.22 }}
      animate={
        float && !reduceMotion
          ? {
            y: [0, -10, 0],
            rotate: [0, -0.6, 0],
          }
          : undefined
      }
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 80,
        mass: 1,
        delay,
        ...(float
          ? {
            y: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          }
          : {}),
        ...transition,
      }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
