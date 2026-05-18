"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      setActive(Boolean(target.closest("a, button, [role='button'], input, textarea, select")));
    };

    const onPointerLeave = () => setVisible(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerover", onPointerOver);
    document.documentElement.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`custom-cursor ${active ? "is-active" : ""} ${visible ? "is-visible" : ""}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <span className="custom-cursor__ring" />
      <span className="custom-cursor__dot" />
    </div>
  );
}
