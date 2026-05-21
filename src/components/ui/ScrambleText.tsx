"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrambleTextProps = {
  text: string;
  className?: string;
};

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@!?*+-=/";
const FRAME_MS = 28;
const SCRAMBLE_MS = 90;
const SETTLE_MS = 360;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

export default function ScrambleText({ text, className }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const clearScramble = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startScramble = useCallback(() => {
    clearScramble();
    setDisplayText(
      text
        .split("")
        .map((character) => (character === " " ? " " : randomChar()))
        .join(""),
    );

    const startedAt = window.performance.now();
    const charactersToSettle = text.replaceAll(" ", "").length;

    intervalRef.current = window.setInterval(() => {
      const elapsed = window.performance.now() - startedAt;
      const settleProgress = Math.max(0, elapsed - SCRAMBLE_MS) / SETTLE_MS;
      const settledCharacters = Math.floor(
        Math.min(1, settleProgress) * (charactersToSettle + 1),
      );

      let nonSpaceIndex = 0;
      const nextText = text
        .split("")
        .map((character) => {
          if (character === " ") {
            return " ";
          }

          nonSpaceIndex += 1;
          return nonSpaceIndex <= settledCharacters ? character : randomChar();
        })
        .join("");

      setDisplayText(nextText);

      if (elapsed >= SCRAMBLE_MS + SETTLE_MS) {
        clearScramble();
        setDisplayText(text);
      }
    }, FRAME_MS);
  }, [clearScramble, text]);

  useEffect(() => clearScramble, [clearScramble]);

  return (
    <span
      aria-label={text}
      className={className}
      onMouseEnter={startScramble}
      style={{
        display: "inline-block",
        overflow: "hidden",
        position: "relative",
        verticalAlign: "baseline",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          inset: 0,
          overflow: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
        }}
      >
        {displayText}
      </span>
    </span>
  );
}
